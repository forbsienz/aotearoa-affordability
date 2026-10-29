import { formatPct } from "@/lib/format/metrics";

export function DeltaChip({ value }: { value: number | null | undefined }) {
  if (value == null || Number.isNaN(value)) {
    return (
      <span className="delta-flat inline-flex rounded-full px-2 py-0.5 text-xs font-semibold">
        —
      </span>
    );
  }
  const cls =
    Math.abs(value) < 0.5 ? "delta-flat" : value > 0 ? "delta-up" : "delta-down";
  return (
    <span className={`${cls} inline-flex rounded-full px-2 py-0.5 text-xs font-semibold`}>
      {formatPct(value)} YoY
    </span>
  );
}
