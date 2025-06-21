import { OAuthGoogleClient } from "@/app/config/OAuth";
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

  // If no Auth code, return error
  if (!code)
    return NextResponse.json(
      { error: "Authorization code not found" },
      { status: 400 }
    );

  try {
    // Exchange the code for tokens
    const { tokens } = await OAuthGoogleClient.getToken(code);
    const idToken = tokens.id_token;

    // If no ID Token, return error
    if (!idToken)
      return NextResponse.json({ error: "ID Token missing" }, { status: 400 });

    // Verify the ID Token and get the payload
    const ticket = await OAuthGoogleClient.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // Get the payload from the ticket
    const payload = ticket.getPayload();
    if (!payload)
      return NextResponse.json(
        { error: "Invalid/No ID Token" },
        { status: 400 }
      );
    // Extract user information from the payload
    if (!payload.email || !payload.name)
      return NextResponse.json(
        { error: "Required user information missing, oauth problem" },
        { status: 400 }
      );

    // Extract user details
    const email: string = payload.email as string;
    const name: string = payload.name as string;
    const profilePic: null | string = payload.picture ?? null;

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
      userInfo = await db.insert(user).values({
        name: name,
        email: email,
        profile_pic: profilePic, // null is accepted
      }).returning();
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
