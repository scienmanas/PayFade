import { JWTPayloadType } from "@/app/lib/definitions";
import { NextResponse, NextRequest } from "next/server";
import { db } from "@/db/index";
import { website } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Open endpoint for user websites to call
// export default async function GET(req: NextRequest) {}

// To update the enformcement - requires authentication
export async function PATCH(req: NextRequest) {
  const { message, status, userId } = await authMiddleware();
  const enforcementTypes = ["opacity"];

  // Check if userId is available
  if (!userId)
    return NextResponse.json({ message: "User ID not found" }, { status: 400 });

  // Get the Patch data
  const body = await req.json();
  const { id, enforcementType, opacity } = body;

  // Check if every field is there
  if (!id || !enforcementType || !opacity)
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );

  // Don't bypass - hehe
  if (!enforcementTypes.includes(enforcementType)) {
    return NextResponse.json(
      { message: "Don't mess with API" },
      { status: 400 }
    );
  }
  // Check the opacity: 0-100
  if (isNaN(opacity) || opacity < 0 || opacity > 100) {
    return NextResponse.json(
      { message: "Don't mess with API" },
      { status: 400 }
    );
  }

  // Check the id really belongs to the client and perform updation
  try {
    // Get the userId from the database
    const record = await db
      .select({
        userIdFromRecord: website.user_id,
      })
      .from(website)
      .where(eq(website.id, id));

    // Check if the record is there or not
    if (!record.length)
      return NextResponse.json(
        { message: "Record not found" },
        { status: 404 }
      );

    // Check for userId mismatch
    if (record[0].userIdFromRecord !== userId)
      return NextResponse.json(
        { message: "Record does not belong to you" },
        { status: 403 }
      );

    // Now update the record
    const updatedRecord = await db
      .update(website)
      .set({
        enforcement_type: enforcementType,
        opacity: opacity,
      })
      .where(eq(website.id, id))
      .returning();

    // Check the status
    if (updatedRecord.length === 0)
      return NextResponse.json(
        { message: "Error in updating, please try again" },
        { status: 400 }
      );

    // Make the payload for the client
    const payload = {
      opacity: updatedRecord[0].opacity,
      enforcementType: updatedRecord[0].enforcement_type,
    };

    // Return the payload
    return NextResponse.json(
      {
        message: "Successfully updated the record",
        payload: payload,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json({ message: "Failed to update" }, { status: 500 });
  }
}

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
