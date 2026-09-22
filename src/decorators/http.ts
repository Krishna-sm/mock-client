import type { RouteConfig, HttpMethod } from "../types";
import { registerRouteMetadata } from "./metadata";

/**
 * Factory creating HTTP method decorators.
 */
function createMethodDecorator(method: HttpMethod) {
  return function (config: RouteConfig): MethodDecorator {
    return function (
      target: object,
      propertyKey: string | symbol,
      descriptor: PropertyDescriptor
    ): PropertyDescriptor | void {
      registerRouteMetadata(target, {
        method,
        propertyKey,
        config: {
          ...config,
          body: config.body ?? config.json,
        },
      });
      return descriptor;
    };
  };
}

/**
 * Decorator defining a GET route on an API class method.
 */
export const Get = createMethodDecorator("GET");

/**
 * Decorator defining a POST route on an API class method.
 */
export const Post = createMethodDecorator("POST");

/**
 * Decorator defining a PUT route on an API class method.
 */
export const Put = createMethodDecorator("PUT");

/**
 * Decorator defining a PATCH route on an API class method.
 */
export const Patch = createMethodDecorator("PATCH");

/**
 * Decorator defining a DELETE route on an API class method.
 */
export const Delete = createMethodDecorator("DELETE");
