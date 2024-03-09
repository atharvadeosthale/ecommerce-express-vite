import { z } from "zod";

export const emailPasswordAndNameSchema = z.object({
  email: z
    .string({ invalid_type_error: "Email must be a string" })
    .email("Invalid email")
    .min(3, "Email must be at least 3 characters"),
  password: z
    .string({ invalid_type_error: "Email must be a string" })
    .min(5, "Password must be atleast 5 characters")
    .max(30, "Password must be at most 30 characters"),
  fullName: z
    .string({ invalid_type_error: "Email must be a string" })
    .min(3, "Full name must be at least 3 characters")
    .max(30, "Full name must be at most 30 characters"),
});

export type EmailPasswordAndNameSchema = z.infer<
  typeof emailPasswordAndNameSchema
>;

export const emailAndPasswordSchema = z.object({
  email: z
    .string({ invalid_type_error: "Email must be a string" })
    .email("Invalid email")
    .min(3, "Email must be at least 3 characters"),
  password: z
    .string({ invalid_type_error: "Email must be a string" })
    .min(5, "Password must be atleast 5 characters")
    .max(30, "Password must be at most 30 characters"),
});

export type EmailAndPasswordSchema = z.infer<typeof emailAndPasswordSchema>;
