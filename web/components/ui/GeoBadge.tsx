import { grainLabel } from "@/lib/format/metrics";

export function GeoBadge({
  grain,
  label,
}: {
  grain: string;
  label?: string;
}) {
  return (
    <span className="geo-badge" title={label || grainLabel(grain)}>
      {label || grainLabel(grain)}
    </span>
  );
}
