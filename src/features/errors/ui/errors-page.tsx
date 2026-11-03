"use client";

import Link from "next/link";
import type { ErrorGroup } from "@/entities/telemetry/model";
import { useResource } from "@/shared/hooks/use-resource";
import { formatTimestamp } from "@/shared/lib/format/timestamp";
import { ResourceState } from "@/shared/ui/resource-state";

export function ErrorsPage() {
  const { data, error, loading } = useResource<{ groups: ErrorGroup[] }>("/api/errors?limit=500");
  const groups = data?.groups ?? [];
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">OBSERVABILITY / ERRORS</p>
          <h1>Error groups</h1>
          <p className="page-description">Repeated agent exceptions grouped by type and message.</p>
        </div>
        <div className="heading-count">{groups.length} groups</div>
      </div>
      <ResourceState
        loading={loading}
        error={error}
        empty={!loading && !error && groups.length === 0}
      >
        <div className="error-groups">
          {groups.map((group) => (
            <section className="panel error-group" key={group.signature}>
              <div className="error-group-count">
                {group.count}
                <small>events</small>
              </div>
              <div className="error-group-content">
                <div className="error-group-title">
                  <strong>{group.type}</strong>
                  <span>Last seen {formatTimestamp(group.lastAt)}</span>
                </div>
                <p>{group.message}</p>
                <div className="error-runs">
                  Runs{" "}
                  {group.runIds.map((id) => (
                    <Link className="mono link" href={`/runs/${encodeURIComponent(id)}`} key={id}>
                      {id.slice(0, 10)}
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </ResourceState>
    </>
  );
}
