# @krishtz/mock-client

> **Zod-first, type-safe in-memory mock API runtime for Storybook and tests.**

`@krishtz/mock-client` lets you define API contracts using **Zod schemas** and HTTP-style decorators (`@Get`, `@Post`, `@Put`, `@Patch`, `@Delete`). It automatically generates and validates fake response data with full TypeScript inference—**without requiring an HTTP server, MSW, fetch polyfills, or manual mock implementations**.

---

## ✨ Features

- 🎯 **Zod-First (v4 Ready)**: Built for modern Zod with zero deprecated APIs. Define your response and request schemas once with Zod; fake data generation and runtime validation happen automatically.
- 🔒 **End-to-End Type Safety**: Inferred input (`params`, `query`, `json`) and output (`Promise<z.infer<T>>`) types.
- ⚡ **Zero-Latency In-Memory Runtime**: No HTTP servers, no network calls, no MSW service workers, no Express/Hono servers.
- 🪄 **Intelligent Data Generation**: Supports primitives, regex, RFC-compliant email, url, uuid, min/max limits, enums, unions, records, and arrays.
- 🧠 **Request Context Preservation**: Automatically merges provided `json` body or `params` into the generated response.
- 🎲 **Deterministic Seeding**: Provide a `seed` for stable, reproducible mock data in Storybook snapshots and tests.
- 📊 **Array Sizing & Overrides**: Control array length globally, per-route, or per-call.

---

## 📦 Installation

```bash
npm install @krishtz/mock-client zod
# or
pnpm add @krishtz/mock-client zod
# or
yarn add @krishtz/mock-client zod
```

### TypeScript Configuration

Enable decorator support in your `tsconfig.json`:

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

## 🚀 Quick Start

### 1. Define Schemas

```ts
// src/schemas/todo.ts
import { z } from "zod";

export const TodoSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3),
  completed: z.boolean(),
  status: z.enum(["todo", "in_progress", "done"]),
  createdAt: z.date(),
});

export const CreateTodoSchema = z.object({
  title: z.string().min(3),
});

export const UpdateTodoSchema = z.object({
  completed: z.boolean().optional(),
  status: z.enum(["todo", "in_progress", "done"]).optional(),
});

export const TodoParamsSchema = z.object({
  id: z.string().uuid(),
});
```

---

### 2. Define API Class with Decorators

> **Note**: You only declare the schema contract. Do **not** implement mock return values inside the methods—the library generates them automatically.

```ts
// src/mock/todo-api.ts
import { Get, Post, Patch, Delete } from "@krishtz/mock-client";
import { z } from "zod";
import { TodoSchema, CreateTodoSchema, UpdateTodoSchema, TodoParamsSchema } from "../schemas/todo";

export class TodoApi {
  @Get({
    response: z.array(TodoSchema),
    count: 10, // default array count for this route
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
    response: z.object({ success: z.boolean() }),
  })
  remove() {}
}
```

---

### 3. Initialize Mock API

```ts
// src/mock/index.ts
import { createMockApi } from "@krishtz/mock-client";
import { TodoApi } from "./todo-api";

export const mockApi = createMockApi({
  todos: new TodoApi(),
});
```

---

### 4. Call Routes (`$get`, `$post`, `$patch`, `$delete`)

```ts
// GET list of todos
const todos = await mockApi.todos.$get();
// Type: Todo[]

// POST create a todo (passes input title into generated output)
const newTodo = await mockApi.todos.$post({
  json: {
    title: "Learn Zod Mock Client",
  },
});
// Type: Todo (with title = "Learn Zod Mock Client")

// PATCH update todo
const updated = await mockApi.todos.$patch({
  params: {
    id: newTodo.id,
  },
  json: {
    completed: true,
  },
});
// Type: Todo (with id = newTodo.id, completed = true)
```

---

## 💡 What We Expect (Core Philosophy & Behavior)

