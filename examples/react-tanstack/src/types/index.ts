import { z } from "zod";
import { UserSchema, CreateUserSchema, RoleSchema, UserParamsSchema } from "../schemas/user.schema";
import {
  ProductSchema,
  ProductStatusSchema,
  ProductCategorySchema,
} from "../schemas/product.schema";

export type User = z.infer<typeof UserSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type Role = z.infer<typeof RoleSchema>;
export type UserParams = z.infer<typeof UserParamsSchema>;

export type Product = z.infer<typeof ProductSchema>;
export type ProductStatus = z.infer<typeof ProductStatusSchema>;
export type ProductCategory = z.infer<typeof ProductCategorySchema>;
