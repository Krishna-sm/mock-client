# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-09-22

### Initial Release

#### Core Features

- **Zod-First API Contract Decorators**: `@Get`, `@Post`, `@Put`, `@Patch`, `@Delete` decorators with automatic fake data generation.
- **End-to-End Type Safety**: Complete TypeScript type inference for request parameters (`params`, `query`, `json`) and response objects (`Promise<z.infer<T>>`).
- **In-Memory Zero-Latency Runtime**: `createMockApi` factory providing direct method calls (`$get`, `$post`, `$put`, `$patch`, `$delete`) without HTTP servers or service workers.
- **Request Payload Preservation**: Automatic reflection of submitted payloads and parameters into response structures.
- **Deterministic PRNG Seeding**: Reproducible mock datasets for testing and Storybook visual snapshots via `seed` option.
- **Array Sizing & Overrides**: Configurable global, per-route, and per-call item counts.
- **Standalone Generator**: `generateMock` utility function for generating standalone fake data against any Zod schema.

#### Examples & Integrations

- **`examples/react-ts`**: React + TypeScript application with custom hooks, React Hook Form, and Zod validation.
- **`examples/react-tanstack`**: Feature-Driven architecture demonstrating TanStack Query v5 (`useQuery`, `useMutation`, `useInfiniteQuery` with `IntersectionObserver`) and TanStack Table v8.

#### CI/CD

- Automated tag-based npm publishing workflow (`deploy-mock-api.yml`) with npm provenance.
