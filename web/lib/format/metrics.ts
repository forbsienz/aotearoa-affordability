export function formatMoney(value: number | null | undefined, digits = 0): string {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

export function formatPct(value: number | null | undefined, digits = 1): string {
  if (value == null || Number.isNaN(value)) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}

export function formatNumber(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-NZ").format(value);
}

export function grainLabel(grain: string): string {
  switch (grain) {
    case "sa2":
      return "Suburb / SA2";
    case "ta":
      return "City / district";
    case "region":
      return "Region";
    case "cpi_region":
      return "CPI region";
    case "island":
      return "Island";
    case "national":
      return "New Zealand";
    default:
      return grain;
  }
}
