import { describe, it, expect } from "vitest";
import { z } from "zod";
import { Get, createMockApi } from "../src";

const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().int().min(18).max(99),
});

class UserApi {
  @Get({
    response: z.array(UserSchema),
    count: 3,
  })
  list() {}
}

describe("Deterministic PRNG Seeding", () => {
  it("generates identical data when initialized with the same seed", async () => {
    const api1 = createMockApi({ users: new UserApi() }, { seed: 42 });
    const api2 = createMockApi({ users: new UserApi() }, { seed: 42 });

    const result1 = await api1.users.$get<z.infer<typeof UserSchema>[]>();
    const result2 = await api2.users.$get<z.infer<typeof UserSchema>[]>();

    expect(result1).toEqual(result2);
  });

  it("generates different data when initialized with different seeds", async () => {
    const api1 = createMockApi({ users: new UserApi() }, { seed: 100 });
    const api2 = createMockApi({ users: new UserApi() }, { seed: 999 });

    const result1 = await api1.users.$get<z.infer<typeof UserSchema>[]>();
    const result2 = await api2.users.$get<z.infer<typeof UserSchema>[]>();

    expect(result1).not.toEqual(result2);
  });
});
