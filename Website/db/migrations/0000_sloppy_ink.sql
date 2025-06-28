CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" text NOT NULL,
	"profile_pic" text,
	"created_at" timestamp DEFAULT now(),
	"flag" varchar(255) DEFAULT 'good' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "website" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"website_name" varchar(255) NOT NULL,
	"website_domain" text NOT NULL,
	"api_key" uuid DEFAULT gen_random_uuid() NOT NULL,
	"verification_code" uuid DEFAULT gen_random_uuid() NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"hits" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"enforcement_type" varchar DEFAULT 'opacity' NOT NULL,
	"opacity" integer DEFAULT 100 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "website" ADD CONSTRAINT "website_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;