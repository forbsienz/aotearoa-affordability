import { CompareClient } from "@/components/compare/CompareClient";
import { getAreas, getBrief, getGeography } from "@/lib/data";
import type { AreaBrief } from "@/lib/types";

export const metadata = {
  title: "Compare districts",
  description: "Side-by-side rent, earnings growth, and regional inflation for two NZ districts.",
};

export default async function ComparePage() {
  const [areas, geography] = await Promise.all([getAreas(), getGeography()]);
  const tas = areas.filter((a) => a.grain === "ta" && a.has_brief);
  const briefs: Record<string, AreaBrief> = {};
  await Promise.all(
    tas.map(async (ta) => {
      const b = await getBrief(ta.slug);
      if (b) briefs[ta.slug] = b;
    }),
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl">Compare districts</h1>
        <p className="mt-2 max-w-2xl text-[var(--text-muted)]">
          Pick two Territorial Authorities. Rent and earnings are local; inflation uses each
          place&apos;s CPI region.
        </p>
      </header>
      <CompareClient areas={tas} briefs={briefs} geography={geography} />
    </div>
  );
}
