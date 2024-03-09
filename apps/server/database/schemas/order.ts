import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { userTable } from "./user";
import { addressTable } from "./address";

export const orderTable = pgTable("order", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  addressId: integer("address_id")
    .notNull()
    .references(() => addressTable.id),
  total: integer("total").notNull(),
  paymentSstatus: text("payment_status").notNull().default("not_paid"),
});

export type Order = typeof orderTable.$inferSelect;
