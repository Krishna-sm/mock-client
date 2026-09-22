# React TypeScript Todo Example

> Real-world React application powered by **`@krishtz/mock-client`** with in-memory mock API generation and zero backend setup.

---

## Overview

This example demonstrates how to build and test frontend applications with complete type-safety using `@krishtz/mock-client`.

- **Zero Backend**: All data is synthesized in-memory from Zod schemas.
- **No MSW / No Service Workers**: Direct TypeScript function calls via `$get`, `$post`, `$patch`, `$delete`.
- **Zod Schema First**: Request parameters and responses are typed and validated directly against Zod schemas.

---

## Directory Structure

```
examples/react-ts/
├── src/
│   ├── schemas/
│   │   └── todo.schema.ts         # Zod schemas (Todo, CreateTodo, UpdateTodo, TodoParams)
│   ├── types/
│   │   └── index.ts               # Inferred TypeScript types
│   ├── mock/
│   │   ├── todo-api.ts            # TodoApi class decorated with @Get, @Post, @Patch, @Delete
│   │   └── index.ts               # createMockApi({ todos: new TodoApi() })
│   ├── hooks/
│   │   └── useTodos.ts            # Typed hook consuming mockApi
│   ├── components/
│   │   ├── CreateTodoForm.tsx     # Task creation form
│   │   ├── TodoItem.tsx           # Individual item with actions
│   │   └── TodoList.tsx           # Filterable task list container
│   ├── App.tsx                    # Main application layout
│   ├── index.css                  # Styling
│   └── main.tsx                   # React DOM entry point
├── tests/
│   ├── setup.ts                   # Vitest testing setup
│   ├── useTodos.test.ts           # Hook unit tests
│   └── App.test.tsx               # Component integration tests
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Getting Started

### 1. Run Development Server

From the repository root:

```bash
npm --workspace=examples/react-ts run dev
```

Or from inside `examples/react-ts`:

```bash
cd examples/react-ts
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Running Tests

Run Vitest unit and integration tests:

```bash
npm --workspace=examples/react-ts run test
```

Typecheck:

```bash
npm --workspace=examples/react-ts run typecheck
```

Build production bundle:

```bash
npm --workspace=examples/react-ts run build
```

---

## How It Works

### 1. Declaring API Contract

```ts
// src/mock/todo-api.ts
import { Get, Post, Patch, Delete } from "@krishtz/mock-client";
import {
  TodoSchema,
  CreateTodoSchema,
  UpdateTodoSchema,
  TodoParamsSchema,
} from "../schemas/todo.schema";

export class TodoApi {
  @Get({ response: z.array(TodoSchema), count: 4 })
  list() {}

  @Post({ body: CreateTodoSchema, response: TodoSchema })
  create() {}

  @Patch({ params: TodoParamsSchema, body: UpdateTodoSchema, response: TodoSchema })
  update() {}

  @Delete({
    params: TodoParamsSchema,
    response: z.object({ success: z.boolean(), id: z.string().uuid() }),
  })
  remove() {}
}
```

### 2. Calling Routes in Hooks / Components

```ts
// src/hooks/useTodos.ts
import { mockApi } from "../mock";

// Fetch initial list
const data = await mockApi.todos.$get<Todo[]>();

// Create a new task (preserves input title in mock response)
const created = await mockApi.todos.$post<Todo>({
  json: { title: "New Task" },
});

// Update status
await mockApi.todos.$patch<Todo>({
  params: { id: "..." },
  json: { completed: true, status: "done" },
});
```
