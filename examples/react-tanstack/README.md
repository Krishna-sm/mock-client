# React TanStack Example

A Feature-Driven application demonstrating `@krishtz/mock-client` integration with TanStack Query v5, TanStack Table v8, React Hook Form, and React Router DOM.

---

## Overview

This example demonstrates how to integrate typed in-memory mock runtimes with modern React data fetching, caching, mutation invalidation, and table virtualization patterns.

---

## Demonstrated Features

### 1. Standard useQuery (`/query`)

- In-memory data fetching from decorated Zod schemas.
- Loading indicator and refetch triggers.
- Automatic query caching and stale-time configuration.

### 2. useMutation and Cache Invalidation (`/mutation`)

- Schema-validated form submissions using React Hook Form and Zod resolvers.
- Entity creation and deletion via `$post` and `$delete`.
- Automatic query cache invalidation via `useQueryClient`.

### 3. useInfiniteQuery with IntersectionObserver (`/infinite-scroll`)

- Multi-page data accumulation with dynamic cursor/page parameters.
- Automatic page loading triggered on scroll using the native `IntersectionObserver` API.
- Simulated network latency to demonstrate background loading states.

### 4. TanStack Table (`/table`)

- Table initialization using `@tanstack/react-table` v8.
- Column sorting, fuzzy text filtering, and client-side pagination.

---

## Project Structure

```text
examples/react-tanstack/
├── src/
│   ├── components/           # Shared layout and navigation headers
│   │   ├── Header.tsx        # Navigation tab bar
│   │   └── Layout.tsx        # Shell layout
│   ├── features/             # Feature modules (Feature-Driven Design)
│   │   ├── query/            # useQuery implementation
│   │   ├── mutation/         # useMutation with cache invalidation
│   │   ├── infinite-scroll/  # useInfiniteQuery with IntersectionObserver
│   │   └── table/            # @tanstack/react-table implementation
│   ├── mock/                 # Mock API schemas and runtime instantiation
│   │   ├── user-api.ts       # Decorated UserApi class
│   │   ├── product-api.ts    # Decorated ProductApi class
│   │   └── index.ts          # createMockApi client instance
│   ├── routes/               # React Router configurations
│   ├── schemas/              # Zod contract schemas
│   ├── types/                # Inferred TypeScript type definitions
│   ├── App.tsx               # Root QueryClientProvider and RouterProvider
│   ├── index.css             # Minimalist styling
│   └── main.tsx              # DOM entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Getting Started

### 1. Install Dependencies

From the repository root:

```bash
npm install
```

### 2. Start Development Server

```bash
npm --workspace=examples/react-tanstack run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the application in the browser.

### 3. Type Checking and Build

```bash
# Typecheck
npm --workspace=examples/react-tanstack run typecheck

# Production build
npm --workspace=examples/react-tanstack run build
```
