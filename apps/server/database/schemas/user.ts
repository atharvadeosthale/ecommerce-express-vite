import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  fullName: text("full_name").notNull(),
  stripeAccountId: text("stripe_account_id").notNull().default(""),
});

export type User = typeof userTable.$inferSelect;
