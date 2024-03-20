import { Request, Response } from "express";
import { db } from "../database/db";
import { cartTable } from "../database/schemas/cart";
import { and, eq } from "drizzle-orm";
import { cartItemTable } from "../database/schemas/cartItem";
import { stripe } from "../stripe/stripe";
import { productTable } from "../database/schemas/product";

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
    .fullJoin(productTable, eq(cartItemTable.productId, productTable.id))
    .where(eq(cartItemTable.cartId, cartResponse[0].id));

  if (cartItemResponse.length === 0) {
    return res.status(404).json({ message: "No items in cart" });
  }

  let outOfStockItems = [];

  // Check if items are still available
  for (const item of cartItemResponse) {
    if (Number(item?.product?.stock) < Number(item?.cart_item?.quantity)) {
      // Add out of stock item to the array
      outOfStockItems.push(item?.product?.name);
    }
  }

  // If there are any out of stock items, return them in the response
  if (outOfStockItems.length > 0) {
    return res.status(400).json({
      message: "Some items are out of stock",
      outOfStockItems: outOfStockItems,
    });
  }

  // create logic to create order
  const checkout = await stripe.checkout.sessions.create({
    line_items: cartItemResponse.map((item) => ({
      price_data: {
        currency: "INR",
        product_data: {
          name: item?.product?.name as string,
        },
        unit_amount: Number(item?.product?.price) * 100,
      },
      quantity: Number(item?.cart_item?.quantity),
    })),
  });

  return res.json({
    message: "Checkout successful",
    checkoutUrl: checkout.url,
  });
}
