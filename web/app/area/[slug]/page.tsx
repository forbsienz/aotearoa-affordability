import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AreaBriefContent } from "@/components/area/AreaBriefContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBrief, getMeta, getNational } from "@/lib/data";
import { absoluteUrl } from "@/lib/site";
import { isSafeSlug } from "@/lib/safeSlug";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brief = await getBrief(slug);
  if (!brief) return { title: "Place not found" };
  return {
    title: brief.display_name,
    description: brief.comparison_narrative.hero,
    alternates: { canonical: `/area/${brief.slug}` },
  };
}

export default async function AreaPage({ params }: Props) {
  const { slug } = await params;
  if (!isSafeSlug(slug)) notFound();

  const [brief, meta, national] = await Promise.all([
    getBrief(slug),
    getMeta(),
    getNational(),
  ]);
  if (!brief) notFound();

  const datasetLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${brief.display_name} affordability brief`,
    description: brief.comparison_narrative.hero,
    url: absoluteUrl(`/area/${brief.slug}`),
    creator: { "@type": "Organization", name: "Aotearoa Affordability" },
  };

  return (
    <>
      <JsonLd data={datasetLd} />
      <AreaBriefContent brief={brief} meta={meta} national={national} />
    </>
  );
}
