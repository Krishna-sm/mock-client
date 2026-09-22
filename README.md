# @krishtz/mock-client

Zod-first, type-safe in-memory mock API runtime for Storybook, unit tests, and frontend prototypes.

`@krishtz/mock-client` lets you define API contracts using Zod schemas and HTTP method decorators (`@Get`, `@Post`, `@Put`, `@Patch`, `@Delete`). It automatically generates and validates mock response data with full TypeScript type inference without requiring a mock server, MSW service workers, or manual mock data factories.

---

## Features

- **Zod-First Contract Definition**: Define request and response schemas once with Zod; data generation and runtime validation are performed automatically.
- **End-to-End Type Safety**: Inferred input arguments (`params`, `query`, `json`) and return types (`Promise<z.infer<T>>`).
- **In-Memory Zero-Latency Runtime**: Runs directly in JavaScript runtimes (Node.js, browser, Vitest, Jest, Storybook) without opening ports or intercepting network sockets.
- **Payload Preservation**: Automatically reflects submitted `json` bodies and `params` into the generated mock response.
- **Deterministic Seeding**: Supports an optional PRNG seed for reproducible mock data across test runs and visual snapshots.
- **Array Sizing and Per-Call Overrides**: Control array lengths and response fields globally, per-route, or per-invocation.

---

## Installation

```bash
npm install @krishtz/mock-client zod
```

### TypeScript Configuration

Ensure decorator metadata and experimental decorators are enabled in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "strict": true
  }
}
```

---

## Quick Start

### 1. Define Schemas

```ts
// src/schemas/todo.schema.ts
import { z } from "zod";

export const TodoStatusSchema = z.enum(["todo", "in_progress", "done"]);

export const TodoSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  completed: z.boolean(),
  status: TodoStatusSchema,
  createdAt: z.date(),
});

export const CreateTodoSchema = z.object({
  title: z.string().min(1),
});

export const UpdateTodoSchema = z.object({
  completed: z.boolean().optional(),
  status: TodoStatusSchema.optional(),
});

export const TodoParamsSchema = z.object({
  id: z.string().uuid(),
});
```

---

### 2. Define API Class with Decorators

Define route contracts on class methods. Method bodies remain empty because the mock runtime synthesizes return values according to the decorated Zod schema.

```ts
// src/mock/todo-api.ts
import { Get, Post, Patch, Delete } from "@krishtz/mock-client";
import { z } from "zod";
import {
  TodoSchema,
  CreateTodoSchema,
  UpdateTodoSchema,
  TodoParamsSchema,
} from "../schemas/todo.schema";

export class TodoApi {
  @Get({
    response: z.array(TodoSchema),
    count: 10,
  })
  list() {}

  @Get({
    params: TodoParamsSchema,
    response: TodoSchema,
  })
  getById() {}

  @Post({
    body: CreateTodoSchema,
    response: TodoSchema,
  })
  create() {}

  @Patch({
    params: TodoParamsSchema,
    body: UpdateTodoSchema,
    response: TodoSchema,
  })
  update() {}

  @Delete({
    params: TodoParamsSchema,
    response: z.object({
      success: z.boolean(),
      id: z.string().uuid(),
    }),
  })
  remove() {}
}
```

---

### 3. Instantiate the Mock API Client

```ts
// src/mock/index.ts
import { createMockApi } from "@krishtz/mock-client";
import { TodoApi } from "./todo-api";

export const mockApi = createMockApi(
  {
    todos: new TodoApi(),
  },
  {
    seed: 42,
    arraySize: 10,
  }
);
```

---

### 4. Execute Route Methods

```ts
// GET list of todos
const todos = await mockApi.todos.$get();

// POST new todo (input attributes are preserved in response)
const newTodo = await mockApi.todos.$post({
  json: { title: "Implement TanStack Query" },
});

// PATCH update todo
const updated = await mockApi.todos.$patch({
  params: { id: newTodo.id },
  json: { completed: true },
});

