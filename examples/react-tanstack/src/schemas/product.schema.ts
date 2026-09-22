import { z } from "zod";

export const ProductStatusSchema = z.enum(["in_stock", "low_stock", "out_of_stock"]);
export const ProductCategorySchema = z.enum(["Electronics", "Audio", "Accessories", "Office"]);

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  category: ProductCategorySchema,
  price: z.number().min(10).max(1000),
  stock: z.number().int().min(0).max(500),
  status: ProductStatusSchema,
});
