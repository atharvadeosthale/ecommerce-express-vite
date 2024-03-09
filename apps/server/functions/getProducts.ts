import { Request, Response } from "express";
import { db } from "../database/db";
import { productTable } from "../database/schemas/product";
import { eq } from "drizzle-orm";

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
