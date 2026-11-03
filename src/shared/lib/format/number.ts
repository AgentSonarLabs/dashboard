export function formatCompactNumber(value: number | null | undefined, locale = "vi-VN"): string {
  if (value == null || !Number.isFinite(value)) return "—";

  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatCurrency(
  value: number | null | undefined,
  currency = "USD",
  locale = "vi-VN",
): string {
  if (value == null || !Number.isFinite(value)) return "—";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 4,
  }).format(value);
}
