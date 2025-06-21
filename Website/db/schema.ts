import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// User schema
export const user = pgTable("user", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  email: text("email").notNull(),
  profile_pic: text("profile_pic"), // Can be null
  createdAt: timestamp("created_at").defaultNow(),
  flag: varchar("flag", { length: 255 }).default("good").notNull(),
});

export const website = pgTable("website", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  user_id: uuid("user_id")
    .notNull()
    .references(() => user.id),
  website_name: varchar("website_name", { length: 255 }).notNull(),
  website_domain: text("website_domain").notNull(),
  api_key: uuid("api_key")
    .default(sql`gen_random_uuid()`)
    .notNull(),
  verification_code: uuid("verification_code")
    .default(sql`gen_random_uuid()`)
    .notNull(),
  verified: boolean("verified").default(false).notNull(),
  hits: integer("hits").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
