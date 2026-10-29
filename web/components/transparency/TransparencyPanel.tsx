import type { AreaBrief, Meta } from "@/lib/types";
import { Card } from "@/components/ui/Card";

export function TransparencyPanel({
  brief,
  meta,
}: {
  brief: AreaBrief;
  meta: Meta;
}) {
  return (
    <Card title="Transparency" eyebrow="Read the caveats">
      <ul className="space-y-2 text-sm text-[var(--text-muted)]">
        <li>{meta.disclaimer}</li>
        <li>
          LEED earnings are for jobs <em>based in</em> {brief.display_name} (workplace), not
          necessarily residents&apos; pay.
        </li>
        <li>
          Bond rent reflects typical <em>new</em> tenancies — existing tenants may pay different
          amounts (see Census rent paid).
        </li>
        <li>
          CPI, food, and fuel indexes are national or five broad regions — never suburb-level
          inflation.
        </li>
        <li>
          Illustrative mortgage uses local median sale price × national floating rate at{" "}
          {brief.housing.illustrative_mortgage_weekly.floating_rate_pct ?? "—"}% with an 80% LVR
          assumption. Not a lending offer.
        </li>
        <li>Generated {new Date(meta.generated_at).toLocaleString("en-NZ")}.</li>
      </ul>
    </Card>
  );
}
