import { Request, Response } from "express";
import { db } from "../database/db";
import { cartTable } from "../database/schemas/cart";
import { and, eq } from "drizzle-orm";
import { cartItemTable } from "../database/schemas/cartItem";

export async function checkout(req: Request, res: Response) {
  if (!req.user) return;

  const cartResponse = await db
    .select()
    .from(cartTable)
    .where(and(eq(cartTable.userId, req.user.id), eq(cartTable.active, true)));

  if (cartResponse.length === 0) {
    return res.status(404).json({ message: "No items in cart" });
  }

  const cartItemResponse = await db
    .select()
    .from(cartItemTable)
    .where(eq(cartItemTable.cartId, cartResponse[0].id));

  if (cartItemResponse.length === 0) {
    return res.status(404).json({ message: "No items in cart" });
  }

  await db
    .update(cartTable)
    .set({ active: false })
    .where(and(eq(cartTable.userId, req.user.id), eq(cartTable.active, true)));

  // create logic to create order

  return res.json({ message: "Checkout successful" });
}
