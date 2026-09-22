import { Get, Post } from "@krishtz/mock-client";
import { z } from "zod";
import { ProductSchema } from "../schemas/product.schema";

export class ProductApi {
  @Get({
    response: z.array(ProductSchema),
    count: 15,
  })
  list() {}

  @Post({
    body: ProductSchema.omit({ id: true }),
    response: ProductSchema,
  })
  create() {}
}
