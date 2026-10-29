import { formatPct } from "@/lib/format/metrics";
import { deltaSentimentClass, type DeltaKind } from "@/lib/format/sentiment";

export function DeltaChip({
  value,
  kind = "cost",
}: {
  value: number | null | undefined;
  kind?: DeltaKind;
}) {
  if (value == null || Number.isNaN(value)) {
    return (
      <span className="delta-flat inline-flex rounded-full px-2 py-0.5 text-xs font-semibold">
        —
      </span>
    );
  }
  const cls = deltaSentimentClass(value, kind);
  return (
    <span className={`${cls} inline-flex rounded-full px-2 py-0.5 text-xs font-semibold`}>
      {formatPct(value)} YoY
    </span>
  );
}