| Feature                    | What We Expect                                                                                                               |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Modern Zod (v4 Ready)**  | Uses standard Zod modern APIs (`z.string().uuid()`, `z.enum()`, `z.string().email()`) with zero deprecated methods.          |
| **No Mock Implementation** | The consumer declares empty methods. `@krishtz/mock-client` synthesizes data directly from Zod response schemas.             |
| **Input Preservation**     | When calling `$post({ json: { title: "Custom" } })`, matching properties in the response will preserve `"Custom"`.           |
| **Response Validation**    | Every generated mock is validated against `responseSchema.parse(generatedData)`. If invalid, an informative error is thrown. |
| **Deterministic Data**     | When initialized with a `seed`, consecutive runs produce identical data for reliable testing and Storybook visual snapshots. |
| **No Server / No MSW**     | Executes instantly in-memory in browser (Storybook) or Node/Vitest/Jest environments.                                        |

---

## 🎨 Storybook Integration

Use `@krishtz/mock-client` directly in Storybook CSF3 loaders or custom decorators without needing MSW service workers:

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
        mock: { count: 5 }, // override count for this story
      });
      return { todos };
    },
  ],
  render: (_args, { loaded: { todos } }) => <TodoList initialTodos={todos} />,
};

export const SingleItem: Story = {
  loaders: [
    async () => {
      const todo = await mockApi.todos.$get({
        params: { id: "123e4567-e89b-12d3-a456-426614174000" },
      });
      return { todo };
    },
  ],
  render: (_args, { loaded: { todo } }) => <TodoList initialTodos={[todo]} />,
};
```

---

## 🧪 Unit & Integration Testing (Vitest / Jest)

```ts
// src/mock/todo-api.test.ts
import { describe, it, expect } from "vitest";
import { mockApi } from "./index";

describe("TodoApi Mock Client", () => {
  it("should generate a list of todos with correct schema", async () => {
    const todos = await mockApi.todos.$get();

    expect(Array.isArray(todos)).toBe(true);
    expect(todos.length).toBeGreaterThan(0);
    expect(todos[0]).toHaveProperty("id");
    expect(todos[0]).toHaveProperty("title");
    expect(["todo", "in_progress", "done"]).toContain(todos[0].status);
  });

  it("should preserve input body in POST response", async () => {
    const created = await mockApi.todos.$post({
      json: {
        title: "Test Task",
      },
    });

    expect(created.title).toBe("Test Task");
    expect(typeof created.id).toBe("string");
  });

  it("should respect mock count override", async () => {
    const todos = await mockApi.todos.$get({
      mock: { count: 3 },
    });

    expect(todos).toHaveLength(3);
  });
});
```

---

## ⚙️ Advanced Configuration

### Deterministic Seeding

Provide a `seed` to ensure repeatable data across runs:

```ts
export const mockApi = createMockApi(
  {
    todos: new TodoApi(),
  },
  {
    seed: 42, // any number
    arraySize: 15, // global default array size
  }
);
```

### Standalone Mock Generator (`generateMock`)

You can also use the mock generator directly:

```ts
import { generateMock } from "@krishtz/mock-client";
import { TodoSchema } from "./schemas/todo";

const singleMockTodo = generateMock(TodoSchema, {
  seed: 123,
});
```

---

## 📖 API Reference

### Decorators

- `@Get(options: RouteConfig)`
- `@Post(options: RouteConfig)`
- `@Put(options: RouteConfig)`
- `@Patch(options: RouteConfig)`
- `@Delete(options: RouteConfig)`

#### `RouteConfig` Options

| Option          | Type         | Description                                        |
| --------------- | ------------ | -------------------------------------------------- |
| `response`      | `ZodTypeAny` | **(Required)** The Zod schema of the response.     |
| `body` / `json` | `ZodTypeAny` | Schema for the request payload.                    |
| `params`        | `ZodTypeAny` | Schema for URL route parameters.                   |
| `query`         | `ZodTypeAny` | Schema for query string parameters.                |
| `count`         | `number`     | Default number of items when response is an array. |

### `createMockApi(apis, options?)`

- `apis`: An object dictionary of instantiated API classes.
- `options`:
  - `seed?: number`: Deterministic random seed.
  - `arraySize?: number`: Default array count (default: `10`).

#### Generated Methods on Mock API

- `mockApi.<resource>.$get(request?)`
- `mockApi.<resource>.$post(request?)`
- `mockApi.<resource>.$put(request?)`
- `mockApi.<resource>.$patch(request?)`
- `mockApi.<resource>.$delete(request?)`

---

## 📄 License

MIT © [krishtz](https://github.com/krishtz)
