import { describe, it, expect } from "vitest";
import { z } from "zod";
import { Get, Post, createMockApi } from "../src";

const ItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3),
});

const InputSchema = z.object({
  name: z.string().min(3),
});

class PartialApi {
  @Get({
    response: ItemSchema,
  })
  getOne() {}

  @Post({
    body: InputSchema,
    response: ItemSchema,
  })
  create() {}
}

describe("Error Handling & Validation Diagnostics", () => {
  const mockApi = createMockApi({
    items: new PartialApi(),
  });

  it("throws descriptive error when invoking an undeclared route method", async () => {
    await expect(mockApi.items.$delete()).rejects.toThrow(
      /No route declared for HTTP DELETE on class 'PartialApi'/
    );
  });

  it("throws validation error when request body fails schema validation", async () => {
    await expect(
      mockApi.items.$post({
        json: {
          name: "a", // min(3) violation
        },
      })
    ).rejects.toThrow(/Request body validation failed for POST on 'PartialApi'/);
  });
});
