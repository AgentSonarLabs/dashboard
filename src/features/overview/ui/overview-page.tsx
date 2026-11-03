"use client";

import Link from "next/link";
import type { OverviewResponse } from "@/entities/telemetry/model";
import { useResource } from "@/shared/hooks/use-resource";
import { formatDuration } from "@/shared/lib/format/duration";
import { formatCompactNumber, formatCurrency } from "@/shared/lib/format/number";
import { ResourceState } from "@/shared/ui/resource-state";
import { FindingList, MetricCard, RunTable } from "@/shared/ui/telemetry-components";

export function OverviewPage() {
  const { data, error, loading, refresh } = useResource<OverviewResponse>("/api/overview");
  const metrics = data?.metrics;

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">OBSERVABILITY / OVERVIEW</p>
          <h1>Agent activity</h1>
          <p className="page-description">Live health and usage across instrumented agent runs.</p>
        </div>
        <button className="button-secondary" onClick={refresh} type="button">
          ↻ Refresh
        </button>
      </div>
      <ResourceState loading={loading} error={error}>
        {metrics && data ? (
          <>
            <div className="metric-grid">
              <MetricCard
                label="Total runs"
                value={metrics.runs.total}
                detail={`${metrics.runs.running} currently running`}
              />
              <MetricCard
                label="Success rate"
                value={
                  metrics.runs.successRate == null ? "—" : `${metrics.runs.successRate.toFixed(1)}%`
                }
                detail={`${metrics.runs.success} successful · ${metrics.runs.error} failed`}
                accent="green"
              />
              <MetricCard
                label="Avg. duration"
                value={formatDuration(metrics.duration.avg)}
                detail={`Longest ${formatDuration(metrics.duration.max)}`}
                accent="purple"
              />
              <MetricCard
                label="Tokens used"
                value={formatCompactNumber(metrics.tokens.total)}
                detail={`Avg. ${formatCompactNumber(metrics.tokens.avg)} per run`}
                accent="orange"
              />
              <MetricCard
                label="Estimated cost"
                value={formatCurrency(metrics.cost.total)}
                detail="Reported by model spans"
                accent="green"
              />
              <MetricCard
                label="LLM / tool calls"
                value={`${metrics.calls.llm} / ${metrics.calls.tool}`}
                detail="Observed span activity"
                accent="blue"
              />
              <MetricCard
                label="Errors"
                value={metrics.errors.total}
                detail="Captured agent exceptions"
                accent="orange"
              />
              <MetricCard
                label="Findings"
                value={metrics.findings.total}
                detail={`${metrics.findings.critical} critical · ${metrics.findings.warning} warnings`}
                accent="purple"
              />
            </div>
            <div className="content-grid overview-grid">
              <section className="panel panel-wide">
                <div className="panel-heading">
                  <div>
                    <h2>Recent runs</h2>
                    <p>Latest agent executions</p>
                  </div>
                  <Link className="text-link" href="/runs">
                    View all runs →
                  </Link>
                </div>
                {data.recentRuns.length ? (
                  <RunTable runs={data.recentRuns} />
                ) : (
                  <div className="quiet-empty">Waiting for the first OTLP trace.</div>
                )}
              </section>
              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <h2>Recent findings</h2>
                    <p>Deterministic runtime signals</p>
                  </div>
                </div>
                <FindingList findings={data.recentFindings} />
              </section>
              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <h2>Most frequent errors</h2>
                    <p>Grouped by type and message</p>
                  </div>
                  <Link className="text-link" href="/errors">
                    All errors →
                  </Link>
                </div>
                {data.topErrors.length ? (
                  data.topErrors.map((item) => (
                    <div className="error-summary" key={item.signature}>
                      <span className="error-count">{item.count}</span>
                      <div>
                        <strong>{item.type}</strong>
                        <p>{item.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="quiet-empty">No agent errors captured.</div>
                )}
              </section>
            </div>
          </>
        ) : null}
      </ResourceState>
    </>
  );
}
