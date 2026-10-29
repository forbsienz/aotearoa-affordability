# ETL pipeline

## Stages

1. **Land** — CSVs / XLSX under `data/raw/{mbie,stats_nz,hud,rbnz}/`
2. **Load** — `ingest/loaders.py` reads configured globs
3. **Build** — `aggregates/build.py` joins pilot TAs to series, confidence, ratios
4. **Narrate** — `narrative/tone.py` hero sentence
5. **Export** — `export/json_export.py` → `web/public/data/`

## Commands

```bash
make install-pipeline
make fixtures      # sample CSVs + JSON (no API keys)
make pipeline      # download_sources + build (expects raw files / keys)
make test-pipeline
```

## Expected raw files

| Path | Content |
| --- | --- |
| `data/raw/mbie/rental_bond_ta*.csv` | slug, period, geometric_mean_weekly, prior_*, bond_count |
| `data/raw/stats_nz/leed_ta_earnings.csv` | slug, period, median_quarterly_earnings, prior_* |
| `data/raw/stats_nz/cpi_all_groups.csv` | period, yoy_pct |
| `data/raw/stats_nz/rpi_flow_regions.csv` | cpi_region, period, yoy_pct |
| `data/raw/stats_nz/fpi_regions.csv` | cpi_region, period, yoy_pct |
| `data/raw/stats_nz/spi_selected.csv` | period, petrol_yoy_pct, electricity_yoy_pct |
| `data/raw/stats_nz/census_2023_income_ta.csv` | TA + optional SA2 census fields |
| `data/raw/stats_nz/census_2023_commute_ta.csv` | mode shares |
| `data/raw/hud/mcert_hpi*` | slug, period, median_sale_price, hpi_yoy_pct |
| `data/raw/rbnz/mortgage_floating.csv` | period, floating_rate_pct |

Optional live pulls: set `STATS_NZ_ADE_SUBSCRIPTION_KEY` and `MBIE_MARKET_RENT_API_KEY` (see `.env.example`). `download_sources.py` is the hook point for ADE / Market Rent API automation.
