#!/usr/bin/env python3
"""
Download or refresh open-data landing files when URLs / API keys are available.

For MVP, this script documents expected paths and copies nothing if fixtures
already exist. Operators place monthly MBIE / Stats NZ / HUD / RBNZ extracts
into data/raw following sources.yaml. Optional ADE / Market Rent API pulls
can be added when STATS_NZ_ADE_SUBSCRIPTION_KEY / MBIE_MARKET_RENT_API_KEY
are set.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "src"))

from aotearoa_affordability.config import load_config  # noqa: E402


def main() -> None:
    cfg = load_config()
    raw: Path = cfg["_paths"]["raw"]
    for sub in ("mbie", "stats_nz", "hud", "rbnz"):
        (raw / sub).mkdir(parents=True, exist_ok=True)

    ade = os.environ.get("STATS_NZ_ADE_SUBSCRIPTION_KEY", "").strip()
    mbie = os.environ.get("MBIE_MARKET_RENT_API_KEY", "").strip()

    rent_csv = list((raw / "mbie").glob("rental_bond_ta*.csv"))
    if not rent_csv:
        print(
            "No MBIE bond CSV found. Run `make fixtures` for sample data, "
            "or download from https://www.tenancy.govt.nz/about-tenancy-services/data-and-statistics/rental-bond-data/"
        )
    else:
        print(f"Found bond file(s): {[p.name for p in rent_csv]}")

    if ade:
        print("STATS_NZ_ADE_SUBSCRIPTION_KEY is set — wire ADE pulls here as datasets are pinned.")
    else:
        print("ADE key not set; expecting manual Stats NZ CSVs under data/raw/stats_nz/")

    if mbie:
        print("MBIE_MARKET_RENT_API_KEY is set — optional Market Rent API enrichment available.")
    else:
        print("Market Rent API key not set; bond CSV geometric means are enough for TA briefs.")

    print("download_sources: landing zone ready.")


if __name__ == "__main__":
    main()
