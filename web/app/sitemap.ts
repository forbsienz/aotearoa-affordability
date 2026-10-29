import type { MetadataRoute } from "next";
import { getAreas } from "@/lib/data";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const areas = await getAreas();
  const staticRoutes = ["", "/compare", "/methodology", "/glossary"].map((path) => ({
    url: absoluteUrl(path || "/"),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.6,
  }));
  const areaRoutes = areas
    .filter((a) => a.has_brief)
    .map((a) => ({
      url: absoluteUrl(`/area/${a.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  return [...staticRoutes, ...areaRoutes];
}
