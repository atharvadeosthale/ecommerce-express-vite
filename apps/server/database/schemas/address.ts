import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { userTable } from "./user";

export const addressTable = pgTable("address", {
  id: serial("id").primaryKey().notNull(),
  street: text("street").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zip: integer("zip").notNull(),
  country: text("country").notNull(),
  user_id: integer("user_id")
    .notNull()
    .references(() => userTable.id),
});

export type Address = typeof addressTable.$inferSelect;
