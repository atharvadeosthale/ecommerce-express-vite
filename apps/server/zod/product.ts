import { z } from "zod";

export const createNewProductSchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
  stock: z.number(),
});

export type CreateNewProduct = z.infer<typeof createNewProductSchema>;

export const updateProductSchema = z.object({
  name: z.string().optional(),
  price: z.number().optional(),
  description: z.string().optional(),
  stock: z.number().optional(),
});
