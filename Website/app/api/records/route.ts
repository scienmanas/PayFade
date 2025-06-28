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

    // Generate payload for the response
    const recordsPayload = records.map((record) => ({
      id: record.id,
      websiteName: record.website_name,
      websiteDomain: record.website_domain,
      apiKey: record.api_key,
      hits: record.hits,
      createdAt: record.createdAt,
      verified: record.verified,
      enforcementType: record.enforcement_type,
      opacity: record.opacity,
      verificationCode:
        record.verified === false ? record.verification_code : null,
    }));

    return NextResponse.json(
      { message: "Records fetched successfully", records: recordsPayload },
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
      enforcementType: newRecord[0].enforcement_type,
      opacity: newRecord[0].opacity,
    };

    // Return a success response with the new record
    return NextResponse.json(
      {
        message: "Record created successfully",
        record: responsePayload,
      },
      { status: 201 }
    );
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

    // Remove the subdomains from the domain
    const hostname = record[0].websiteDomain;  
    // capture either:
    //   • “domain.co.uk” / “domain.co.in”  (i.e. co.<2‑letter>)
    //   • OR “domain.XXX” for any other TLD of 2+ letters
    const domain = hostname.replace(
      /^(.+\.)?([^.]+\.(?:(?:co\.(?:uk|in))|[a-z]{2,}))$/,
      "$2"
    );

    // Get the verification code from the DNS TXT record
    const txtRecords = await dns.resolveTxt(domain); // It will come in array all the records and enclosed in string

    // Iterate through all TXT records to find the verification code - no break statement because subdomain may have multiple TXT records
    let verificationCodeFromDNSRecords: string | null = null;
    for (const record of txtRecords) {
      for (const parsedRecord of record) {
        if (parsedRecord.startsWith("payfade-verification-code=")) {
          verificationCodeFromDNSRecords = parsedRecord.replace(
            "payfade-verification-code=",
            ""
          );
        }
      }
      if (verificationCodeFromDNSRecords) break;
    }

    // if no verification, return the message to the client
    if (!verificationCodeFromDNSRecords)
      return NextResponse.json(
        {
          error: "Please add the code to your website's DNS TXT record",
        },
        {
          status: 400,
        }
      );

    // Verify the code with the database
    if (verificationCodeFromDNSRecords !== record[0].verificationCode)
      return NextResponse.json(
        {
          error:
            "Wrong code/format found, or DNS TXT record not published, please verify again after some-time.",
        },
        { status: 400 }
      );

    // If everything is success then return success and update the database
    await db.update(website).set({ verified: true });
    return NextResponse.json(
      { message: "Verification Successful" },
      { status: 200 }
    );
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
