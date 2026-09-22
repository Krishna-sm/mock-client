import { describe, it, expect } from "vitest";
import { z } from "zod";
import { Get, Post, Put, Patch, Delete, createMockApi } from "../src";

const Todo = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  completed: z.boolean(),
  status: z.enum(["todo", "in_progress", "done"]),
});

const CreateTodo = z.object({
  title: z.string().min(1),
});

const UpdateTodo = z.object({
  completed: z.boolean(),
});

const TodoParams = z.object({
  id: z.string().uuid(),
});

class TodoApi {
  @Get({
    response: z.array(Todo),
    count: 5,
  })
  list() {}

  @Get({
    params: TodoParams,
    response: Todo,
  })
  getById() {}

  @Post({
    body: CreateTodo,
    response: Todo,
  })
  create() {}

  @Put({
    params: TodoParams,
    body: CreateTodo,
    response: Todo,
  })
  replace() {}

  @Patch({
    params: TodoParams,
    body: UpdateTodo,
    response: Todo,
  })
  update() {}

  @Delete({
    params: TodoParams,
    response: z.object({
      success: z.boolean(),
      deletedId: z.string().uuid(),
    }),
  })
  remove() {}
}

describe("HTTP Method Decorators and Client Invocations", () => {
  const mockApi = createMockApi({
    todos: new TodoApi(),
  });

  it("should execute $get for list route and return array of todos", async () => {
    const result = await mockApi.todos.$get<z.infer<typeof Todo>[]>();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(5);
    expect(result[0]).toHaveProperty("id");
    expect(result[0]).toHaveProperty("title");
    expect(result[0]).toHaveProperty("completed");
    expect(["todo", "in_progress", "done"]).toContain(result[0]!.status);
  });

  it("should execute $post and return a created todo with preserved title", async () => {
    const result = await mockApi.todos.$post<z.infer<typeof Todo>>({
      json: {
        title: "Build Zod Mock Client",
      },
    });

    expect(result).toBeDefined();
    expect(result.title).toBe("Build Zod Mock Client");
    expect(typeof result.id).toBe("string");
    expect(typeof result.completed).toBe("boolean");
  });

  it("should execute $put and return a replaced todo", async () => {
    const targetId = "123e4567-e89b-42d3-a456-426614174000";
    const result = await mockApi.todos.$put<z.infer<typeof Todo>>({
      params: { id: targetId },
      json: { title: "Updated Title" },
    });

    expect(result.id).toBe(targetId);
    expect(result.title).toBe("Updated Title");
  });

  it("should execute $patch and return an updated todo", async () => {
    const targetId = "987fcdeb-51a2-43d7-b456-426614174000";
    const result = await mockApi.todos.$patch<z.infer<typeof Todo>>({
      params: { id: targetId },
      json: { completed: true },
    });

    expect(result.id).toBe(targetId);
    expect(result.completed).toBe(true);
  });

  it("should execute $delete and return deletion confirmation", async () => {
    const targetId = "550e8400-e29b-41d4-a716-446655440000";
    const result = await mockApi.todos.$delete<{ success: boolean; deletedId: string }>({
      params: { id: targetId },
    });

    expect(result.success).toBeDefined();
    expect(typeof result.success).toBe("boolean");
  });
});