// DELETE todo
const deleted = await mockApi.todos.$delete({
  params: { id: newTodo.id },
});
```

---

## Integration Examples

### TanStack Query (React Query)

```ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockApi } from "./mock";

export function useTodos() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["todos"],
    queryFn: () => mockApi.todos.$get(),
  });

  const createMutation = useMutation({
    mutationFn: (title: string) => mockApi.todos.$post({ json: { title } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  return { ...query, createTodo: createMutation.mutateAsync };
}
```

### Storybook CSF3 Loaders

```tsx
// src/components/TodoList.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { TodoList } from "./TodoList";
import { mockApi } from "../mock";

const meta: Meta<typeof TodoList> = {
  title: "Components/TodoList",
  component: TodoList,
};

export default meta;
type Story = StoryObj<typeof TodoList>;

export const Default: Story = {
  loaders: [
    async () => {
      const todos = await mockApi.todos.$get({
        mock: { count: 5 },
      });
      return { todos };
    },
  ],
  render: (_args, { loaded: { todos } }) => <TodoList initialTodos={todos} />,
};
```

### Unit and Integration Tests (Vitest / Jest)

```ts
import { describe, it, expect } from "vitest";
import { mockApi } from "./mock";

describe("TodoApi Mock Runtime", () => {
  it("generates mock todos matching schema", async () => {
    const todos = await mockApi.todos.$get();
    expect(Array.isArray(todos)).toBe(true);
    expect(todos.length).toBeGreaterThan(0);
    expect(todos[0]).toHaveProperty("id");
    expect(todos[0]).toHaveProperty("title");
  });

  it("preserves submitted payload in POST response", async () => {
    const created = await mockApi.todos.$post({
      json: { title: "Custom Task" },
    });
    expect(created.title).toBe("Custom Task");
  });
});
```

---

## Examples in Repository

- **[`examples/react-ts`](examples/react-ts)**: Minimalist React + TypeScript application with custom hooks, React Hook Form, and Zod validation.
- **[`examples/react-tanstack`](examples/react-tanstack)**: Feature-Driven React application demonstrating:
  - Standard `useQuery` caching and refetching.
  - `useMutation` with automatic cache invalidation.
  - `useInfiniteQuery` multi-page accumulation with `IntersectionObserver` scroll detection.
  - `@tanstack/react-table` with multi-column sorting, fuzzy search filtering, and client pagination.

---

## API Reference

### Decorators

- `@Get(options: RouteConfig)`
- `@Post(options: RouteConfig)`
- `@Put(options: RouteConfig)`
- `@Patch(options: RouteConfig)`
- `@Delete(options: RouteConfig)`

#### `RouteConfig` Properties

| Property        | Type         | Description                                                         |
| --------------- | ------------ | ------------------------------------------------------------------- |
| `response`      | `ZodTypeAny` | **Required**. The Zod schema defining the mock return structure.    |
| `body` / `json` | `ZodTypeAny` | Schema for the request payload.                                     |
| `params`        | `ZodTypeAny` | Schema for route parameters.                                        |
| `query`         | `ZodTypeAny` | Schema for query string parameters.                                 |
| `count`         | `number`     | Default number of items generated when response schema is an array. |

### `createMockApi(apis, options?)`

Instantiates the mock API client mapping each resource namespace to its typed client methods (`$get`, `$post`, `$put`, `$patch`, `$delete`).

#### Options

| Option      | Type     | Default     | Description                                    |
| ----------- | -------- | ----------- | ---------------------------------------------- |
| `seed`      | `number` | `undefined` | PRNG seed for deterministic data generation.   |
| `arraySize` | `number` | `10`        | Global default item count for array responses. |

### Standalone Generator (`generateMock`)

Generates arbitrary fake data conforming to any Zod schema without instantiating API classes.

```ts
import { generateMock } from "@krishtz/mock-client";
import { TodoSchema } from "./schemas/todo.schema";

const mockTodo = generateMock(TodoSchema, { seed: 123 });
```

---

## License

MIT © [Krishna-sm](https://github.com/Krishna-sm)
