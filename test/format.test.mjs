import assert from "node:assert/strict";
import test from "node:test";
import { formatDuration } from "../.test-build/shared/lib/format/duration.js";
import { formatCompactNumber, formatCurrency } from "../.test-build/shared/lib/format/number.js";
import { formatTimestamp } from "../.test-build/shared/lib/format/timestamp.js";

test("duration formatter handles subsecond, seconds, minutes, hours, and missing data", () => {
  assert.equal(formatDuration(25), "25 ms");
  assert.equal(formatDuration(1_250), "1.25 s");
  assert.equal(formatDuration(90_000), "1.5 min");
  assert.equal(formatDuration(3_600_000), "1.0 hr");
  assert.equal(formatDuration(null), "—");
  assert.equal(formatDuration(Number.NaN), "—");
});

test("number and timestamp formatters handle missing and invalid values", () => {
  assert.notEqual(formatCompactNumber(1_500), "—");
  assert.equal(formatCurrency(null), "—");
  assert.equal(formatTimestamp(Number.NaN), "—");
  assert.notEqual(formatTimestamp(0, "en-US"), "—");
});
