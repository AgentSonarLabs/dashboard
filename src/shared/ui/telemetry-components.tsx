import Link from "next/link";
import type { Finding, LogEntry, Run } from "@/entities/telemetry/model";
import { formatDuration } from "@/shared/lib/format/duration";
import { formatCompactNumber, formatCurrency } from "@/shared/lib/format/number";
import { formatTimestamp } from "@/shared/lib/format/timestamp";

export function MetricCard({
  label,
  value,
  detail,
  accent = "blue",
}: {
  label: string;
  value: string | number;
  detail: string;
  accent?: "blue" | "green" | "orange" | "purple";
}) {
  return (
    <section className={`metric-card accent-${accent}`}>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      <div className="metric-detail">{detail}</div>
    </section>
  );
}

export function RunTable({ runs }: { runs: Run[] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Run</th>
            <th>Agent</th>
            <th>Status</th>
            <th>Started</th>
            <th>Duration</th>
            <th>Tokens</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          {runs.map((run) => (
            <tr key={run.id}>
              <td>
                <Link className="mono link" href={`/runs/${encodeURIComponent(run.id)}`}>
                  {run.id.slice(0, 12)}
                </Link>
              </td>
              <td className="primary-cell">{run.agent}</td>
              <td>
                <StatusBadge status={run.status} />
              </td>
              <td>{formatTimestamp(run.startedAt)}</td>
              <td>{formatDuration(run.duration)}</td>
              <td>{formatCompactNumber(run.tokens)}</td>
              <td>{formatCurrency(run.cost)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return <span className={`status-badge status-${status}`}>{status}</span>;
}

export function FindingList({ findings }: { findings: Finding[] }) {
  if (findings.length === 0) return <p className="quiet-empty">No findings detected.</p>;
  return (
    <div className="finding-list">
      {findings.map((finding) => (
        <Link
          href={`/runs/${encodeURIComponent(finding.runId)}`}
          className="finding-row"
          key={finding.id}
        >
          <span className={`severity-mark severity-${finding.severity}`} />
          <span className="finding-copy">
            <strong>{finding.type.replaceAll("_", " ")}</strong>
            <small>{finding.message}</small>
          </span>
          <span className="severity-label">{finding.severity}</span>
        </Link>
      ))}
    </div>
  );
}

export function LogRow({ entry }: { entry: LogEntry }) {
  return (
    <div className="log-row">
      <time>{formatTimestamp(entry.timestamp)}</time>
      <span className={`log-level level-${entry.level}`}>{entry.level}</span>
      <span className="log-message">{entry.message}</span>
      <span className="mono log-run">{entry.runId.slice(0, 10)}</span>
    </div>
  );
}
