ALTER TABLE "website" ADD COLUMN "verification_code" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "website" ADD COLUMN "verified" boolean DEFAULT false NOT NULL;