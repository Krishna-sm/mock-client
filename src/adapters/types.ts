/**
 * Context provided to schema mock generators.
 */
export interface GenerateMockContext {
  /** Deterministic PRNG seed */
  readonly seed?: number;
  /** Number of items to generate for array responses */
  readonly count?: number;
  /** Request input payload to merge into the response */
  readonly input?: Readonly<Record<string, unknown>>;
  /** Explicit property overrides */
  readonly overrides?: Readonly<Record<string, unknown>>;
}

/**
 * Result of validating data against a schema.
 */
export type ValidationResult<T> =
  { readonly success: true; readonly data: T } | { readonly success: false; readonly error: Error };

/**
 * SchemaAdapter interface contract.
 * Decouples mock generation and validation from specific schema library implementations.
 */
export interface SchemaAdapter<TSchema = unknown, TOutput = unknown> {
  /** Name of the adapter */
  readonly name: string;

  /** Checks if the given value is a schema recognized by this adapter */
  isSchema(schema: unknown): schema is TSchema;

  /** Validates and parses data against the schema */
  validate(schema: TSchema, data: unknown): ValidationResult<TOutput>;

  /** Generates fake data conforming to the schema and constraints */
  generateMock(schema: TSchema, context?: GenerateMockContext): TOutput;
}
