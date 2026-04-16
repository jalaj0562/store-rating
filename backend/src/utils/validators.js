import { z } from "zod";

// Spec validations
export const nameSchema = z.string().min(20).max(60);
export const addressSchema = z.string().min(1).max(400);
export const emailSchema = z.string().email();
export const passwordSchema = z.string()
  .min(8).max(16)
  .regex(/[A-Z]/, "Must include at least one uppercase letter")
  .regex(/[^A-Za-z0-9]/, "Must include at least one special character");

export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  password: passwordSchema
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1)
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: passwordSchema
});

export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  password: passwordSchema,
  role: z.enum(["ADMIN","USER","OWNER"]),
  storeId: z.string().uuid().optional().nullable()
});

export const createStoreSchema = z.object({
  name: z.string().min(1),
  email: emailSchema.optional().nullable(),
  address: addressSchema
});

export const ratingSchema = z.object({
  value: z.number().int().min(1).max(5)
});
