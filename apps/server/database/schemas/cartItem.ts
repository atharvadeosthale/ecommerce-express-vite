import { integer, pgTable, serial } from "drizzle-orm/pg-core";
import { cartTable } from "./cart";
import { productTable } from "./product";

export const cartItemTable = pgTable("cart_item", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id")
    .notNull()
    .references(() => cartTable.id),
  productId: integer("product_id")
    .notNull()
    .references(() => productTable.id),
  quantity: integer("quantity").notNull(),
});

export type CartItemTable = typeof cartItemTable.$inferSelect;
