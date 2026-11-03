export interface TimelineSpan {
  id: string;
  parentId: string | null;
  startedAt: number;
  endedAt: number | null;
  duration: number | null;
}

export interface PositionedSpan<T extends TimelineSpan> {
  span: T;
  depth: number;
  leftPercent: number;
  widthPercent: number;
}

export function createTraceTimeline<T extends TimelineSpan>(
  spans: T[],
  run: { startedAt: number; endedAt: number | null; duration: number | null },
  now = Date.now(),
): { startedAt: number; endedAt: number; duration: number; spans: PositionedSpan<T>[] } {
  const spanStarts = spans.map((span) => span.startedAt);
  const startedAt = Math.min(run.startedAt, ...spanStarts);
  const runEnd = run.endedAt ?? (run.duration == null ? now : run.startedAt + run.duration);
  const spanEnds = spans.map(
    (span) =>
      span.endedAt ?? span.startedAt + (span.duration ?? Math.max(0, runEnd - span.startedAt)),
  );
  const endedAt = Math.max(startedAt + 1, runEnd, ...spanEnds);
  const duration = endedAt - startedAt;
  const spansById = new Map(spans.map((span) => [span.id, span]));

  const depthOf = (span: T): number => {
    let depth = 0;
    let parentId = span.parentId;
    const visited = new Set([span.id]);
    while (parentId) {
      if (visited.has(parentId)) break;
      const parent = spansById.get(parentId);
      if (!parent) break;
      visited.add(parentId);
      depth += 1;
      parentId = parent.parentId;
    }
    return depth;
  };

  const positioned = spans.map((span) => {
    const spanEnd =
      span.endedAt ?? span.startedAt + (span.duration ?? Math.max(0, runEnd - span.startedAt));
    const rawWidth = ((spanEnd - span.startedAt) / duration) * 100;
    return {
      span,
      depth: depthOf(span),
      leftPercent: Math.max(0, Math.min(100, ((span.startedAt - startedAt) / duration) * 100)),
      widthPercent: Math.max(0.8, Math.min(100, rawWidth)),
    };
  });

  positioned.sort(
    (left, right) => left.span.startedAt - right.span.startedAt || left.depth - right.depth,
  );
  return { startedAt, endedAt, duration, spans: positioned };
}
