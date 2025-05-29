// drizzle/schema.ts
import { pgTable, uuid, varchar, text,timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`), // or use `uuid_generate_v4()` if using that extension
  name: varchar("name", { length: 255 }),
  email: text("email").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});
