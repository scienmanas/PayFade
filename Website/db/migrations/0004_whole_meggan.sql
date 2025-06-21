ALTER TABLE "website" ALTER COLUMN "api_key" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "website" ALTER COLUMN "api_key" SET DEFAULT gen_random_uuid();