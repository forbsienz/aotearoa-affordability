import type { AreaBrief, Meta, NationalBaseline } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { MetricTile } from "@/components/ui/MetricTile";
import { DeltaChip } from "@/components/ui/DeltaChip";
import { GeoBadge } from "@/components/ui/GeoBadge";
import { TransparencyPanel } from "@/components/transparency/TransparencyPanel";
import { formatPct } from "@/lib/format/metrics";
import { affordabilityPressure, pressureClass } from "@/lib/format/sentiment";
import Link from "next/link";

const MODE_LABELS: Record<string, string> = {
  drive: "Drive",
  public_transport: "Public transport",
  walk_or_cycle: "Walk or cycle",
  work_from_home: "Work from home",
  other: "Other",
};

function PressureCard({
  label,
  valuePct,
  note,
}: {
  label: string;
  valuePct: number | null;
  note: string;
}) {
  const level = affordabilityPressure(valuePct);
  return (
    <div
      className={`rounded-[var(--radius-sub)] border bg-[var(--bg-strip)] p-3 ${pressureClass(level)}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </p>
      <p className="pressure-value mt-1 font-[family-name:var(--font-display)] text-3xl">
        {valuePct != null ? `${valuePct}%` : "—"}
      </p>
      <p className="mt-1 text-xs text-[var(--text-muted)]">{note}</p>
    </div>
  );
}

export function AreaBriefContent({
  brief,
  meta,
  national,
}: {
  brief: AreaBrief;
  meta: Meta;
  national: NationalBaseline;
}) {
  const modes = Object.entries(brief.commute.modes_pct || {});

  return (
    <div className="space-y-6">
      <header className="overflow-hidden rounded-[var(--radius-card)] bg-[var(--bg-hero)] px-4 py-6 text-[var(--text-on-dark)] sm:px-6 sm:py-8">
        <Link
          href="/"
          className="text-sm text-[var(--text-on-dark-muted)] underline-offset-2 hover:text-[var(--kowhai)] hover:underline"
        >
          ← All places
        </Link>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-[var(--kowhai)]">
          {brief.geography.region_name} · {brief.geography.island}
        </p>
        <h1 className="mt-1 text-3xl text-[var(--cloud)] sm:text-4xl">{brief.display_name}</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--text-on-dark-muted)] sm:text-lg">
          {brief.comparison_narrative.hero}
        </p>
        <p className="mt-3 text-xs text-[var(--text-on-dark-muted)]">
          Data through {meta.data_through}
        </p>
      </header>

      <Card title="Affordability snapshot" eyebrow="Rent and earnings">
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <PressureCard
            label="New rent vs approx weekly earnings"
            valuePct={brief.affordability.rent_as_pct_of_approx_weekly_earnings}
            note={brief.affordability.note}
          />
          <PressureCard
            label="Illustrative mortgage vs earnings"
            valuePct={
              brief.affordability.illustrative_mortgage_as_pct_of_approx_weekly_earnings
            }
            note="Interest-only illustration — not a lending quote. Under 30% more comfortable; 30–40% tight; over 40% stretched."
          />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <MetricTile metric={brief.rent} title="New tenancy rent" kind="cost" />
          <MetricTile
            metric={brief.earnings}
            title="Workplace median earnings"
            kind="wage"
            highlight
          />
        </div>
      </Card>

      <Card title="Price pressure" eyebrow="Inflation context">
        <p className="mb-3 text-sm text-[var(--text-muted)]">
          Local prices move with national and regional indexes — never a suburb CPI. Rising costs
          show in Rātā; easing costs in Pounamu.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <MetricTile metric={brief.inflation.cpi_national} title="CPI (all groups)" kind="cost" />
          <MetricTile
            metric={brief.inflation.rent_rpi}
            title="Rent inflation (RPI flow)"
            kind="cost"
          />
          <MetricTile metric={brief.inflation.food} title="Food prices" kind="cost" />
          <MetricTile metric={brief.inflation.petrol} title="Petrol" kind="cost" />
          <MetricTile
            metric={brief.inflation.electricity}
            title="Electricity / heating proxy"
            kind="cost"
          />
        </div>
      </Card>

      <Card title="Housing" eyebrow="Buying and renting">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <MetricTile
            metric={brief.housing.median_sale_price}
            title="Median sale price"
            kind="cost"
          />
          <MetricTile
            metric={brief.housing.illustrative_mortgage_weekly}
            title="Illustrative mortgage"
            kind="cost"
          />
          <MetricTile
            metric={brief.census_income.median_rent_paid_weekly}
            title="Census rent paid"
            kind="cost"
          />
        </div>
      </Card>

      <Card title="Resident income (Census 2023)" eyebrow="Who lives here">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <MetricTile
            metric={brief.census_income.median_personal_income}
            title="Median personal income"
            kind="wage"
          />
          <MetricTile
            metric={brief.census_income.median_household_income}
            title="Median household income"
            kind="wage"
          />
        </div>
      </Card>

      <Card title="Getting to work" eyebrow="Commute modes">
        <div className="mb-2 flex flex-wrap gap-2">
          <GeoBadge grain="ta" label={brief.commute.geography_label} />
          <span className="text-xs text-[var(--text-muted)]">{brief.commute.period}</span>
        </div>
        <p className="mb-3 text-sm text-[var(--text-muted)]">{brief.commute.note}</p>
        <ul className="space-y-2">
          {modes.map(([key, pct]) => (
            <li key={key}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{MODE_LABELS[key] || key}</span>
                <span className="font-semibold text-[var(--tasman)]">{pct}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-strip)]">
                <div
                  className="h-full rounded-full bg-[var(--tasman)]"
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Compared with New Zealand" eyebrow="Benchmarks">
        <div className="space-y-3 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-[var(--radius-sub)] border border-[var(--border)] bg-[var(--bg-strip)] px-3 py-2">
            <span>Local new rent vs average of pilot TAs</span>
            <strong className="text-[var(--tasman)]">
              {brief.vs_national.rent_ratio != null
                ? `${brief.vs_national.rent_ratio.toFixed(2)}×`
                : "—"}
            </strong>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-[var(--radius-sub)] border border-[var(--border)] bg-[var(--bg-strip)] px-3 py-2">
            <span>Earnings growth minus national CPI</span>
            <DeltaChip value={brief.vs_national.earnings_growth_vs_cpi} kind="wage" />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-[var(--radius-sub)] border border-[var(--border)] bg-[var(--bg-strip)] px-3 py-2">
            <span>National floating mortgage rate</span>
            <strong>
              {national.mortgage_floating_rate_pct != null
                ? formatPct(national.mortgage_floating_rate_pct)
                : "—"}{" "}
              <span className="font-normal text-[var(--text-muted)]">
                ({national.mortgage_rate_period})
              </span>
            </strong>
          </div>
          <Link href="/compare" className="btn-primary mt-1">
            Compare two districts
          </Link>
        </div>
      </Card>

      <TransparencyPanel brief={brief} meta={meta} />
    </div>
  );
}
