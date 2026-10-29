"use client";

import { useMemo, useState } from "react";
import type { AreaBrief, AreaIndex, GeographyBaselines } from "@/lib/types";
import { formatMoney, formatPct } from "@/lib/format/metrics";
import {
  affordabilityPressure,
  pressureClass,
  type DeltaKind,
} from "@/lib/format/sentiment";
import { DeltaChip } from "@/components/ui/DeltaChip";
import { GeoBadge } from "@/components/ui/GeoBadge";

function Column({ brief }: { brief: AreaBrief | null }) {
  if (!brief) {
    return (
      <div className="card flex min-h-48 items-center justify-center p-4 text-sm text-[var(--text-muted)]">
        Select a district
      </div>
    );
  }
  const rentShare = brief.affordability.rent_as_pct_of_approx_weekly_earnings;
  return (
    <div className="card space-y-3 p-4">
      <div>
        <GeoBadge grain="ta" label={brief.display_name} />
        <h2 className="mt-2 text-xl">{brief.display_name}</h2>
        <p className="text-xs text-[var(--text-muted)]">
          {brief.geography.region_name} · CPI region: {brief.geography.cpi_region}
        </p>
      </div>
      <Row
        label="New rent / week"
        value={formatMoney(brief.rent.geometric_mean_weekly ?? brief.rent.value)}
        delta={brief.rent.yoy_pct}
        kind="cost"
      />
      <Row
        label="Earnings YoY"
        value={formatPct(brief.earnings.yoy_pct)}
        delta={brief.earnings.yoy_pct}
        kind="wage"
      />
      <Row
        label="Food prices YoY"
        value={formatPct(brief.inflation.food.yoy_pct)}
        delta={brief.inflation.food.yoy_pct}
        kind="cost"
      />
      <Row
        label="Rent inflation YoY"
        value={formatPct(brief.inflation.rent_rpi.yoy_pct)}
        delta={brief.inflation.rent_rpi.yoy_pct}
        kind="cost"
      />
      <div
        className={`rounded-[var(--radius-sub)] border border-[var(--border)] p-2 ${pressureClass(
          affordabilityPressure(rentShare),
        )}`}
      >
        <p className="text-xs text-[var(--text-muted)]">Rent share of weekly earnings</p>
        <p className="pressure-value mt-1 text-lg font-semibold">
          {rentShare != null ? `${rentShare}%` : "—"}
        </p>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  delta,
  kind = "cost",
}: {
  label: string;
  value: string;
  delta?: number | null;
  kind?: DeltaKind;
}) {
  return (
    <div className="border-t border-[var(--border)] pt-2">
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <strong className="text-lg text-[var(--ironsand)]">{value}</strong>
        {delta != null ? <DeltaChip value={delta} kind={kind} /> : null}
      </div>
    </div>
  );
}

export function CompareClient({
  areas,
  briefs,
}: {
  areas: AreaIndex[];
  briefs: Record<string, AreaBrief>;
  geography: GeographyBaselines;
}) {
  const sorted = useMemo(
    () => [...areas].sort((a, b) => a.name.localeCompare(b.name)),
    [areas],
  );
  const [left, setLeft] = useState(sorted[0]?.slug || "");
  const [right, setRight] = useState(sorted[1]?.slug || sorted[0]?.slug || "");

  const selectClass =
    "min-h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--cloud)] px-3 text-base text-[var(--ironsand)] focus:outline-none focus:ring-2 focus:ring-[var(--kowhai)]";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-[var(--ironsand)]">District A</span>
          <select className={selectClass} value={left} onChange={(e) => setLeft(e.target.value)}>
            {sorted.map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.display_name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-[var(--ironsand)]">District B</span>
          <select className={selectClass} value={right} onChange={(e) => setRight(e.target.value)}>
            {sorted.map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.display_name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Column brief={briefs[left] || null} />
        <Column brief={briefs[right] || null} />
      </div>
    </div>
  );
}
