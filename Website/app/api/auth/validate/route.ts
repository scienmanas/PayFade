import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { OAuthGoogleClient } from "@/app/config/OAuth";
import { OAuthData } from "@/app/lib/definitions";

// Post route
export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const authToken = (await cookieStore).get("auth-token")?.value;

  // If no auth Token
  if (!authToken)
    return NextResponse.json(
      { error: "No session token found" },
      { status: 401 }
    );

  // Verify the JWT and decode it
  try {
    const jwtDecoded = jwt.verify(authToken, process.env.JWT_SECRET as string);
    if (!jwtDecoded) {
      (await cookieStore).delete("auth-token");
      return NextResponse.json(
        { error: "Invalid session token" },
        { status: 401 }
      );
    }

    // Get the token and provider
    const { token, provider } = jwtDecoded as OAuthData;
    if (!token || !provider) {
      (await cookieStore).delete("auth-token");
      return NextResponse.json(
        { error: "Invalid session token" },
        { status: 401 }
      );
    }

    // Check the provider and proceed accordingly
    if (provider === "google") {
      try {
        let ticket;
        try {
          ticket = await OAuthGoogleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
          });
        } catch (error) {
          // Clear the invalid session token cookie
          (await cookieStore).delete("auth-token");
          return NextResponse.json(
            { error: "Invalid session token" },
            { status: 401 }
          );
        }

        // Get the payload
        const payload = ticket.getPayload();
        if (!payload) {
          // Clear the invalid session token cookie
          (await cookieStore).delete("auth-token");
          return NextResponse.json(
            { error: "Invalid session token" },
            { status: 401 }
          );
        }

        // Return the 200 response
        return NextResponse.json({ message: "Authenticated" }, { status: 200 });
      } catch (error) {
        console.log(error);
        // Clear the invalid session token cookie
        (await cookieStore).delete("auth-token");
        return NextResponse.json({ error: "Invalid session type" });
      }
    } else if (provider == "github") {
      try {
        const userResponse = await fetch("https://api.github.com/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (userResponse.status !== 200) {
          // Clear the invalid session token cookie
          (await cookieStore).delete("auth-token");
          return NextResponse.json(
            { error: "Failed to fetch user data" },
            { status: 401 }
          );
        }

        // If the request is successful, return a success response
        return NextResponse.json({ message: "Authenticated" }, { status: 200 });
      } catch (error) {
        console.error("GitHub OAuth Error:", error);
        // Clear the invalid session token cookie
        (await cookieStore).delete("auth-token");
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 401 }
        );
      }
    } else {
      (await cookieStore).delete("auth-token");
      return NextResponse.json({ error: "Invalid provider" }, { status: 401 });
    }
  } catch (error) {
    // Clear the invalid session token cookie
    (await cookieStore).delete("auth-token");
    return NextResponse.json({ error: "Invalid auth token" }, { status: 401 });
  }
}
