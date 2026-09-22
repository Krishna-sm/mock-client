import { z } from "zod";
import { createPrng, type PRNG } from "./prng";
import type { GenerateMockContext } from "../types";

/**
 * Supported Zod AST type names.
 */
export const ZOD_TYPE_NAMES = {
  STRING: "ZodString",
  NUMBER: "ZodNumber",
  BOOLEAN: "ZodBoolean",
  BIGINT: "ZodBigInt",
  DATE: "ZodDate",
  SYMBOL: "ZodSymbol",
  UNDEFINED: "ZodUndefined",
  NULL: "ZodNull",
  VOID: "ZodVoid",
  ANY: "ZodAny",
  UNKNOWN: "ZodUnknown",
  NEVER: "ZodNever",
  ARRAY: "ZodArray",
  OBJECT: "ZodObject",
  UNION: "ZodUnion",
  DISCRIMINATED_UNION: "ZodDiscriminatedUnion",
  INTERSECTION: "ZodIntersection",
  TUPLE: "ZodTuple",
  RECORD: "ZodRecord",
  MAP: "ZodMap",
  SET: "ZodSet",
  ENUM: "ZodEnum",
  NATIVE_ENUM: "ZodNativeEnum",
  LITERAL: "ZodLiteral",
  OPTIONAL: "ZodOptional",
  NULLABLE: "ZodNullable",
  DEFAULT: "ZodDefault",
  EFFECTS: "ZodEffects",
  LAZY: "ZodLazy",
  PIPELINE: "ZodPipeline",
  READONLY: "ZodReadonly",
  BRAND: "ZodBranded",
  CATCH: "ZodCatch",
} as const;

interface ZodCheck {
  readonly kind: string;
  readonly value?: number;
  readonly inclusive?: boolean;
}

interface ZodDefWithChecks {
  readonly typeName?: string;
  readonly type?: string;
  readonly checks?: readonly ZodCheck[];
  readonly values?: readonly unknown[];
  readonly value?: unknown;
  readonly shape?: (() => Record<string, z.ZodTypeAny>) | Record<string, z.ZodTypeAny>;
  readonly type_?: z.ZodTypeAny;
  readonly innerType?: z.ZodTypeAny;
  readonly options?: readonly z.ZodTypeAny[] | Map<string, z.ZodTypeAny>;
  readonly schema?: (() => z.ZodTypeAny) | z.ZodTypeAny;
  readonly keyType?: z.ZodTypeAny;
  readonly valueType?: z.ZodTypeAny;
  readonly items?: readonly z.ZodTypeAny[];
  readonly minLength?: { readonly value: number };
  readonly maxLength?: { readonly value: number };
  readonly defaultValue?: () => unknown;
  readonly in?: z.ZodTypeAny;
  readonly out?: z.ZodTypeAny;
}

function getTypeName(schema: z.ZodTypeAny): string {
  const def = schema._def as ZodDefWithChecks | undefined;
  if (def?.typeName) return def.typeName;
  if (def?.type) return def.type;
  if (schema.constructor?.name) return schema.constructor.name;
  return "";
}

function generateString(checks: readonly ZodCheck[], prng: PRNG): string {
  let isUuid = false;
  let isEmail = false;
  let isUrl = false;
  let isDatetime = false;
  let minLen = 3;
  let maxLen = 12;

  for (const check of checks) {
    if (check.kind === "uuid" || check.kind === "guid") {
      isUuid = true;
    } else if (check.kind === "email") {
      isEmail = true;
    } else if (check.kind === "url") {
      isUrl = true;
    } else if (check.kind === "datetime") {
      isDatetime = true;
    } else if (check.kind === "min" && typeof check.value === "number") {
      minLen = check.value;
      if (maxLen < minLen) maxLen = minLen + 5;
    } else if (check.kind === "max" && typeof check.value === "number") {
      maxLen = check.value;
      if (minLen > maxLen) minLen = maxLen;
    }
  }

  if (isUuid) return prng.uuid();
  if (isEmail) return prng.email();
  if (isUrl) return prng.url();
  if (isDatetime) return prng.date().toISOString();

  let generated = prng.word(minLen, maxLen);
  while (generated.length < minLen) {
    generated += `_${prng.word(1, 4)}`;
  }
  if (generated.length > maxLen) {
    generated = generated.slice(0, maxLen);
  }
  return generated;
}

function generateNumber(checks: readonly ZodCheck[], prng: PRNG): number {
  let min = 0;
  let max = 100;
  let isInt = false;

  for (const check of checks) {
    if (check.kind === "min" && typeof check.value === "number") {
      min = check.inclusive === false ? check.value + 1 : check.value;
      if (max < min) max = min + 100;
    } else if (check.kind === "max" && typeof check.value === "number") {
      max = check.inclusive === false ? check.value - 1 : check.value;
      if (min > max) min = max - 100;
    } else if (check.kind === "int") {
      isInt = true;
    }
  }

  if (isInt) {
    return prng.nextInt(min, max);
  }
  return Math.round(prng.nextFloat(min, max) * 100) / 100;
}

