import { Request, Response } from "express";
import { CreateNewProduct, createNewProductSchema } from "../zod/product";
import { db } from "../database/db";
import { productTable } from "../database/schemas/product";

export const createProduct = async (req: Request, res: Response) => {
  if (!req.user) return;

  const { name, price, description, stock }: CreateNewProduct = req.body;

  const parsed = await createNewProductSchema.safeParseAsync(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const returnedProduct = await db
    .insert(productTable)
    .values({
      name,
      price,
      description,
      creator: req.user.id,
      stock,
    })
    .returning();

  return res.json({
    message: "Product added successfully",
    product: returnedProduct[0],
  });
};
