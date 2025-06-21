ALTER TABLE "website," RENAME TO "website";--> statement-breakpoint
ALTER TABLE "website" DROP CONSTRAINT "website,_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "website" ADD CONSTRAINT "website_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;