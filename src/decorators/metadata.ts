import type { RouteMetadata, HttpMethod } from "../types";

export const ROUTE_METADATA_SYMBOL: unique symbol = Symbol.for("@krishtz/mock-client:routes");

interface PrototypeWithMetadata {
  [ROUTE_METADATA_SYMBOL]?: RouteMetadata[];
}

/**
 * Registers route metadata on a class prototype.
 */
export function registerRouteMetadata(target: object, metadata: RouteMetadata): void {
  const prototype = target as PrototypeWithMetadata;
  if (!prototype[ROUTE_METADATA_SYMBOL]) {
    prototype[ROUTE_METADATA_SYMBOL] = [];
  }
  prototype[ROUTE_METADATA_SYMBOL].push(metadata);
}

/**
 * Retrieves all registered route metadata from a class instance or prototype.
 */
export function getRouteMetadata(target: object): readonly RouteMetadata[] {
  const prototype = (
    typeof target === "function" ? target.prototype : Object.getPrototypeOf(target)
  ) as PrototypeWithMetadata | null;

  const directMetadata = (target as PrototypeWithMetadata)[ROUTE_METADATA_SYMBOL] ?? [];
  const protoMetadata = prototype?.[ROUTE_METADATA_SYMBOL] ?? [];

  return [...directMetadata, ...protoMetadata];
}

/**
 * Finds specific route metadata for an HTTP method on an instance or prototype.
 */
export function findRouteMetadata(target: object, method: HttpMethod): RouteMetadata | undefined {
  const allRoutes = getRouteMetadata(target);
  return allRoutes.find((r) => r.method === method);
}
