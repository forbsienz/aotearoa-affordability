from __future__ import annotations

from glob import glob
from pathlib import Path
from typing import Any

import pandas as pd


def _first_glob(raw: Path, pattern: str) -> Path | None:
    matches = sorted(glob(str(raw / pattern)))
    return Path(matches[-1]) if matches else None


def _read_csv(path: Path | None) -> pd.DataFrame:
    if path is None or not path.exists():
        return pd.DataFrame()
    return pd.read_csv(path)


def load_all_sources(cfg: dict[str, Any]) -> dict[str, pd.DataFrame | dict]:
    """Load raw CSVs from data/raw. Empty frames if files missing."""
    raw: Path = cfg["_paths"]["raw"]
    dl = cfg["download"]

    rent = _read_csv(_first_glob(raw, dl["mbie_bond_ta_glob"]))
    earnings = _read_csv(raw / dl["stats_leed_csv"])
    cpi = _read_csv(raw / dl["stats_cpi_csv"])
    rpi = _read_csv(raw / dl["stats_rpi_csv"])
    fpi = _read_csv(raw / dl["stats_fpi_csv"])
    spi = _read_csv(raw / dl["stats_spi_csv"])
    census = _read_csv(raw / dl["stats_census_income_csv"])
    commute = _read_csv(raw / dl["stats_commute_csv"])
    mortgage = _read_csv(raw / dl["rbnz_mortgage_csv"])

    hpi_path = _first_glob(raw, dl["hud_hpi_glob"])
    if hpi_path and hpi_path.suffix.lower() in {".xlsx", ".xls"}:
        hpi = pd.read_excel(hpi_path)
    else:
        hpi = _read_csv(hpi_path) if hpi_path else pd.DataFrame()

    return {
        "rent": rent,
        "earnings": earnings,
        "cpi": cpi,
        "rpi": rpi,
        "fpi": fpi,
        "spi": spi,
        "census": census,
        "commute": commute,
        "mortgage": mortgage,
        "hpi": hpi,
    }
