"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AreaIndex } from "@/lib/types";

export function AreaPicker({ areas }: { areas: AreaIndex[] }) {
  const router = useRouter();
  const tas = useMemo(
    () => areas.filter((a) => a.grain === "ta" && a.has_brief).sort((a, b) => a.name.localeCompare(b.name)),
    [areas],
  );

  const islands = useMemo(() => {
    const set = new Set(tas.map((a) => a.island));
    return Array.from(set).sort();
  }, [tas]);

  const [island, setIsland] = useState(islands[0] || "");
  const regions = useMemo(() => {
    const set = new Set(tas.filter((a) => a.island === island).map((a) => a.region_name));
    return Array.from(set).sort();
  }, [tas, island]);
  const [region, setRegion] = useState("");
  const activeRegion = region && regions.includes(region) ? region : regions[0] || "";
  const places = tas.filter((a) => a.island === island && a.region_name === activeRegion);

  const selectClass =
    "min-h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--cloud)] px-3 text-base text-[var(--ironsand)] focus:outline-none focus:ring-2 focus:ring-[var(--kowhai)]";

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Island</span>
        <select
          className={selectClass}
          value={island}
          onChange={(e) => {
            setIsland(e.target.value);
            setRegion("");
          }}
        >
          {islands.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Region</span>
        <select
          className={selectClass}
          value={activeRegion}
          onChange={(e) => setRegion(e.target.value)}
        >
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">City / district</span>
        <select
          className={selectClass}
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) router.push(`/area/${e.target.value}`);
          }}
        >
          <option value="" disabled>
            Choose a place…
          </option>
          {places.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.display_name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
