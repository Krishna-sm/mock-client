/**
 * Global configuration options for createMockApi.
 */
export interface MockApiOptions {
  /** Deterministic PRNG seed for reproducible mock data */
  readonly seed?: number;
  /** Global default array size for array responses (defaults to 10) */
  readonly arraySize?: number;
}
