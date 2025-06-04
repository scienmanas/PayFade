import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  // Clear the cookies to log out the user
  try {
    const cookieStore = cookies();
    const authToken = (await cookieStore).get("auth-token")?.value;

    // If auth-token cookie is found, delete it
    if (authToken) {
      (await cookieStore).delete("auth-token");
      return NextResponse.json(
        { message: "Logged out successfully" },
        { status: 200 }
      );
    }

    // If no auth-token cookie is found, return a message
    return NextResponse.json(
      { message: "No active session found" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error logging out:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
