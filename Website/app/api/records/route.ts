import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export function GET(req: Request) {
  const cookieStore = cookies();
}

export function POST(req: NextRequest) {}

export function PUT(req: NextRequest) {}

export function DELETE(req: NextRequest) {}
