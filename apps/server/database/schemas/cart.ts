import { integer, pgTable, serial } from "drizzle-orm/pg-core";
import { userTable } from "./user";
import { productTable } from "./product";

export const cartTable = pgTable("cart", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  productId: integer("product_id")
    .notNull()
    .references(() => productTable.id),
  quantity: integer("quantity").notNull(),
});

export type Cart = typeof cartTable.$inferSelect;
