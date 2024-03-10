import { boolean, integer, pgTable, serial } from "drizzle-orm/pg-core";
import { userTable } from "./user";

export const cartTable = pgTable("cart", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  active: boolean("active").notNull().default(true),
});

export type Cart = typeof cartTable.$inferSelect;
