import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { JWTPayloadType } from "@/app/lib/definitions";
import { db } from "@/db/index";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  // Clear any existing auth-token cookie
  const cookieStore = cookies();
  const authToken = (await cookieStore).get("auth-token")?.value;
  if (authToken) {
    (await cookieStore).delete("auth-token");
  }

  // Get url and then code from it
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  // if no code is there
  if (!code)
    return NextResponse.json(
      { error: "Authorization code not found" },
      { status: 400 }
    );

  try {
    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json", // GitHub requires this header to return JSON
          "Content-Type": "application/x-www-form-urlencoded", // GitHub expects data in form of URL-encoded form
        },
        body: new URLSearchParams({
          client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
          client_secret: process.env.GITHUB_CLIENT_SECRET!,
          code: code,
        }),
      }
    );

    // Get the response data
    const tokenData = await tokenResponse.json();
    if (tokenData.error) {
      return NextResponse.json(
        { error: "Failed to get access token" },
        { status: 400 }
      );
    }
    // Get the access token
    const accessToken = tokenData.access_token;
    if (!accessToken)
      return NextResponse.json(
        { error: "Access token missing" },
        { status: 400 }
      );

    // Fetch user data from GitHub
    const userResponse = await fetch("https://api.github.com/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const emailResponse = await fetch("https://api.github.com/user/emails", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    // Check if the response is 200 and parse the user data
    if (userResponse.status !== 200 || emailResponse.status !== 200)
      // Clear the invalid auth token cookie
      return NextResponse.json(
        { error: "Failed to fetch user data from provider" },
        { status: 400 }
      );

    // Parse the user data and get data
    const userData = await userResponse.json();
    const emailData = await emailResponse.json();

    // Null is also returned from github :)
    const name: string = userData.name ? userData.name : "Developer";
    const profilePic: string | null = userData.avatar_url ?? null;

    // Get the primary email from the emails array
    const primaryEmail = emailData.find(
      (email: { email: string; primary: boolean }) => email.primary === true
    );

    // If no primary email is found, return error
    if (!primaryEmail)
      return NextResponse.json(
        { error: "Primary email not found" },
        { status: 400 }
      );

    // Use the primary email
    const email = primaryEmail.email;

    // Check if the user already exists in the database
    let userInfo;
    userInfo = await db.select().from(user).where(eq(user.email, email));

    // Checking if the user exists and updating their profile picture if it is null
    if (userInfo.length > 0) {
      if (userInfo[0].flag === "blocked") return;
      NextResponse.json(
        { error: "Your account has been blocked" },
        { status: 403 }
      );
      // User already exists, update their profile picture if it is null
      if (userInfo[0].profile_pic === null && profilePic) {
        await db
          .update(user)
          .set({ profile_pic: profilePic })
          .where(eq(user.email, email));
      }
    } else {
      // User does not exist, insert a new user
      userInfo = await db
        .insert(user)
        .values({
          name: name,
          email: email,
          profile_pic: profilePic, // null is accepted
        })
        .returning();
    }

    // Build Payload
    const jwtPayload: JWTPayloadType = {
      id: userInfo[0].id,
    };

    // Sign the JWT token
    const signedJWT = jwt.sign(jwtPayload, process.env.JWT_SECRET as string, {
      algorithm: "HS256",
      expiresIn: "1h", // Token expiration time
    });

    // Store cookies
    (await cookies()).set("auth-token", signedJWT, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      domain:
        process.env.NODE_ENV === "production"
          ? process.env.DOMAIN
          : "localhost",
      path: "/",
      maxAge: 60 * 60 * 1, // 1 hour
      sameSite: "lax",
    });

    return NextResponse.redirect(
      new URL("/dashboard", process.env.NEXT_PUBLIC_BASE_URL)
    );
  } catch (error) {
    console.error("OAuth Error:", error);
    return NextResponse.redirect(
      new URL("/auth", process.env.NEXT_PUBLIC_BASE_URL)
    );
  }
}
