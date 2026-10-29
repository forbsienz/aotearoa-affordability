import type { MetricValue } from "@/lib/types";
import { formatMoney, formatPct } from "@/lib/format/metrics";
import { DeltaChip } from "@/components/ui/DeltaChip";
import { GeoBadge } from "@/components/ui/GeoBadge";

function displayValue(m: MetricValue): string {
  if (m.value == null) return "—";
  if (m.unit === "yoy_pct") return formatPct(m.value);
  if (m.unit === "nzd_per_week" || m.unit === "nzd" || m.unit === "nzd_per_year" || m.unit === "nzd_per_quarter") {
    return formatMoney(m.value, m.unit === "nzd_per_week" ? 0 : 0);
  }
  return String(m.value);
}

function unitHint(unit: string): string {
  switch (unit) {
    case "nzd_per_week":
      return "per week";
    case "nzd_per_year":
      return "per year";
    case "nzd_per_quarter":
      return "per quarter";
    case "yoy_pct":
      return "year on year";
    default:
      return "";
  }
}

export function MetricTile({ metric, title }: { metric: MetricValue; title: string }) {
  return (
    <div className="rounded-[var(--radius-sub)] border border-[var(--border)] bg-[var(--bg-card)] p-3">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
        <GeoBadge grain={metric.geography} label={metric.geography_label} />
      </div>
      <p className="font-[family-name:var(--font-display)] text-2xl tracking-tight">
        {displayValue(metric)}
      </p>
      <p className="mt-0.5 text-xs text-[var(--text-muted)]">{unitHint(metric.unit)}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {metric.unit !== "yoy_pct" ? <DeltaChip value={metric.yoy_pct} /> : null}
        <span className="text-[0.7rem] text-[var(--text-muted)]">{metric.period}</span>
      </div>
      {metric.note ? (
        <p className="mt-2 text-xs leading-snug text-[var(--text-muted)]">{metric.note}</p>
      ) : null}
      <p className="mt-1 text-[0.65rem] text-[var(--text-muted)]">Source: {metric.source}</p>
    </div>
  );
}
