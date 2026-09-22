import { createMockApi } from "@krishtz/mock-client";
import { UserApi } from "./user-api";
import { ProductApi } from "./product-api";

export const mockApi = createMockApi(
  {
    users: new UserApi(),
    products: new ProductApi(),
  },
  {
    seed: 100,
  }
);
