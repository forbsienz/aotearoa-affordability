import type { Meta } from "@/lib/types";

export function DataFreshnessBanner({ meta }: { meta: Meta }) {
  return (
    <div className="rounded-[var(--radius-sub)] border border-[var(--border)] bg-[var(--bg-strip)] px-3 py-2 text-xs text-[var(--text-muted)]">
      Data through <strong className="text-[var(--text-primary)]">{meta.data_through}</strong>
      {" · "}
      Pipeline {meta.pipeline_version}
      {" · "}
      {meta.geography_note}
    </div>
  );
}
