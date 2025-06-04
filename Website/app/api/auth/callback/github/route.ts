import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { OAuthData } from "@/app/lib/definitions";

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

    // Build payload
    const payload: OAuthData = {
      provider: "github",
      token: accessToken,
    };

    // Sign the JWT token
    const signedJWT = jwt.sign(payload, process.env.JWT_SECRET as string, {
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
