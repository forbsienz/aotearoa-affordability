import { promises as fs } from "fs";
import path from "path";
import type {
  AreaBrief,
  AreaIndex,
  GeographyBaselines,
  Meta,
  NationalBaseline,
} from "@/lib/types";
import { isSafeSlug } from "@/lib/safeSlug";

const DATA_ROOT = path.join(process.cwd(), "public", "data");

async function readJson<T>(file: string): Promise<T> {
  const raw = await fs.readFile(path.join(DATA_ROOT, file), "utf-8");
  return JSON.parse(raw) as T;
}

export async function getMeta(): Promise<Meta> {
  return readJson<Meta>("meta.json");
}

export async function getAreas(): Promise<AreaIndex[]> {
  return readJson<AreaIndex[]>("areas.json");
}

export async function getNational(): Promise<NationalBaseline> {
  return readJson<NationalBaseline>("national.json");
}

export async function getGeography(): Promise<GeographyBaselines> {
  return readJson<GeographyBaselines>("geography.json");
}

export async function getBrief(slug: string): Promise<AreaBrief | null> {
  if (!isSafeSlug(slug)) return null;
  try {
    return await readJson<AreaBrief>(`briefs/${slug}.json`);
  } catch {
    return null;
  }
}

export async function getAreasByIsland(): Promise<
  Record<string, { regions: Record<string, AreaIndex[]> }>
> {
  const areas = (await getAreas()).filter((a) => a.grain === "ta" && a.has_brief);
  const out: Record<string, { regions: Record<string, AreaIndex[]> }> = {};
  for (const area of areas) {
    const island = area.island || "New Zealand";
    if (!out[island]) out[island] = { regions: {} };
    if (!out[island].regions[area.region_name]) {
      out[island].regions[area.region_name] = [];
    }
    out[island].regions[area.region_name].push(area);
  }
  return out;
}
