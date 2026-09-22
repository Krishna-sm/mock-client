import type { HttpMethod, MethodRequestArgs, MockApiOptions } from "../types";
import { findRouteMetadata } from "../decorators/metadata";
import { zodAdapter } from "../adapters/zod/adapter";
import { extractInputMap } from "./input-merger";
import type { GenerateMockContext } from "../adapters/types";

/**
 * Executes a mock route invocation pipeline.
 */
export async function executeRoute<T = unknown>(
  apiInstance: object,
  method: HttpMethod,
  args?: MethodRequestArgs,
  options?: MockApiOptions
): Promise<T> {
  const route = findRouteMetadata(apiInstance, method);
  const className = apiInstance.constructor?.name ?? "AnonymousApi";

  if (!route) {
    throw new Error(
      `[mock-client] No route declared for HTTP ${method} on class '${className}'. ` +
        `Did you forget to add @${method.charAt(0) + method.slice(1).toLowerCase()}({ response: ... })?`
    );
  }

  const { config } = route;

  // 1. Validate request body against schema if defined
  if (config.body && args?.json !== undefined) {
    const bodyResult = zodAdapter.validate(config.body, args.json);
    if (!bodyResult.success) {
      throw new Error(
        `[mock-client] Request body validation failed for ${method} on '${className}':\n${bodyResult.error.message}`
      );
    }
  }

  // 2. Validate request params against schema if defined
  if (config.params && args?.params !== undefined) {
    const paramsResult = zodAdapter.validate(config.params, args.params);
    if (!paramsResult.success) {
      throw new Error(
        `[mock-client] Request params validation failed for ${method} on '${className}':\n${paramsResult.error.message}`
      );
    }
  }

  // 3. Validate request query against schema if defined
  if (config.query && args?.query !== undefined) {
    const queryResult = zodAdapter.validate(config.query, args.query);
    if (!queryResult.success) {
      throw new Error(
        `[mock-client] Request query validation failed for ${method} on '${className}':\n${queryResult.error.message}`
      );
    }
  }

  // 4. Build generation context
  const count = args?.mock?.count ?? config.count ?? options?.arraySize ?? 10;

  const input = extractInputMap(args);

  const context: GenerateMockContext = {
    seed: options?.seed,
    count,
    input: Object.keys(input).length > 0 ? input : undefined,
    overrides: args?.mock?.override,
  };

  // 5. Generate mock response
  const rawMock = zodAdapter.generateMock(config.response, context);

  // 6. Validate generated mock response against schema
  const validationResult = zodAdapter.validate(config.response, rawMock);
  if (!validationResult.success) {
    throw new Error(
      `[mock-client] Generated mock response failed validation against response schema for ${method} on '${className}':\n${validationResult.error.message}`
    );
  }

  return validationResult.data as T;
}
