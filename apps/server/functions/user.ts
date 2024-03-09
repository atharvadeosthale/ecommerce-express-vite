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

  const response = await db
    .select()
    .from(cartTable)
    .where(eq(cartTable.userId, req.user.id));

  return res.json({
    message: "Cart fetched successfully",
    cart: response,
  });
};

export const addToCart = async (req: Request, res: Response) => {
  if (!req.user) return;

  const { productId, quantity }: ProductAndQuantitySchema = req.body;

  const parsed = await productAndQuantitySchema.safeParseAsync(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors });
  }

  await db.insert(cartTable).values({
    productId,
    userId: req.user.id,
    quantity,
  });

  const getCartResponse = await db
    .select()
    .from(cartTable)
    .where(eq(cartTable.userId, req.user.id));

  return res.json({
    message: "Product added to cart successfully",
    cart: getCartResponse,
  });
};

export const removeFromCart = async (req: Request, res: Response) => {
  const { productId }: ProductIdSchema = req.params;

  if (!req.user || !productId) return;

  const parsed = await productIdSchema.safeParseAsync({ productId });

  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.errors });

  await db
    .delete(cartTable)
    .where(
      and(eq(cartTable.userId, req.user.id), eq(cartTable.productId, productId))
    );

  const getCartResponse = await db
    .select()
    .from(cartTable)
    .where(eq(cartTable.userId, req.user.id));

  return res.json({
    message: "Product removed from cart successfully",
    cart: getCartResponse,
  });
};
