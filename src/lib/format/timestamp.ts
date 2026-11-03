export function formatTimestamp(
  value: number | null | undefined,
  locale = "vi-VN",
): string {
  if (value == null || !Number.isFinite(value)) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(date);
}

