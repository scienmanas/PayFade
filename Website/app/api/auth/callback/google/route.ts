import { OAuthGoogleClient } from "@/app/config/OAuth";
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

    if (!idToken)
      return NextResponse.json({ error: "ID Token missing" }, { status: 400 });

    // Get email and create user if it didn't exists
    const ticket = await OAuthGoogleClient.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    // Get the payload
    const payload = ticket.getPayload();
    if (!payload) 
      return NextResponse.json(
    { error: "Payload Error" },
    { status: 500 },
  );

  const name = payload.name?? null;
  const email = payload.email?? null;
  

    // Build Payload
    const jwtPayload: OAuthData = {
      provider: "google",
      token: idToken,
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
