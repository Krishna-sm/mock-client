import type { z } from "zod";

/**
 * Supported HTTP methods.
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * Route definition configuration passed to HTTP method decorators.
 */
export interface RouteConfig<
  TResponse extends z.ZodTypeAny = z.ZodTypeAny,
  TParams extends z.ZodTypeAny | undefined = z.ZodTypeAny | undefined,
  TQuery extends z.ZodTypeAny | undefined = z.ZodTypeAny | undefined,
  TBody extends z.ZodTypeAny | undefined = z.ZodTypeAny | undefined,
> {
  /** The Zod schema of the response */
  readonly response: TResponse;
  /** Schema for URL route parameters */
  readonly params?: TParams;
  /** Schema for query string parameters */
  readonly query?: TQuery;
  /** Schema for the request body payload (can also be specified as `json`) */
  readonly body?: TBody;
  /** Schema alias for the request body payload */
  readonly json?: TBody;
  /** Default number of items when response is an array */
  readonly count?: number;
}

/**
 * Options passed to the `mock` property at call time.
 */
export interface MockCallOverrides {
  /** Override the number of items returned for an array response */
  readonly count?: number;
  /** Override specific fields on the response object */
  readonly override?: Readonly<Record<string, unknown>>;
}

/**
 * Request options helper that determines required vs optional request keys.
 */
export type RequestOptions<
  TParams extends z.ZodTypeAny | undefined = undefined,
  TQuery extends z.ZodTypeAny | undefined = undefined,
  TBody extends z.ZodTypeAny | undefined = undefined,
> = {
  readonly params?: TParams extends z.ZodTypeAny ? z.infer<TParams> : never;
  readonly query?: TQuery extends z.ZodTypeAny ? z.infer<TQuery> : never;
  readonly json?: TBody extends z.ZodTypeAny ? z.infer<TBody> : never;
  readonly mock?: MockCallOverrides;
};

/**
 * Route metadata stored internally on decorated classes.
 */
export interface RouteMetadata {
  readonly method: HttpMethod;
  readonly propertyKey: string | symbol;
  readonly config: RouteConfig;
}
