ALTER TABLE "user" ADD COLUMN "profile_pic" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "flag" varchar(255) DEFAULT 'good' NOT NULL;