/**
 * Mulberry32 pseudo-random number generator.
 * Fast, 32-bit state, deterministic generator with 2^32 period.
 */
export interface PRNG {
  /** Return a floating point number in range [0, 1) */
  next(): number;
  /** Return an integer in range [min, max] inclusive */
  nextInt(min: number, max: number): number;
  /** Return a floating point number in range [min, max] */
  nextFloat(min: number, max: number): number;
  /** Return a boolean value */
  nextBoolean(): boolean;
  /** Pick one element from an array */
  pick<T>(items: readonly T[]): T;
  /** Generate a random RFC 4122 v4 UUID */
  uuid(): string;
  /** Generate a random email */
  email(): string;
  /** Generate a random URL */
  url(): string;
  /** Generate a random word */
  word(minLen?: number, maxLen?: number): string;
  /** Generate a random date */
  date(fromYear?: number, toYear?: number): Date;
}

const WORDS: readonly string[] = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "sed",
  "do",
  "eiusmod",
  "tempor",
  "incididunt",
  "ut",
  "labore",
  "et",
  "dolore",
  "magna",
  "aliqua",
  "enim",
  "ad",
  "minim",
  "veniam",
  "quis",
  "nostrud",
  "exercitation",
  "ullamco",
  "laboris",
  "nisi",
  "aliquip",
  "ex",
  "ea",
  "commodo",
  "consequat",
  "duis",
  "aute",
  "irure",
  "in",
  "reprehenderit",
  "voluptate",
  "velit",
  "esse",
  "cillum",
  "fugiat",
  "nulla",
  "pariatur",
  "excepteur",
  "sint",
  "occaecat",
  "cupidatat",
  "non",
  "proident",
  "sunt",
  "culpa",
  "qui",
  "officia",
  "deserunt",
  "mollit",
  "anim",
  "id",
  "est",
  "laborum",
  "task",
  "project",
  "user",
  "order",
  "product",
  "item",
];

const DOMAINS: readonly string[] = ["example.com", "mockapi.dev", "testmail.org", "demo.io"];

export function createPrng(seed: number = 1337): PRNG {
  let state = seed >>> 0 || 1;

  function next(): number {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  function nextInt(min: number, max: number): number {
    const lo = Math.ceil(min);
    const hi = Math.floor(max);
    if (lo >= hi) return lo;
    return Math.floor(next() * (hi - lo + 1)) + lo;
  }

  function nextFloat(min: number, max: number): number {
    if (min >= max) return min;
    return next() * (max - min) + min;
  }

  function nextBoolean(): boolean {
    return next() >= 0.5;
  }

  function pick<T>(items: readonly T[]): T {
    if (items.length === 0) {
      throw new Error("Cannot pick from an empty array");
    }
    const index = nextInt(0, items.length - 1);
    const selected = items[index];
    if (selected === undefined) {
      throw new Error(`Invalid index ${index} for array of length ${items.length}`);
    }
    return selected;
  }

  function hexDigit(): string {
    const digits = "0123456789abcdef";
    return digits[nextInt(0, 15)] ?? "0";
  }

  function hexString(length: number): string {
    let res = "";
    for (let i = 0; i < length; i++) {
      res += hexDigit();
    }
    return res;
  }

  function uuid(): string {
    // RFC 4122 v4 UUID: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    // where y is [8, 9, a, b]
    const p1 = hexString(8);
    const p2 = hexString(4);
    const p3 = "4" + hexString(3);
    const yDigits = ["8", "9", "a", "b"] as const;
    const y = pick(yDigits);
    const p4 = y + hexString(3);
    const p5 = hexString(12);
    return `${p1}-${p2}-${p3}-${p4}-${p5}`;
  }

  function email(): string {
    const name = pick(WORDS);
    const id = nextInt(100, 999);
    const domain = pick(DOMAINS);
    return `${name}_${id}@${domain}`;
  }

  function url(): string {
    const domain = pick(DOMAINS);
    const path1 = pick(WORDS);
    const path2 = pick(WORDS);
    return `https://${domain}/${path1}/${path2}`;
  }

  function word(minLen = 3, maxLen = 10): string {
    const matching = WORDS.filter((w) => w.length >= minLen && w.length <= maxLen);
    if (matching.length > 0) {
      return pick(matching);
    }
    return pick(WORDS);
  }

  function date(fromYear = 2020, toYear = 2026): Date {
    const year = nextInt(fromYear, toYear);
    const month = nextInt(0, 11);
    const day = nextInt(1, 28);
    const hours = nextInt(0, 23);
    const mins = nextInt(0, 59);
    return new Date(Date.UTC(year, month, day, hours, mins));
  }

  return {
    next,
    nextInt,
    nextFloat,
    nextBoolean,
    pick,
    uuid,
    email,
    url,
    word,
    date,
  };
}
