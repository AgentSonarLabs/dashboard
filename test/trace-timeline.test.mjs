import assert from "node:assert/strict";
import test from "node:test";
import { createTraceTimeline } from "../.test-build/shared/lib/trace-timeline.js";

test("trace timeline positions spans against run time and preserves parent depth", () => {
  const spans = [
    { id: "child", parentId: "root", startedAt: 120, endedAt: 145, duration: 25 },
    { id: "root", parentId: null, startedAt: 100, endedAt: 200, duration: 100 },
  ];
  const timeline = createTraceTimeline(spans, { startedAt: 100, endedAt: 200, duration: 100 }, 250);

  assert.equal(timeline.duration, 100);
  assert.deepEqual(
    timeline.spans.map(({ span, depth, leftPercent, widthPercent }) => ({
      id: span.id,
      depth,
      leftPercent,
      widthPercent,
    })),
    [
      { id: "root", depth: 0, leftPercent: 0, widthPercent: 100 },
      { id: "child", depth: 1, leftPercent: 20, widthPercent: 25 },
    ],
  );
});

test("open spans extend to the current run time and cyclic parents do not loop", () => {
  const timeline = createTraceTimeline(
    [
      { id: "first", parentId: "second", startedAt: 900, endedAt: null, duration: null },
      { id: "second", parentId: "first", startedAt: 920, endedAt: null, duration: null },
    ],
    { startedAt: 800, endedAt: null, duration: null },
    1_000,
  );

  assert.equal(timeline.endedAt, 1_000);
  assert.equal(timeline.duration, 200);
  assert.deepEqual(
    timeline.spans.map(({ depth }) => depth),
    [1, 1],
  );
  assert.deepEqual(
    timeline.spans.map(({ widthPercent }) => widthPercent),
    [50, 40],
  );
});
