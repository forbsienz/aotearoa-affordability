#!/usr/bin/env python3
"""Write realistic fixture CSVs into data/raw for local builds."""

from __future__ import annotations

import sys
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "src"))

from aotearoa_affordability.config import load_config  # noqa: E402


def main() -> None:
    cfg = load_config()
    raw: Path = cfg["_paths"]["raw"]
    (raw / "mbie").mkdir(parents=True, exist_ok=True)
    (raw / "stats_nz").mkdir(parents=True, exist_ok=True)
    (raw / "hud").mkdir(parents=True, exist_ok=True)
    (raw / "rbnz").mkdir(parents=True, exist_ok=True)

    rent = pd.DataFrame(
        [
            {
                "slug": "wellington-city",
                "period": "2025-09",
                "geometric_mean_weekly": 620,
                "prior_geometric_mean_weekly": 595,
                "bond_count": 410,
            },
            {
                "slug": "palmerston-north-city",
                "period": "2025-09",
                "geometric_mean_weekly": 480,
                "prior_geometric_mean_weekly": 455,
                "bond_count": 180,
            },
            {
                "slug": "christchurch-city",
                "period": "2025-09",
                "geometric_mean_weekly": 510,
                "prior_geometric_mean_weekly": 490,
                "bond_count": 520,
            },
            {
                "slug": "auckland",
                "period": "2025-09",
                "geometric_mean_weekly": 680,
                "prior_geometric_mean_weekly": 670,
                "bond_count": 2100,
            },
        ]
    )
    rent.to_csv(raw / "mbie" / "rental_bond_ta_2025-09.csv", index=False)

    earnings = pd.DataFrame(
        [
            {
                "slug": "wellington-city",
                "period": "2025-Q2",
                "median_quarterly_earnings": 19500,
                "prior_median_quarterly_earnings": 18600,
            },
            {
                "slug": "palmerston-north-city",
                "period": "2025-Q2",
                "median_quarterly_earnings": 16200,
                "prior_median_quarterly_earnings": 15600,
            },
            {
                "slug": "christchurch-city",
                "period": "2025-Q2",
                "median_quarterly_earnings": 17100,
                "prior_median_quarterly_earnings": 16500,
            },
            {
                "slug": "auckland",
                "period": "2025-Q2",
                "median_quarterly_earnings": 18800,
                "prior_median_quarterly_earnings": 18200,
            },
        ]
    )
    earnings.to_csv(raw / "stats_nz" / "leed_ta_earnings.csv", index=False)

    pd.DataFrame(
        [{"period": "2025-Q3", "yoy_pct": 2.7}, {"period": "2025-Q2", "yoy_pct": 2.9}]
    ).to_csv(raw / "stats_nz" / "cpi_all_groups.csv", index=False)

    rpi_rows = []
    fpi_rows = []
    for region, rpi_yoy, fpi_yoy in [
        ("Auckland", 3.1, 2.4),
        ("Wellington", 2.8, 2.6),
        ("Rest of North Island", 3.4, 2.9),
        ("Canterbury", 2.5, 2.2),
        ("Rest of South Island", 2.9, 2.5),
    ]:
        rpi_rows.append({"cpi_region": region, "period": "2025-09", "yoy_pct": rpi_yoy})
        fpi_rows.append({"cpi_region": region, "period": "2025-09", "yoy_pct": fpi_yoy})
    pd.DataFrame(rpi_rows).to_csv(raw / "stats_nz" / "rpi_flow_regions.csv", index=False)
    pd.DataFrame(fpi_rows).to_csv(raw / "stats_nz" / "fpi_regions.csv", index=False)

    pd.DataFrame(
        [
            {
                "period": "2025-09",
                "petrol_yoy_pct": -1.2,
                "electricity_yoy_pct": 4.8,
            }
        ]
    ).to_csv(raw / "stats_nz" / "spi_selected.csv", index=False)

    census_rows = []
    sa2_samples = {
        "wellington-city": ("te-aro", "Te Aro"),
        "palmerston-north-city": ("hokowhitu", "Hokowhitu"),
        "christchurch-city": ("riccarton", "Riccarton"),
        "auckland": ("grey-lynn", "Grey Lynn"),
    }
    base = {
        "wellington-city": (215000, 62000, 118000, 520),
        "palmerston-north-city": (90000, 48000, 92000, 400),
        "christchurch-city": (390000, 51000, 99000, 430),
        "auckland": (1700000, 55000, 110000, 550),
    }
    ta_meta = {t["slug"]: t for t in cfg["pilot_tas"]}
    for slug, (pop, personal, household, rent_paid) in base.items():
        ta = ta_meta[slug]
        sa2_slug, sa2_name = sa2_samples[slug]
        census_rows.append(
            {
                "slug": slug,
                "ta_name": ta["name"],
                "region_slug": ta["region_slug"],
                "region_name": ta["region_name"],
                "island": ta["island"],
                "cpi_region": ta["cpi_region"],
                "population": pop,
                "median_personal_income": personal,
                "median_household_income": household,
                "median_rent_paid_weekly": rent_paid,
                "sa2_slug": f"{sa2_slug}-{slug}",
                "sa2_name": sa2_name,
            }
        )
    pd.DataFrame(census_rows).to_csv(
        raw / "stats_nz" / "census_2023_income_ta.csv", index=False
    )

    commute = pd.DataFrame(
        [
            {
                "slug": "wellington-city",
                "drive": 38,
                "public_transport": 28,
                "walk_or_cycle": 18,
                "work_from_home": 12,
                "other": 4,
            },
            {
                "slug": "palmerston-north-city",
                "drive": 72,
                "public_transport": 4,
                "walk_or_cycle": 10,
                "work_from_home": 10,
                "other": 4,
            },
            {
                "slug": "christchurch-city",
                "drive": 68,
                "public_transport": 6,
                "walk_or_cycle": 12,
                "work_from_home": 10,
                "other": 4,
            },
            {
                "slug": "auckland",
                "drive": 64,
                "public_transport": 12,
                "walk_or_cycle": 8,
                "work_from_home": 12,
                "other": 4,
            },
        ]
    )
    commute.to_csv(raw / "stats_nz" / "census_2023_commute_ta.csv", index=False)

    hpi = pd.DataFrame(
        [
            {
                "slug": "wellington-city",
                "period": "2025-08",
                "median_sale_price": 820000,
                "hpi_yoy_pct": -1.5,
            },
            {
                "slug": "palmerston-north-city",
                "period": "2025-08",
                "median_sale_price": 580000,
                "hpi_yoy_pct": 0.8,
            },
            {
                "slug": "christchurch-city",
                "period": "2025-08",
                "median_sale_price": 690000,
                "hpi_yoy_pct": 1.2,
            },
            {
                "slug": "auckland",
                "period": "2025-08",
                "median_sale_price": 980000,
                "hpi_yoy_pct": -2.1,
            },
        ]
    )
    hpi.to_csv(raw / "hud" / "mcert_hpi_ta.csv", index=False)

    pd.DataFrame(
        [{"period": "2025-09", "floating_rate_pct": 5.85}]
    ).to_csv(raw / "rbnz" / "mortgage_floating.csv", index=False)

    # Point HUD glob at CSV via symlink-friendly name in yaml — also write xlsx-less path
    # Update download glob companion: fixtures use csv; loaders already fall back.
    print(f"Wrote fixtures under {raw}")


if __name__ == "__main__":
    main()
