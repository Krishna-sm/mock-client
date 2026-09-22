import { z } from "zod";
import type { SchemaAdapter, ValidationResult, GenerateMockContext } from "../types";
import { generateZodMock } from "./generator";

/**
 * Zod Schema Adapter implementing the SchemaAdapter interface.
 */
export class ZodAdapter implements SchemaAdapter<z.ZodTypeAny, unknown> {
  public readonly name = "zod";

  public isSchema(schema: unknown): schema is z.ZodTypeAny {
    if (!schema || typeof schema !== "object") return false;
    return (
      "_def" in schema &&
      ("parse" in schema || "safeParse" in schema) &&
      typeof (schema as z.ZodTypeAny).safeParse === "function"
    );
  }

  public validate(schema: z.ZodTypeAny, data: unknown): ValidationResult<unknown> {
    const result = schema.safeParse(data);
    if (result.success) {
      return { success: true, data: result.data };
    }
    const issueSummary = result.error.issues
      .map((i) => `  - [${i.path.join(".")}]: ${i.message}`)
      .join("\n");
    return {
      success: false,
      error: new Error(`Mock response validation failed:\n${issueSummary}`),
    };
  }

  public generateMock(schema: z.ZodTypeAny, context?: GenerateMockContext): unknown {
    return generateZodMock(schema, context);
  }
}

export const zodAdapter = new ZodAdapter();
