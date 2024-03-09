import { Request, Response } from "express";
import { db } from "../database/db";
import { productTable } from "../database/schemas/product";
import { eq } from "drizzle-orm";
import {
  CreateNewProduct,
  createNewProductSchema,
  updateProductSchema,
} from "../zod/product";

export const getProducts = async (req: Request, res: Response) => {
  const { id }: { id?: number } = req.params;

  if (id) {
    const product = await db
      .select()
      .from(productTable)
      .where(eq(productTable.id, id));

    if (product.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.json(product[0]);
  }

  const products = await db.select().from(productTable);

  return res.json({ message: "Products fetched successfully", products });
};

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

export const updateProduct = async (req: Request, res: Response) => {
  const { id }: { id?: number } = req.params;

  if (!req.user || !id) return;

  const parsed = await updateProductSchema.safeParseAsync(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const product = await db
    .select()
    .from(productTable)
    .where(eq(productTable.id, id));

  if (product.length === 0) {
    return res.status(404).json({ error: "Product not found" });
  }

  if (product[0].creator !== req.user.id) {
    return res
      .status(403)
      .json({ error: "You are not authorized to update this product" });
  }

  const updateData = {
    name: parsed.data.name,
    price: parsed.data.price,
    description: parsed.data.description,
    stock: parsed.data.stock,
  };

  const updatedProduct = await db
    .update(productTable)
    .set({
      name: updateData.name ? updateData.name : product[0].name,
      price: updateData.price ? updateData.price : product[0].price,
      description: updateData.description
        ? updateData.description
        : product[0].description,
      stock: updateData.stock ? updateData.stock : product[0].stock,
    })
    .where(eq(productTable.id, id))
    .returning();

  return res.json({
    message: "Product updated successfully",
    product: updatedProduct[0],
  });
};
