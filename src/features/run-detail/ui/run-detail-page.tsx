"use client";

import Link from "next/link";
import type { RunDetail } from "@/entities/telemetry/model";
import { useResource } from "@/shared/hooks/use-resource";
import { formatDuration } from "@/shared/lib/format/duration";
import { formatCompactNumber, formatCurrency } from "@/shared/lib/format/number";
import { formatTimestamp } from "@/shared/lib/format/timestamp";
import { ResourceState } from "@/shared/ui/resource-state";
import { FindingList, MetricCard, StatusBadge } from "@/shared/ui/telemetry-components";

export function RunDetailPage({ runId }: { runId: string }) {
  const { data, error, loading } = useResource<RunDetail>(`/api/runs/${encodeURIComponent(runId)}`);
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
                label="Cost"
                value={formatCurrency(data.run.cost)}
                detail="Reported by model spans"
                accent="green"
              />
            </div>
            <div className="content-grid">
              <section className="panel panel-wide">
                <div className="panel-heading">
                  <div>
                    <h2>Trace timeline</h2>
                    <p>{data.spans.length} spans in this run</p>
                  </div>
                </div>
                {data.spans.length ? (
                  <div className="span-list">
                    {data.spans.map((span) => (
                      <div className="span-row" key={span.id}>
                        <span className={`span-type type-${span.type}`}>{span.type}</span>
                        <div className="span-copy">
                          <strong>{span.name}</strong>
                          <small className="mono">{span.id}</small>
                        </div>
                        <StatusBadge status={span.status} />
                        <span>{formatDuration(span.duration)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="quiet-empty">No spans in this run.</div>
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
