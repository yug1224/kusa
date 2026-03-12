import { assertEquals, assertThrows } from "@std/assert";
import {
  CO_AUTHORS,
  getCoAuthorTrailer,
  isWorkTime,
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

Deno.test("isWorkTime: 21:00-03:00 returns true", () => {
  assertEquals(isWorkTime(21), true);
  assertEquals(isWorkTime(22), true);
  assertEquals(isWorkTime(23), true);
  assertEquals(isWorkTime(0), true);
  assertEquals(isWorkTime(1), true);
  assertEquals(isWorkTime(2), true);
  assertEquals(isWorkTime(3), true);
});

Deno.test("isWorkTime: 04:00-20:00 returns false", () => {
  assertEquals(isWorkTime(4), false);
  assertEquals(isWorkTime(10), false);
  assertEquals(isWorkTime(12), false);
  assertEquals(isWorkTime(15), false);
  assertEquals(isWorkTime(20), false);
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
