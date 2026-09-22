# TanStack React Example

This example demonstrates using `@krishtz/mock-client` with TanStack Query v5, TanStack Table v8, and React Router DOM using a Feature-Driven Design (FDD) architecture.

## Features

- **Standard useQuery** (`/query`): In-memory fetching, loading state indicators, refetching, and caching.
- **useMutation & Cache Invalidation** (`/mutation`): Submitting forms with React Hook Form, creating/deleting entities, and automatically invalidating query caches.
- **useInfiniteQuery** (`/infinite-scroll`): Cursor/page-based infinite pagination with cursor tracking.
- **@tanstack/react-table** (`/table`): Rich data table with column sorting, fuzzy search filtering, and client-side pagination.

## Project Structure

```text
src/
├── components/           # Shared layout and navigation headers
├── features/             # Feature-driven modules
│   ├── query/            # Query feature (useQuery)
│   ├── mutation/         # Mutation feature (useMutation)
│   ├── infinite-scroll/  # Infinite scroll feature (useInfiniteQuery)
│   └── table/            # Table feature (@tanstack/react-table)
├── mock/                 # Mock API runtime setup and endpoints
├── routes/               # React Router configurations
├── schemas/              # Zod validation schemas
└── types/                # TypeScript type definitions
```

## Running Locally

```bash
# Install dependencies from root or this folder
npm install

# Start Vite development server
npm --workspace=examples/react-tanstack run dev
```
