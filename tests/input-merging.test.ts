import { describe, it, expect } from "vitest";
import { z } from "zod";
import { Post, Patch, createMockApi } from "../src";

const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  price: z.number(),
  category: z.string(),
});

const CreateProductSchema = z.object({
  name: z.string(),
  price: z.number(),
});

const UpdateProductSchema = z.object({
  price: z.number(),
});

const ParamSchema = z.object({
  id: z.string().uuid(),
});

class ProductApi {
  @Post({
    body: CreateProductSchema,
    response: ProductSchema,
  })
  create() {}

  @Patch({
    params: ParamSchema,
    body: UpdateProductSchema,
    response: ProductSchema,
  })
  update() {}
}

describe("Request Input Preservation", () => {
  const mockApi = createMockApi({
    products: new ProductApi(),
  });

  it("should preserve name and price from POST json payload", async () => {
    const res = await mockApi.products.$post<z.infer<typeof ProductSchema>>({
      json: {
        name: "Mechanical Keyboard",
        price: 149.99,
      },
    });

    expect(res.name).toBe("Mechanical Keyboard");
    expect(res.price).toBe(149.99);
    expect(typeof res.id).toBe("string");
    expect(typeof res.category).toBe("string");
  });

  it("should preserve params.id and json.price in PATCH response", async () => {
    const customId = "550e8400-e29b-41d4-a716-446655440000";
    const res = await mockApi.products.$patch<z.infer<typeof ProductSchema>>({
      params: {
        id: customId,
      },
      json: {
        price: 99.5,
      },
    });

    expect(res.id).toBe(customId);
    expect(res.price).toBe(99.5);
    expect(typeof res.name).toBe("string");
  });
});
