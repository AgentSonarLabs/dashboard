"use client";

import { useMemo, useState } from "react";
import type { Run } from "@/entities/telemetry/model";
import { useResource } from "@/shared/hooks/use-resource";
import { ResourceState } from "@/shared/ui/resource-state";
import { RunTable } from "@/shared/ui/telemetry-components";

export function RunsPage() {
  const { data, error, loading } = useResource<{ runs: Run[] }>("/api/runs?limit=500");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const filtered = useMemo(
    () =>
      (data?.runs ?? []).filter((run) => {
        const matchesQuery = `${run.agent} ${run.id}`.toLowerCase().includes(query.toLowerCase());
        return matchesQuery && (status === "all" || run.status === status);
      }),
    [data?.runs, query, status],
  );

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">OBSERVABILITY / RUNS</p>
          <h1>Agent runs</h1>
          <p className="page-description">
            Search executions and inspect their traces, logs, errors, and findings.
          </p>
        </div>
      </div>
      <section className="panel">
        <div className="filter-bar">
          <label className="search-field">
            <span>⌕</span>
            <input
              aria-label="Search runs"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search agent or run ID"
              value={query}
            />
          </label>
          <select
            aria-label="Filter by status"
            onChange={(event) => setStatus(event.target.value)}
            value={status}
          >
            <option value="all">All statuses</option>
            <option value="running">Running</option>
            <option value="success">Success</option>
            <option value="error">Error</option>
          </select>
          <span className="result-count">{filtered.length} runs</span>
        </div>
        <ResourceState
          loading={loading}
          error={error}
          empty={!loading && !error && filtered.length === 0}
        >
          <RunTable runs={filtered} />
        </ResourceState>
      </section>
    </>
  );
}
