import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
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
  createdAt: timestamp("created_at").defaultNow(),
});

export const website = pgTable("website,", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  user_id: uuid("user_id")
    .notNull()
    .references(() => user.id),
  website_name: varchar("website_name", { length: 255 }).notNull(),
  website_url: text("website_url").notNull(),
  api_key: varchar("api_key", { length: 255 }).notNull(),
  hits: integer("hits").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  
});
