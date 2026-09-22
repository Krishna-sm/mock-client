import type { MethodRequestArgs } from "../types";

/**
 * Merges request parameters and body into a single input dictionary for mock generation.
 */
export function extractInputMap(args?: MethodRequestArgs): Record<string, unknown> {
  const map: Record<string, unknown> = {};

  if (args?.params && typeof args.params === "object") {
    Object.assign(map, args.params);
  }

  if (args?.json && typeof args.json === "object") {
    Object.assign(map, args.json);
  }

  return map;
}
