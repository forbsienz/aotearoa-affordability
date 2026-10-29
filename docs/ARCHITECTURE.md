# System architecture

Aotearoa Affordability is a **batch-analytics + static-serving** product: a Python ETL prepares Territorial Authority affordability briefs; a Next.js web application serves them with geography badges, comparisons, and methodology.

> **Not affiliated with Stats NZ, MBIE, HUD, RBNZ, or any government agency.**

```
  Open data (MBIE · Stats NZ · HUD · RBNZ)
                 │
                 ▼
        Python ETL (pipeline/)
        ingest → aggregate → narrative → export
                 │
                 ▼
        web/public/data/*.json
                 │
                 ▼
        Next.js 15 (web/) — mobile-first briefs
```

There is **no application database** and **no user accounts**. Persistence is files: raw landing zone, optional Parquet staging, and CDN-friendly JSON.

## Integration contract

Pipeline and UI share types in `web/lib/types/index.ts`. Each TA brief includes rent, earnings, inflation stack, housing (incl. illustrative mortgage), census income, commute modes, affordability ratios, and a deterministic hero narrative.
