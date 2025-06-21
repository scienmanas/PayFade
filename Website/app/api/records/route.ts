import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { JWTPayloadType, RecordsPostType } from "@/app/lib/definitions";
import { resolveTxt } from "dns";
import { db } from "@/db/index";
import { website } from "@/db/schema";
import { eq } from "drizzle-orm";
import { promises as dns } from "dns";
import { z } from "zod";

// Route to get records for the authenticated user
export async function GET(req: Request) {
  const { message, status, userId } = await authMiddleware();
  if (status === "fail") return NextResponse.json({ message }, { status: 401 });

  // Check if userId is available
  if (!userId)
    return NextResponse.json({ message: "User ID not found" }, { status: 400 });

  // Fetch records from the database
  try {
    const records = await db
      .select()
      .from(website)
      .where(eq(website.user_id, userId));

    return NextResponse.json(
      { message: "Records fetched successfully", records: records },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database query failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch records" },
      { status: 500 }
    );
  }
}

// Route to create a new record for the authenticated user
export async function POST(req: NextRequest) {
  const { message, status, userId } = await authMiddleware();
  if (status === "fail") return NextResponse.json({ message }, { status: 401 });

  // Check if userId is available
  if (!userId)
    return NextResponse.json({ message: "User ID not found" }, { status: 400 });

  // Parse the request body
  const body: RecordsPostType = await req.json();
  const { websiteName, websiteDomain } = body;

  // Validate the website domain using a regex pattern
  const domainPattern = z
    .string()
    .regex(
      /^(?!https?:\/\/)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i,
      { message: "Must be a bare hostname (e.g. shop.example.com)" }
    );

  // Validate the request body
  if (!websiteName || !websiteDomain) {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    );
  }

  // Check if the website domain matches the regex pattern
  if (!domainPattern.safeParse(websiteDomain).success)
    return NextResponse.json(
      { message: "Invalid website domain format" },
      { status: 400 }
    );

  // Create a new record in the database
  try {
    const newRecord = await db
      .insert(website)
      .values({
        user_id: userId,
        website_name: websiteName,
        website_domain: websiteDomain,
      })
      .returning();

    // Only return required data until verification is complete
    const responsePayload = {
      id: newRecord[0].id,
      verificationCode: newRecord[0].verification_code,
      apiKey: newRecord[0].api_key,
      hits: newRecord[0].hits,
      createdAt: newRecord[0].createdAt,
    };
  } catch (error) {
    console.error("Database insertion failed:", error);
    return NextResponse.json(
      { message: "Failed to create record" },
      { status: 500 }
    );
  }
}

// Route to update/check the verified label
export async function PATCH(req: NextRequest) {
  const { message, status, userId } = await authMiddleware();
  if (status === "fail") return NextResponse.json({ message }, { status: 401 });

  // Check if userId is available
  if (!userId)
    return NextResponse.json({ message: "User ID not found" }, { status: 400 });

  // Parse the request body
  const body = await req.json();
  const { id } = body;

  // Validate the request body
  if (!id)
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    );

  // Now get the verification code from the DNS TXT record & Database to validate and update
  try {
    // Fetch the record from the database
    const record = await db
      .select({
        verificationCode: website.verification_code,
        websiteDomain: website.website_domain,
      })
      .from(website)
      .where(eq(website.id, id));

    // Get the verification code from the DNS TXT record
    const txtRecords = await dns.resolveTxt(record[0].websiteDomain);

    console.log("TXT Records:", txtRecords);
    // Yaha sae bacha ha
  } catch (error) {
    console.error("DNS TXT record resolution failed:", error);
    return NextResponse.json(
      { message: "Failed to resolve DNS TXT record" },
      { status: 500 }
    );
  }
}

// Route to delete a record
export async function DELETE(req: NextRequest) {
  const { message, status, userId } = await authMiddleware();
  if (status === "fail") return NextResponse.json({ message }, { status: 401 });

  // Check if userId is available
  if (!userId)
    return NextResponse.json({ message: "User ID not found" }, { status: 400 });

  // Parse the request body
  const body = await req.json();
  const { id } = body;

  // Validate the request body
  if (!id)
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    );

  // Delete the record from the database
  try {
    await db.delete(website).where(eq(website.id, id));

    // Return a success response
    return NextResponse.json(
      { message: "Record deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database deletion failed:", error);
    return NextResponse.json(
      { message: "Failed to delete record" },
      { status: 500 }
    );
  }
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
