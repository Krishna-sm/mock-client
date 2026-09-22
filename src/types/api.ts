import type { MockCallOverrides } from "./routes";

/**
 * Standard request arguments passed when invoking an HTTP method on the mock client.
 */
export interface MethodRequestArgs {
  readonly params?: Readonly<Record<string, unknown>>;
  readonly query?: Readonly<Record<string, unknown>>;
  readonly json?: Readonly<Record<string, unknown>>;
  readonly mock?: MockCallOverrides;
}

/**
 * Invocation function for an HTTP verb method.
 */
export type MockMethodCaller = <T = unknown>(args?: MethodRequestArgs) => Promise<T>;

/**
 * The mock client API generated for an individual API class namespace.
 */
export interface NamespaceMockClient {
  readonly $get: MockMethodCaller;
  readonly $post: MockMethodCaller;
  readonly $put: MockMethodCaller;
  readonly $patch: MockMethodCaller;
  readonly $delete: MockMethodCaller;
}

/**
 * The complete Mock API client type combining all registered namespaces.
 */
export type MockApi<T extends Record<string, object>> = {
  readonly [K in keyof T]: NamespaceMockClient;
};
