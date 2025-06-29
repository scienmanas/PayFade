import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

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
      (await cookieStore).delete({
        name: "auth-token",
        domain:
          process.env.NODE_ENV === "production"
            ? process.env.DOMAIN
            : "localhost",
        path: "/",
      });
      return NextResponse.json(
        { error: "Invalid session token" },
        { status: 401 }
      );
    }

    // if JWT is verified, return success response
    return NextResponse.json({ message: "Session is valid" }, { status: 200 });
  } catch (error) {
    // Clear the invalid session token cookie
    (await cookieStore).delete({
      name: "auth-token",
      domain:
        process.env.NODE_ENV === "production"
          ? process.env.DOMAIN
          : "localhost",
      path: "/",
    });
    return NextResponse.json({ error: "Invalid auth token" }, { status: 401 });
  }
}
