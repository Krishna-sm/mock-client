import type { MockApi, MockApiOptions, NamespaceMockClient, MethodRequestArgs } from "../types";
import { executeRoute } from "./execute-route";

/**
 * Creates an in-memory Mock API runtime client from decorated API resource classes.
 *
 * @example
 * ```ts
 * export const mockApi = createMockApi({
 *   todos: new TodoApi(),
 * }, {
 *   seed: 42,
 *   arraySize: 15,
 * });
 *
 * const todos = await mockApi.todos.$get();
 * const created = await mockApi.todos.$post({ json: { title: "New Task" } });
 * ```
 */
export function createMockApi<T extends Record<string, object>>(
  apis: T,
  options?: MockApiOptions
): MockApi<T> {
  const client: Record<string, NamespaceMockClient> = {};
  let callSequence = 0;

  const getNextOptions = (): MockApiOptions | undefined => {
    if (options?.seed === undefined) return options;
    const nextSeed = (options.seed * 1664525 + ++callSequence * 1013904223) >>> 0;
    return {
      ...options,
      seed: nextSeed,
    };
  };

  for (const [namespace, apiInstance] of Object.entries(apis)) {
    if (!apiInstance || typeof apiInstance !== "object") {
      throw new Error(
        `[mock-client] Expected an instantiated API class object for namespace '${namespace}', but got ${typeof apiInstance}`
      );
    }

    const namespaceClient: NamespaceMockClient = {
      $get: <R = unknown>(args?: MethodRequestArgs): Promise<R> =>
        executeRoute<R>(apiInstance, "GET", args, getNextOptions()),

      $post: <R = unknown>(args?: MethodRequestArgs): Promise<R> =>
        executeRoute<R>(apiInstance, "POST", args, getNextOptions()),

      $put: <R = unknown>(args?: MethodRequestArgs): Promise<R> =>
        executeRoute<R>(apiInstance, "PUT", args, getNextOptions()),

      $patch: <R = unknown>(args?: MethodRequestArgs): Promise<R> =>
        executeRoute<R>(apiInstance, "PATCH", args, getNextOptions()),

      $delete: <R = unknown>(args?: MethodRequestArgs): Promise<R> =>
        executeRoute<R>(apiInstance, "DELETE", args, getNextOptions()),
    };

    client[namespace] = namespaceClient;
  }

  return client as MockApi<T>;
}