function generateObject(
  schema: z.ZodTypeAny,
  prng: PRNG,
  context: GenerateMockContext,
  depth: number
): Record<string, unknown> {
  const def = schema._def as ZodDefWithChecks;
  const rawShape = typeof def.shape === "function" ? def.shape() : def.shape;
  const shape = rawShape ?? {};
  const result: Record<string, unknown> = {};

  const inputMap = context.input ?? {};
  const overrideMap = context.overrides ?? {};

  for (const [key, fieldSchema] of Object.entries(shape)) {
    // 1. Check explicit override
    if (Object.prototype.hasOwnProperty.call(overrideMap, key)) {
      result[key] = overrideMap[key];
      continue;
    }

    // 2. Check input preservation from request payload
    if (Object.prototype.hasOwnProperty.call(inputMap, key)) {
      result[key] = inputMap[key];
      continue;
    }

    // 3. Generate fake mock value recursively
    result[key] = generateZodMockValue(fieldSchema, prng, context, depth + 1);
  }

  return result;
}

function generateArray(
  schema: z.ZodTypeAny,
  prng: PRNG,
  context: GenerateMockContext,
  depth: number
): readonly unknown[] {
  const def = schema._def as ZodDefWithChecks;
  const itemSchema = def.type_ ?? def.innerType ?? (schema as z.ZodArray<z.ZodTypeAny>).element;
  if (!itemSchema) return [];

  let count = context.count ?? 10;

  if (def.minLength?.value !== undefined && count < def.minLength.value) {
    count = def.minLength.value;
  }
  if (def.maxLength?.value !== undefined && count > def.maxLength.value) {
    count = def.maxLength.value;
  }

  const items: unknown[] = [];
  for (let i = 0; i < count; i++) {
    // For arrays of objects, we don't apply top-level input override to all items
    const itemContext: GenerateMockContext = {
      ...context,
      input: undefined,
    };
    items.push(generateZodMockValue(itemSchema, prng, itemContext, depth + 1));
  }
  return items;
}

