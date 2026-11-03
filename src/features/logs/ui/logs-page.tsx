"use client";

import { useMemo, useState } from "react";
import type { LogEntry } from "@/entities/telemetry/model";
import { useResource } from "@/shared/hooks/use-resource";
import { ResourceState } from "@/shared/ui/resource-state";
import { LogRow } from "@/shared/ui/telemetry-components";

export function LogsPage() {
  const { data, error, loading } = useResource<{ logs: LogEntry[] }>("/api/logs?limit=500");
  const [level, setLevel] = useState("all");
  const [query, setQuery] = useState("");
  const logs = useMemo(
    () =>
      (data?.logs ?? []).filter((entry) => {
        return (
          (level === "all" || entry.level === level) &&
          entry.message.toLowerCase().includes(query.toLowerCase())
        );
      }),
    [data?.logs, level, query],
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">OBSERVABILITY / LOGS</p>
          <h1>Agent logs</h1>
          <p className="page-description">
            Structured log records emitted from active and completed runs.
          </p>
        </div>
      </div>
      <section className="panel">
        <div className="filter-bar">
          <label className="search-field">
            <span>⌕</span>
            <input
              aria-label="Search logs"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search log messages"
              value={query}
            />
          </label>
          <select
            aria-label="Filter by level"
            onChange={(event) => setLevel(event.target.value)}
            value={level}
          >
            <option value="all">All levels</option>
            <option value="trace">Trace</option>
            <option value="debug">Debug</option>
            <option value="info">Info</option>
            <option value="warn">Warn</option>
            <option value="error">Error</option>
            <option value="fatal">Fatal</option>
          </select>
          <span className="result-count">{logs.length} records</span>
        </div>
        <ResourceState
          loading={loading}
          error={error}
          empty={!loading && !error && logs.length === 0}
        >
          <div className="log-stream">
            {logs.map((entry) => (
              <LogRow entry={entry} key={entry.id} />
            ))}
          </div>
        </ResourceState>
      </section>
    </>
  );
}
