import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { resolveTxt } from "dns";

export async function GET(req: Request) {
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
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid session token" },
      { status: 401 }
    );
  }
}

export function POST(req: NextRequest) {}

export function PUT(req: NextRequest) {}

export function DELETE(req: NextRequest) {}
