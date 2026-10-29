from __future__ import annotations

import json
import math
from pathlib import Path
from typing import Any


def _clean(obj: Any) -> Any:
    if isinstance(obj, float) and (math.isnan(obj) or math.isinf(obj)):
        return None
    if isinstance(obj, dict):
        return {k: _clean(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_clean(v) for v in obj]
    return obj


def _write(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        json.dump(_clean(payload), f, indent=2, allow_nan=False)
        f.write("\n")


def export_split(bundle: dict[str, Any], web_data: Path) -> None:
    web_data.mkdir(parents=True, exist_ok=True)
    briefs_dir = web_data / "briefs"
    briefs_dir.mkdir(parents=True, exist_ok=True)

    _write(web_data / "meta.json", bundle["meta"])
    _write(web_data / "areas.json", bundle["areas"])
    _write(web_data / "national.json", bundle["national"])
    _write(web_data / "geography.json", bundle["geography"])

    # Clear old briefs
    for old in briefs_dir.glob("*.json"):
        old.unlink()

    for brief in bundle["briefs"]:
        _write(briefs_dir / f"{brief['slug']}.json", brief)
