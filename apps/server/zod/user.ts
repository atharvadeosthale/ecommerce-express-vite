import { z } from "zod";

export const addAddressSchema = z.object({
  street: z.string().min(5, "Street must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 3 characters"),
  state: z.string().min(2, "State must be at least 3 characters"),
  zip: z.number().min(5, "Zip must be at least 5 characters"),
  country: z.string().min(2, "Country must be at least 3 characters"),
});

export type AddAddressSchema = z.infer<typeof addAddressSchema>;

export const productAndQuantitySchema = z.object({
  productId: z.number().min(1, "Product ID is required"),
  quantity: z.number().min(1, "Quantity is required"),
});

export type ProductAndQuantitySchema = z.infer<typeof productAndQuantitySchema>;

export const productIdSchema = z.object({
  productId: z.number().min(1, "Product ID is required").optional(),
});

export type ProductIdSchema = z.infer<typeof productIdSchema>;
