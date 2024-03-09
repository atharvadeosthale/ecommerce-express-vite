import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { userTable } from "./user";

export const productTable = pgTable("product", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(), // usd
  description: text("description"),
  image: text("image"),
  stock: integer("stock").notNull(),
  creator: integer("creator")
    .notNull()
    .references(() => userTable.id),
});

export type Product = typeof productTable.$inferSelect;
