import type { ReactNode } from "react";

export function ResourceState({
  loading,
  error,
  empty,
  children,
}: {
  loading: boolean;
  error: string | null;
  empty?: boolean;
  children: ReactNode;
}) {
  if (loading) return <div className="state-card">Loading telemetry…</div>;
  if (error) {
    return (
      <div className="state-card error-state" role="alert">
        <strong>Could not load data</strong>
        <span>{error}</span>
      </div>
    );
  }
  if (empty) return <div className="state-card">No telemetry has arrived yet.</div>;
  return children;
}
