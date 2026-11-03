export function formatDuration(milliseconds: number | null | undefined): string {
  if (milliseconds == null || !Number.isFinite(milliseconds)) return "—";

  const value = Math.max(0, milliseconds);
  if (value < 1_000) return `${Math.round(value)} ms`;
  if (value < 60_000) return `${(value / 1_000).toFixed(2)} s`;
  if (value < 3_600_000) return `${(value / 60_000).toFixed(1)} min`;

  return `${(value / 3_600_000).toFixed(1)} hr`;
}
