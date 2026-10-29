#!/usr/bin/env python3
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "src"))

from aotearoa_affordability.aggregates.build import build_all  # noqa: E402
from aotearoa_affordability.config import load_config  # noqa: E402
from aotearoa_affordability.export.json_export import export_split  # noqa: E402
from aotearoa_affordability.ingest.loaders import load_all_sources  # noqa: E402


def main() -> None:
    cfg = load_config()
    sources = load_all_sources(cfg)
    # Prefer CSV HPI when xlsx glob misses fixture csv
    if sources["hpi"].empty:
        csv_hpi = cfg["_paths"]["raw"] / "hud" / "mcert_hpi_ta.csv"
        if csv_hpi.exists():
            import pandas as pd

            sources["hpi"] = pd.read_csv(csv_hpi)

    bundle = build_all(cfg, sources)
    export_split(bundle, cfg["_paths"]["web_data"])
    print(
        f"Exported {len(bundle['briefs'])} briefs → {cfg['_paths']['web_data']}"
    )


if __name__ == "__main__":
    main()
