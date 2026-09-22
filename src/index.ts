import { generateZodMock } from "./adapters/zod/generator";
import type { z } from "zod";
import type { GenerateMockContext } from "./adapters/types";

/**
 * Public standalone fake data generator function.
 * Generates deterministic fake data conforming to any Zod schema.
 *
 * @example
 * ```ts
 * const user = generateMock(UserSchema, { seed: 123 });
 * const todos = generateMock(z.array(TodoSchema), { count: 5 });
 * ```
 */
export function generateMock<T extends z.ZodTypeAny>(
  schema: T,
  context?: GenerateMockContext
): z.infer<T> {
  return generateZodMock(schema, context);
}

// Adapters
export * from "./adapters";

// Decorators
export * from "./decorators";

// Runtime
export * from "./runtime";

// Types
export * from "./types";
