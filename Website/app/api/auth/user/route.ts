import { NextRequest, NextResponse } from "next/server";
import { OAuthData } from "@/app/lib/definitions";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { OAuthGoogleClient } from "@/app/config/OAuth";
import { db } from "@/db/index";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  // Get the auth token from cookies
  const cookieStore = cookies();
  const authToken = (await cookieStore).get("auth-token")?.value;

  // If no auth Token
  if (!authToken)
    return NextResponse.json(
      { error: "No session token found" },
      { status: 401 }
    );

  try {
    // Verify the JWT and decode it
    const jwtDecoded = jwt.verify(authToken, process.env.JWT_SECRET as string);
    if (!jwtDecoded) {
      // Clear the invalid session token cookie
      (await cookieStore).delete("auth-token");
      return NextResponse.json(
        { error: "Invalid session token" },
        { status: 401 }
      );
    }

    // Get the token and provider
    const { token, provider } = jwtDecoded as OAuthData;
    if (!token || !provider) {
      // Clear the invalid session token cookie
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
          (await cookieStore).delete("session-token");
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
          console.error("Payload is null or undefined.");
          return NextResponse.json(
            { error: "Invalid session token" },
            { status: 401 }
          );
        }

        // Extract user details from the payload
        const name = payload.name as string;
        const email = payload.email as string;
        const profilePic = payload.picture as string;

        // Check if the user exists in the database and add if not
        const existingUser = await db
          .select()
          .from(user)
          .where(eq(user.email, email))
          .limit(1);
        if (existingUser.length === 0) {
          const newUser = await db
            .insert(user)
            .values({
              name: name,
              email: email,
            })
            .returning();
        }

        // Return user details
        return NextResponse.json(
          {
            name: name,
            email: email,
            profilePic: profilePic,
          },
          {
            status: 200,
          }
        );
      } catch (error) {
        console.error("Error processing the request:", error);
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        );
      }
    } else if (provider === "github") {
      try {
        const userResponse = await fetch("https://api.github.com/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const emailResponse = await fetch(
          "https://api.github.com/user/emails",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        // Check if the response is 200 and parse the user data
        if (userResponse.status !== 200 || emailResponse.status !== 200) {
          // Clear the invalid auth token cookie
          (await cookieStore).delete("auth-token");
          return NextResponse.json(
            { error: "Failed to fetch user data from provider" },
            { status: 400 }
          );
        }
        // Parse the user data and get data
        const userData = await userResponse.json();
        const emailData = await emailResponse.json();
        const name = userData.name;
        const profilePic = userData.avatar_url;

        // Get the primary email from the emails array
        const primaryEmail = emailData.find(
          (email: { email: string; primary: boolean; verified: boolean }) =>
            email.primary
        );

        if (!primaryEmail) {
          // Clear the invalid auth token cookie
          (await cookieStore).delete("auth-token");
          return NextResponse.json(
            { error: "Primary email not found" },
            { status: 400 }
          );
        }

        // Use the primary email
        const email = primaryEmail.email;

        // Check if the user exists in the database and add if not
        const existingUser = await db
          .select()
          .from(user)
          .where(eq(user.email, email))
          .limit(1);
        if (existingUser.length === 0) {
          const newUser = await db
            .insert(user)
            .values({
              name: name,
              email: email,
            })
            .returning();
        }

        // Return user details
        return NextResponse.json(
          {
            name: name,
            email: email,
            profilePic: profilePic,
          },
          {
            status: 200,
          }
        );
      } catch (error) {
        console.error("Error processing the request:", error);
        // Clear the invalid auth token cookie
        (await cookieStore).delete("auth-token");
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        );
      }
    } else {
      // Clear the invalid auth token cookie
      (await cookieStore).delete("auth-token");
      return NextResponse.json(
        { error: "Unsupported provider" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error processing the request:", error);
    // Clear the invalid auth token cookie
    (await cookieStore).delete("auth-token");
    return NextResponse.json({ error: "Invalid auth token" }, { status: 500 });
  }
}
