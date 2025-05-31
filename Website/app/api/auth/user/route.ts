import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { oAuthGoogleClient } from "@/app/config/OAuth";
import { db } from "@/db/index";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const sessionToken = (await cookieStore).get("session-token")?.value;

  // If no auth Token
  if (!sessionToken) {
    return NextResponse.json(
      { error: "No session token found" },
      { status: 401 }
    );
  }

  try {
    // 1. Verify the token
    let ticket;
    try {
      ticket = await oAuthGoogleClient.verifyIdToken({
        idToken: sessionToken,
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

    // 2. Getting the payload and checking for null
    const payload = ticket.getPayload();
    if (!payload) {
      console.error("Payload is null or undefined.");
      return NextResponse.json(
        { error: "Invalid session token" },
        { status: 401 }
      );
    }

    const name = payload.name as string;
    const email = payload.email as string;
    const profilePic = payload.picture as string;

    // 3. Check if the user exists in the database
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    // 4. If user doesn't exist, create a new user
    if (existingUser.length === 0) {
      const result = await db
        .insert(users)
        .values({
          name,
          email,
        })
        .returning();
        
      return NextResponse.json(
        { name: name, email: email, profilePic: profilePic },
        { status: 200 }
      );
    }

    // 5. If user exists, return user details
    return NextResponse.json(
      { name: name, email: email, profilePic: profilePic },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing the request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
