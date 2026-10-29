import Link from "next/link";
import { AreaPicker } from "@/components/location/AreaPicker";
import { DataFreshnessBanner } from "@/components/transparency/DataFreshnessBanner";
import { getAreas, getMeta } from "@/lib/data";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export default async function HomePage() {
  const [meta, areas] = await Promise.all([getMeta(), getAreas()]);
  const tas = areas.filter((a) => a.grain === "ta" && a.has_brief);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[var(--radius-card)] bg-[var(--bg-hero)] px-5 py-10 text-[var(--text-on-dark)] sm:px-8 sm:py-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(circle at 80% 20%, #1a6b75 0%, transparent 45%), radial-gradient(circle at 10% 90%, #2a4a5c 0%, transparent 40%)",
          }}
        />
        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text-on-dark-muted)]">
            Open data · Aotearoa
          </p>
          <h1 className="mt-3 max-w-xl text-4xl sm:text-5xl">{SITE_NAME}</h1>
          <p className="mt-4 max-w-lg text-lg text-[var(--text-on-dark-muted)]">{SITE_TAGLINE}</p>
          <p className="mt-3 max-w-lg text-sm text-[var(--text-on-dark-muted)]">
            Pick a city or district to see new rents, workplace earnings, inflation context, and
            housing — each number labelled with its true geography.
          </p>
        </div>
      </section>

      <DataFreshnessBanner meta={meta} />

      <section className="card p-4 sm:p-6">
        <h2 className="mb-4 text-2xl">Find your place</h2>
        <AreaPicker areas={areas} />
      </section>

      <section>
        <h2 className="mb-3 text-xl">Pilot districts</h2>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {tas.map((ta) => (
            <li key={ta.slug}>
              <Link
                href={`/area/${ta.slug}`}
                className="card flex min-h-14 items-center justify-between px-4 py-3 transition hover:border-[var(--accent)]"
              >
                <span>
                  <span className="block font-semibold">{ta.display_name}</span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {ta.region_name} · {ta.island}
                  </span>
                </span>
                <span className="text-[var(--accent)]">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
