import { describe, it, expect } from "vitest";
import { z } from "zod";
import { generateMock } from "../src";

describe("Zod AST Mock Generator", () => {
  it("generates valid RFC 4122 v4 UUIDs", () => {
    const Schema = z.object({
      id: z.string().uuid(),
    });

    const mock = generateMock(Schema, { seed: 100 });
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(uuidRegex.test(mock.id)).toBe(true);
    expect(Schema.safeParse(mock).success).toBe(true);
  });

  it("generates valid emails", () => {
    const Schema = z.object({
      email: z.string().email(),
    });

    const mock = generateMock(Schema, { seed: 200 });
    expect(mock.email).toContain("@");
    expect(Schema.safeParse(mock).success).toBe(true);
  });

  it("generates valid URLs", () => {
    const Schema = z.object({
      website: z.string().url(),
    });

    const mock = generateMock(Schema, { seed: 300 });
    expect(mock.website.startsWith("https://")).toBe(true);
    expect(Schema.safeParse(mock).success).toBe(true);
  });

  it("respects string min and max length constraints", () => {
    const Schema = z.object({
      shortText: z.string().min(5).max(10),
    });

    for (let s = 1; s <= 10; s++) {
      const mock = generateMock(Schema, { seed: s });
      expect(mock.shortText.length).toBeGreaterThanOrEqual(5);
      expect(mock.shortText.length).toBeLessThanOrEqual(10);
      expect(Schema.safeParse(mock).success).toBe(true);
    }
  });

  it("respects number min, max, and integer constraints", () => {
    const Schema = z.object({
      age: z.number().int().min(18).max(65),
      score: z.number().min(0).max(100),
    });

    for (let s = 1; s <= 10; s++) {
      const mock = generateMock(Schema, { seed: s * 10 });
      expect(Number.isInteger(mock.age)).toBe(true);
      expect(mock.age).toBeGreaterThanOrEqual(18);
      expect(mock.age).toBeLessThanOrEqual(65);
      expect(mock.score).toBeGreaterThanOrEqual(0);
      expect(mock.score).toBeLessThanOrEqual(100);
      expect(Schema.safeParse(mock).success).toBe(true);
    }
  });

  it("picks valid values for z.enum", () => {
    const statuses = ["todo", "in_progress", "review", "done"] as const;
    const Schema = z.object({
      status: z.enum(statuses),
    });

    for (let s = 1; s <= 10; s++) {
      const mock = generateMock(Schema, { seed: s });
      expect(statuses).toContain(mock.status);
      expect(Schema.safeParse(mock).success).toBe(true);
    }
  });

  it("handles z.literal", () => {
    const Schema = z.object({
      type: z.literal("system_event"),
      code: z.literal(404),
    });

    const mock = generateMock(Schema);
    expect(mock.type).toBe("system_event");
    expect(mock.code).toBe(404);
  });

  it("generates nested objects and arrays with custom counts", () => {
    const Schema = z.object({
      user: z.object({
        name: z.string(),
        roles: z.array(z.string()),
      }),
      tags: z.array(z.string()),
    });

    const mock = generateMock(Schema, { count: 3, seed: 42 });
    expect(mock.tags).toHaveLength(3);
    expect(mock.user.roles).toHaveLength(3);
    expect(Schema.safeParse(mock).success).toBe(true);
  });

  it("handles unions and discriminated unions", () => {
    const ActionSchema = z.discriminatedUnion("type", [
      z.object({ type: z.literal("click"), x: z.number(), y: z.number() }),
      z.object({ type: z.literal("keypress"), key: z.string() }),
    ]);

    const mock = generateMock(ActionSchema, { seed: 50 });
    expect(["click", "keypress"]).toContain(mock.type);
    expect(ActionSchema.safeParse(mock).success).toBe(true);
  });

  it("handles z.record and z.tuple", () => {
    const Schema = z.object({
      scores: z.record(z.string(), z.number()),
      coordinate: z.tuple([z.number(), z.number()]),
    });

    const mock = generateMock(Schema, { seed: 77 });
    expect(Array.isArray(mock.coordinate)).toBe(true);
    expect(mock.coordinate).toHaveLength(2);
    expect(typeof mock.scores).toBe("object");
    expect(Schema.safeParse(mock).success).toBe(true);
  });

  it("handles optional and nullable fields", () => {
    const Schema = z.object({
      optStr: z.string().optional(),
      nullNum: z.number().nullable(),
      defVal: z.string().default("default_text"),
    });

    const mock = generateMock(Schema, { seed: 88 });
    expect(Schema.safeParse(mock).success).toBe(true);
  });
});
