import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { JWTPayloadType } from "@/app/lib/definitions";
import { resolveTxt } from "dns";

export async function GET(req: Request) {
  const { message, status, userId } = await authMiddleware();
  if (status === "fail") return NextResponse.json({ message }, { status: 401 });
}

export async function POST(req: NextRequest) {
  const { message, status, userId } = await authMiddleware();
  if (status === "fail") return NextResponse.json({ message }, { status: 401 });
}

export async function PATCH(req: NextRequest) {
  const { message, status, userId } = await authMiddleware();
  if (status === "fail") return NextResponse.json({ message }, { status: 401 });
}

export async function DELETE(req: NextRequest) {
  const { message, status, userId } = await authMiddleware();
  if (status === "fail") return NextResponse.json({ message }, { status: 401 });
}

// Auth middleware
async function authMiddleware(): Promise<{
  status: "success" | "fail";
  message: string;
  userId: string | null;
}> {
  const cookieStore = cookies();
  const authToken = (await cookieStore).get("auth-token")?.value;
  if (!authToken)
    return {
      status: "fail",
      message: "No session token found",
      userId: null,
    };

  try {
    // Verify the JWT
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET as string);
    if (!decoded) {
      (await cookieStore).delete("auth-token");
      return {
        status: "fail",
        message: "Invalid session token",
        userId: null,
      };
    }

    // If the token is valid, return the decoded user data
    const id = (decoded as JWTPayloadType).id;
    return {
      status: "success",
      message: "Session is valid",
      userId: id,
    };
  } catch (error) {
    (await cookieStore).delete("auth-token");
    return {
      status: "fail",
      message: "Invalid session token",
      userId: null,
    };
  }
}
