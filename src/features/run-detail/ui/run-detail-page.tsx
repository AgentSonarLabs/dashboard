"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { RunDetail } from "@/entities/telemetry/model";
import { useResource } from "@/shared/hooks/use-resource";
import { formatDuration } from "@/shared/lib/format/duration";
import { formatCompactNumber, formatCurrency } from "@/shared/lib/format/number";
import { formatTimestamp } from "@/shared/lib/format/timestamp";
import { createTraceTimeline } from "@/shared/lib/trace-timeline";
import { ResourceState } from "@/shared/ui/resource-state";
import { FindingList, MetricCard, StatusBadge } from "@/shared/ui/telemetry-components";

export function RunDetailPage({ runId }: { runId: string }) {
  const { data, error, loading } = useResource<RunDetail>(`/api/runs/${encodeURIComponent(runId)}`);
  const [selectedSpanId, setSelectedSpanId] = useState("");
  const timeline = useMemo(() => (data ? createTraceTimeline(data.spans, data.run) : null), [data]);
  const selectedSpan =
    data?.spans.find((span) => span.id === selectedSpanId) ?? timeline?.spans[0]?.span;
  return (
    <>
      <div className="page-heading">
        <div>
          <Link className="back-link" href="/runs">
            ← All runs
          </Link>
          <p className="eyebrow">RUN DETAIL</p>
          <h1>{data?.run.agent ?? "Agent run"}</h1>
          <p className="page-description mono">{runId}</p>
        </div>
        {data && <StatusBadge status={data.run.status} />}
      </div>
      <ResourceState loading={loading} error={error}>
        {data ? (
          <>
            <div className="metric-grid detail-metrics">
              <MetricCard
                label="Started"
                value={formatTimestamp(data.run.startedAt)}
                detail="Local time"
              />
              <MetricCard
                label="Duration"
                value={formatDuration(data.run.duration)}
                detail={
                  data.run.endedAt ? `Ended ${formatTimestamp(data.run.endedAt)}` : "Still running"
                }
                accent="purple"
              />
              <MetricCard
                label="Tokens"
                value={formatCompactNumber(data.run.tokens)}
                detail="Reported by model spans"
                accent="orange"
              />
              <MetricCard
                label="Reported cost"
                value={formatCurrency(data.run.cost)}
                detail="Cost attributes received from spans"
                accent="green"
              />
            </div>
            <div className="content-grid">
              <section className="panel trace-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Trace timeline</h2>
                    <p>
                      {data.spans.length} spans · {formatDuration(timeline?.duration)}
                    </p>
                  </div>
                </div>
                {timeline && timeline.spans.length ? (
                  <div className="trace-layout">
                    <div className="trace-list" aria-label="Span timeline">
                      <div className="trace-axis">
                        <span className="trace-axis-label">SPAN</span>
                        <div className="trace-axis-scale" aria-hidden="true">
                          <span>0 ms</span>
                          <span>{formatDuration(timeline.duration * 0.25)}</span>
                          <span>{formatDuration(timeline.duration * 0.5)}</span>
                          <span>{formatDuration(timeline.duration * 0.75)}</span>
                          <span>{formatDuration(timeline.duration)}</span>
                        </div>
                      </div>
                      {timeline.spans.map(({ span, depth, leftPercent, widthPercent }) => (
                        <div
                          className={
                            selectedSpan?.id === span.id ? "trace-row selected" : "trace-row"
                          }
                          key={span.id}
                        >
                          <div
                            className="trace-name"
                            style={{ paddingLeft: `${8 + depth * 12}px` }}
                          >
                            <button
                              className="trace-name-button"
                              type="button"
                              onClick={() => setSelectedSpanId(span.id)}
                              aria-pressed={selectedSpan?.id === span.id}
                              aria-label={`Inspect ${span.type} span ${span.name}`}
                            >
                              <span className={`trace-kind type-${span.type}`}>{span.type}</span>
                              <span>
                                <span className="trace-title">{span.name}</span>
                                <span className="trace-subtitle">{span.id.slice(0, 12)}</span>
                              </span>
                            </button>
                            <span className="trace-duration">{formatDuration(span.duration)}</span>
                          </div>
                          <div className="trace-track">
                            {[25, 50, 75].map((position) => (
                              <span
                                className="trace-gridline"
                                key={position}
                                style={{ left: `${position}%` }}
                                aria-hidden="true"
                              />
                            ))}
                            <button
                              className={`trace-bar type-${span.type} status-${span.status}`}
                              type="button"
                              style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                              title={`${span.name} · ${formatDuration(span.duration)}`}
                              aria-label={`Select ${span.name}, ${formatDuration(span.duration)}`}
                              aria-pressed={selectedSpan?.id === span.id}
                              onClick={() => setSelectedSpanId(span.id)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    {selectedSpan ? (
                      <aside className="trace-inspector" aria-live="polite">
                        <h3>{selectedSpan.name}</h3>
                        <div className="trace-inspector-meta">
                          <span className={`trace-kind type-${selectedSpan.type}`}>
                            {selectedSpan.type}
                          </span>
                          <StatusBadge status={selectedSpan.status} />
                        </div>
                        <dl>
                          <div>
                            <dt>Span ID</dt>
                            <dd className="mono">{selectedSpan.id}</dd>
                          </div>
                          <div>
                            <dt>Parent</dt>
                            <dd className="mono">{selectedSpan.parentId ?? "Root span"}</dd>
                          </div>
                          <div>
                            <dt>Started</dt>
                            <dd>{formatTimestamp(selectedSpan.startedAt)}</dd>
                          </div>
                          <div>
                            <dt>Duration</dt>
                            <dd>{formatDuration(selectedSpan.duration)}</dd>
                          </div>
                        </dl>
                        <div className="trace-attributes">
                          <h4>Attributes</h4>
                          <pre>
                            {Object.keys(selectedSpan.metadata).length
                              ? JSON.stringify(selectedSpan.metadata, null, 2)
                              : "No attributes reported."}
                          </pre>
                        </div>
                      </aside>
                    ) : null}
                  </div>
                ) : (
                  <div className="quiet-empty">No spans were reported for this run.</div>
                )}
              </section>
              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <h2>Findings</h2>
                    <p>Detection results for this run</p>
                  </div>
                </div>
                <FindingList findings={data.findings} />
              </section>
              <section className="panel panel-wide">
                <div className="panel-heading">
                  <div>
                    <h2>Logs</h2>
                    <p>{data.logs.length} log records</p>
                  </div>
                </div>
                {data.logs.length ? (
                  data.logs.map((entry) => (
                    <div className="detail-log" key={entry.id}>
                      <time>{formatTimestamp(entry.timestamp)}</time>
                      <span className={`log-level level-${entry.level}`}>{entry.level}</span>
                      <span>{entry.message}</span>
                    </div>
                  ))
                ) : (
                  <div className="quiet-empty">No logs in this run.</div>
                )}
              </section>
              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <h2>Errors</h2>
                    <p>{data.errors.length} captured</p>
                  </div>
                </div>
                {data.errors.length ? (
                  data.errors.map((item) => (
                    <div className="run-error" key={item.id}>
                      <strong>{item.type}</strong>
                      <p>{item.message}</p>
                      {item.stack && <pre>{item.stack}</pre>}
                    </div>
                  ))
                ) : (
                  <div className="quiet-empty">No errors in this run.</div>
                )}
              </section>
            </div>
          </>
        ) : null}
      </ResourceState>
    </>
  );
}
