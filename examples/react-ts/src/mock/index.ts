import { createMockApi } from "@krishtz/mock-client";
import { TodoApi } from "./todo-api";

export const mockApi = createMockApi(
  {
    todos: new TodoApi(),
  },
  {
    seed: 42,
  }
);
