import { Request, Response } from "express";
import { db } from "../database/db";
import { addressTable } from "../database/schemas/address";
import { and, eq } from "drizzle-orm";
import { AddAddressSchema, addAddressSchema } from "../zod/user";
import {
  ProductAndQuantitySchema,
  ProductIdSchema,
  productAndQuantitySchema,
  productIdSchema,
} from "../zod/user";
import { cartTable } from "../database/schemas/cart";
import { cartItemTable } from "../database/schemas/cartItem";
import { productTable } from "../database/schemas/product";

export const getUser = (req: Request, res: Response) => {
  if (!req.user) return;

  return res.json({
    message: "User fetched successfully",
    user: {
      id: req.user.id,
      email: req.user.email,
      fullName: req.user.fullName,
    },
  });
};

export const getAddresses = async (req: Request, res: Response) => {
  if (!req.user) return;

  const response = await db
    .select()
    .from(addressTable)
    .where(eq(addressTable.user_id, req.user.id));

  return res.json({
    message: "Addresses fetched successfully",
    addresses: response,
  });
};

export const addAddress = async (req: Request, res: Response) => {
  if (!req.user) return;

  const { country, street, city, state, zip }: AddAddressSchema = req.body;

  const parsed = await addAddressSchema.safeParseAsync(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors });
  }

  const response = await db
    .insert(addressTable)
    .values({
      country,
      street,
      city,
      state,
      zip,
      user_id: req.user.id,
    })
    .returning();

  return res.json({
    message: "Address added successfully",
    address: response[0],
  });
};

export const deleteAddress = async (req: Request, res: Response) => {
  const { id }: { id?: number } = req.params;

  if (!req.user || !id) return;

  await db.delete(addressTable).where(eq(addressTable.id, id));

  return res.json({ message: "Address deleted successfully" });
};

export const getCart = async (req: Request, res: Response) => {
  if (!req.user) return;

  const cartResponse = await db
    .select()
    .from(cartTable)
    .where(and(eq(cartTable.userId, req.user.id), eq(cartTable.active, true)));

  if (cartResponse.length === 0) {
    await db.insert(cartTable).values({
      userId: req.user.id,
      active: true,
    });
  }

  const cartItemsResponse = await db
    .select()
    .from(cartItemTable)
    .where(eq(cartItemTable.id, cartResponse[0].id))
    .leftJoin(productTable, eq(cartItemTable.productId, productTable.id));

  return res.json({
    message: "Cart fetched successfully",
    cart: cartItemsResponse,
  });
};

export const addToCart = async (req: Request, res: Response) => {
  if (!req.user) return;

  const { productId, quantity }: ProductAndQuantitySchema = req.body;

  const parsed = await productAndQuantitySchema.safeParseAsync(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors });
  }

  const cartResponse = await db
    .select()
    .from(cartTable)
    .where(and(eq(cartTable.userId, req.user.id), eq(cartTable.active, true)));

  if (cartResponse.length === 0) {
    await db.insert(cartTable).values({
      userId: req.user.id,
      active: true,
    });
  }

  await db.insert(cartItemTable).values({
    productId,
    cartId: cartResponse[0].id,
    quantity,
  });

  const cartItemsResponse = await db
    .select()
    .from(cartItemTable)
    .where(eq(cartItemTable.id, cartResponse[0].id))
    .leftJoin(productTable, eq(cartItemTable.productId, productTable.id));

  return res.json({
    message: "Product added to cart successfully",
    cart: cartItemsResponse,
  });
};

export const removeFromCart = async (req: Request, res: Response) => {
  const { productId }: ProductIdSchema = req.params;

  if (!req.user || !productId) return;

  const parsed = await productIdSchema.safeParseAsync({ productId });

  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.errors });

  const cartResponse = await db
    .select()
    .from(cartTable)
    .where(and(eq(cartTable.userId, req.user.id), eq(cartTable.active, true)));

  if (cartResponse.length === 0) {
    await db.insert(cartTable).values({
      userId: req.user.id,
      active: true,
    });
  }

  await db
    .delete(cartItemTable)
    .where(
      and(
        eq(cartItemTable.cartId, cartResponse[0].id),
        eq(cartItemTable.productId, productId)
      )
    );

  const getCartResponse = await db
    .select()
    .from(cartItemTable)
    .where(eq(cartItemTable.cartId, cartResponse[0].id));

  return res.json({
    message: "Product removed from cart successfully",
    cart: getCartResponse,
  });
};
