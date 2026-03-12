import { assertEquals, assertThrows } from "@std/assert";
import {
  CO_AUTHORS,
  getCoAuthorTrailer,
  isBusinessHours,
  validateDate,
} from "./main.ts";

Deno.test("validateDate: valid YYYYMMDD format", () => {
  assertEquals(validateDate("20250101"), "20250101");
  assertEquals(validateDate("20111231"), "20111231");
  assertEquals(validateDate("21110630"), "21110630");
});

Deno.test("validateDate: invalid format throws", () => {
  assertThrows(() => validateDate("invalid"), Error);
  assertThrows(() => validateDate("2025-01-01"), Error);
  assertThrows(() => validateDate(""), Error);
});

Deno.test("isBusinessHours: 10:00-18:59 returns true", () => {
  assertEquals(isBusinessHours(10), true);
  assertEquals(isBusinessHours(12), true);
  assertEquals(isBusinessHours(15), true);
  assertEquals(isBusinessHours(18), true);
});

Deno.test("isBusinessHours: 19:00-09:59 returns false", () => {
  assertEquals(isBusinessHours(0), false);
  assertEquals(isBusinessHours(3), false);
  assertEquals(isBusinessHours(9), false);
  assertEquals(isBusinessHours(19), false);
  assertEquals(isBusinessHours(21), false);
  assertEquals(isBusinessHours(23), false);
});

Deno.test("getCoAuthorTrailer: specific author returns correct trailer", () => {
  assertEquals(
    getCoAuthorTrailer("cursor"),
    "Co-authored-by: Cursor <cursoragent@cursor.com>",
  );
  assertEquals(
    getCoAuthorTrailer("claude"),
    "Co-authored-by: Claude <noreply@anthropic.com>",
  );
  assertEquals(
    getCoAuthorTrailer("devin"),
    "Co-authored-by: devin-ai-integration[bot] <devin-ai-integration[bot]@users.noreply.github.com>",
  );
});

Deno.test("getCoAuthorTrailer: random returns a valid trailer", () => {
  const validTrailers = Object.values(CO_AUTHORS);
  for (let i = 0; i < 20; i++) {
    const trailer = getCoAuthorTrailer("random");
    assertEquals(validTrailers.includes(trailer), true);
  }
});

Deno.test("getCoAuthorTrailer: unknown author returns empty string", () => {
  assertEquals(getCoAuthorTrailer("unknown"), "");
  assertEquals(getCoAuthorTrailer(""), "");
});