function generateZodMockValue(
  schema: z.ZodTypeAny,
  prng: PRNG,
  context: GenerateMockContext,
  depth = 0
): unknown {
  if (depth > 20) {
    // Recursion guard for cyclical/lazy schemas
    return null;
  }

  const typeName = getTypeName(schema);
  const def = schema._def as ZodDefWithChecks;

  switch (typeName) {
    case ZOD_TYPE_NAMES.STRING:
      return generateString(def.checks ?? [], prng);

    case ZOD_TYPE_NAMES.NUMBER:
      return generateNumber(def.checks ?? [], prng);

    case ZOD_TYPE_NAMES.BOOLEAN:
      return prng.nextBoolean();

    case ZOD_TYPE_NAMES.BIGINT:
      return BigInt(prng.nextInt(1, 1000000));

    case ZOD_TYPE_NAMES.DATE:
      return prng.date();

    case ZOD_TYPE_NAMES.ENUM: {
      const values = def.values ?? (schema as z.ZodEnum<[string, ...string[]]>).options;
      if (Array.isArray(values) && values.length > 0) {
        return prng.pick(values);
      }
      return "ENUM_VALUE";
    }

    case ZOD_TYPE_NAMES.NATIVE_ENUM: {
      const values = def.values;
      if (values && typeof values === "object") {
        const validValues = Object.values(values).filter(
          (v) => typeof v === "string" || typeof v === "number"
        );
        if (validValues.length > 0) {
          return prng.pick(validValues);
        }
      }
      return 0;
    }

    case ZOD_TYPE_NAMES.LITERAL:
      return def.value;

    case ZOD_TYPE_NAMES.OBJECT:
      return generateObject(schema, prng, context, depth);

    case ZOD_TYPE_NAMES.ARRAY:
      return generateArray(schema, prng, context, depth);

    case ZOD_TYPE_NAMES.UNION:
    case ZOD_TYPE_NAMES.DISCRIMINATED_UNION: {
      const options = Array.isArray(def.options)
        ? def.options
        : def.options instanceof Map
          ? Array.from(def.options.values())
          : [];
      if (options.length > 0) {
        const chosen = prng.pick(options);
        return generateZodMockValue(chosen, prng, context, depth + 1);
      }
      return null;
    }

    case ZOD_TYPE_NAMES.INTERSECTION: {
      const left = (schema as z.ZodIntersection<z.ZodTypeAny, z.ZodTypeAny>)._def.left;
      const right = (schema as z.ZodIntersection<z.ZodTypeAny, z.ZodTypeAny>)._def.right;
      const leftVal = generateZodMockValue(left, prng, context, depth + 1);
      const rightVal = generateZodMockValue(right, prng, context, depth + 1);
      if (
        typeof leftVal === "object" &&
        leftVal !== null &&
        typeof rightVal === "object" &&
        rightVal !== null
      ) {
        return { ...leftVal, ...rightVal };
      }
      return leftVal;
    }

    case ZOD_TYPE_NAMES.TUPLE: {
      const items = def.items ?? [];
      return items.map((item) => generateZodMockValue(item, prng, context, depth + 1));
    }

    case ZOD_TYPE_NAMES.RECORD: {
      const valueType =
        def.valueType ?? (schema as z.ZodRecord<z.ZodTypeAny, z.ZodTypeAny>).valueSchema;
      const rec: Record<string, unknown> = {};
      const keyCount = prng.nextInt(2, 4);
      for (let i = 0; i < keyCount; i++) {
        const key = `key_${prng.word(3, 6)}_${i}`;
        rec[key] = valueType
          ? generateZodMockValue(valueType, prng, context, depth + 1)
          : prng.word();
      }
      return rec;
    }

    case ZOD_TYPE_NAMES.MAP: {
      const keyType = def.keyType ?? (schema as z.ZodMap<z.ZodTypeAny, z.ZodTypeAny>).keySchema;
      const valueType =
        def.valueType ?? (schema as z.ZodMap<z.ZodTypeAny, z.ZodTypeAny>).valueSchema;
      const map = new Map<unknown, unknown>();
      const count = prng.nextInt(1, 3);
      for (let i = 0; i < count; i++) {
        const k = keyType ? generateZodMockValue(keyType, prng, context, depth + 1) : `key_${i}`;
        const v = valueType
          ? generateZodMockValue(valueType, prng, context, depth + 1)
          : `val_${i}`;
        map.set(k, v);
      }
      return map;
    }

    case ZOD_TYPE_NAMES.SET: {
      const valueType = def.valueType ?? (schema as z.ZodSet<z.ZodTypeAny>)._def.valueType;
      const set = new Set<unknown>();
      const count = prng.nextInt(1, 3);
      for (let i = 0; i < count; i++) {
        const v = valueType ? generateZodMockValue(valueType, prng, context, depth + 1) : i;
        set.add(v);
      }
      return set;
    }

    case ZOD_TYPE_NAMES.OPTIONAL:
    case ZOD_TYPE_NAMES.NULLABLE: {
      const inner = def.innerType ?? (schema as z.ZodOptional<z.ZodTypeAny>).unwrap();
      return generateZodMockValue(inner, prng, context, depth + 1);
    }

    case ZOD_TYPE_NAMES.DEFAULT: {
      const inner = def.innerType ?? (schema as z.ZodDefault<z.ZodTypeAny>)._def.innerType;
      return generateZodMockValue(inner, prng, context, depth + 1);
    }

    case ZOD_TYPE_NAMES.EFFECTS: {
      const inner = (schema as z.ZodEffects<z.ZodTypeAny>)._def.schema;
      return generateZodMockValue(inner, prng, context, depth + 1);
    }

    case ZOD_TYPE_NAMES.LAZY: {
      const resolved = typeof def.schema === "function" ? def.schema() : def.schema;
      if (resolved) {
        return generateZodMockValue(resolved, prng, context, depth + 1);
      }
      return null;
    }

    case ZOD_TYPE_NAMES.PIPELINE: {
      const inSchema = def.in;
      if (inSchema) {
        return generateZodMockValue(inSchema, prng, context, depth + 1);
      }
      return null;
    }

    case ZOD_TYPE_NAMES.READONLY:
    case ZOD_TYPE_NAMES.BRAND:
    case ZOD_TYPE_NAMES.CATCH: {
      const inner = def.innerType ?? def.type_;
      if (inner) {
        return generateZodMockValue(inner, prng, context, depth + 1);
      }
      return null;
    }

    case ZOD_TYPE_NAMES.NULL:
      return null;

    case ZOD_TYPE_NAMES.UNDEFINED:
    case ZOD_TYPE_NAMES.VOID:
      return undefined;

    case ZOD_TYPE_NAMES.ANY:
    case ZOD_TYPE_NAMES.UNKNOWN:
      return prng.word();

    default:
      // Fallback for custom or unrecognized schema types
      return prng.word();
  }
}

/**
 * Generates a mock value for a given Zod schema adhering to all constraints.
 */
export function generateZodMock<T extends z.ZodTypeAny>(
  schema: T,
  context: GenerateMockContext = {}
): z.infer<T> {
  const seed = context.seed ?? 1337;
  const prng = createPrng(seed);
  return generateZodMockValue(schema, prng, context) as z.infer<T>;
}
