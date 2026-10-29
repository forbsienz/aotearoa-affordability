from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

from aotearoa_affordability.aggregates.build import build_all
from aotearoa_affordability.config import load_config
from aotearoa_affordability.export.json_export import export_split
from aotearoa_affordability.ingest.loaders import load_all_sources
from aotearoa_affordability.narrative.tone import hero_narrative

PIPELINE = Path(__file__).resolve().parents[1]


def _ensure_fixtures() -> None:
    subprocess.check_call(
        [sys.executable, str(PIPELINE / "scripts" / "generate_fixtures.py")],
        env={**dict(**{k: v for k, v in __import__("os").environ.items()}), "PYTHONPATH": str(PIPELINE / "src")},
    )


def test_fixtures_build(tmp_path: Path):
    _ensure_fixtures()
    cfg = load_config()
    sources = load_all_sources(cfg)
    assert not sources["rent"].empty

    bundle = build_all(cfg, sources)
    assert len(bundle["briefs"]) == 4
    assert bundle["meta"]["product"] == "Aotearoa Affordability"
    wellington = next(b for b in bundle["briefs"] if b["slug"] == "wellington-city")
    assert wellington["rent"]["geometric_mean_weekly"] == 620
    assert wellington["comparison_narrative"]["hero"]
    assert "resident pay" in wellington["earnings"]["note"]

    out = tmp_path / "data"
    export_split(bundle, out)
    assert (out / "meta.json").exists()
    assert (out / "briefs" / "wellington-city.json").exists()
    loaded = json.loads((out / "briefs" / "wellington-city.json").read_text())
    assert loaded["slug"] == "wellington-city"


def test_hero_mentions_place():
    brief = {
        "display_name": "Test City",
        "rent": {"geometric_mean_weekly": 500, "yoy_pct": 2.0},
        "earnings": {"yoy_pct": 3.0},
        "inflation": {"food": {"yoy_pct": 2.5}, "rent_rpi": {"geography_label": "Auckland"}},
    }
    text = hero_narrative(brief)
    assert "Test City" in text
