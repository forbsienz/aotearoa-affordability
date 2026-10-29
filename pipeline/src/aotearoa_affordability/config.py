from __future__ import annotations

from pathlib import Path
from typing import Any

import yaml

PACKAGE_ROOT = Path(__file__).resolve().parents[2]
CONFIG_PATH = PACKAGE_ROOT / "config" / "sources.yaml"


def load_config(path: Path | None = None) -> dict[str, Any]:
    cfg_path = path or CONFIG_PATH
    with cfg_path.open(encoding="utf-8") as f:
        cfg = yaml.safe_load(f)

    # sources.yaml paths.repo_root is relative to the pipeline/ package root
    repo_root = (PACKAGE_ROOT / cfg["paths"]["repo_root"]).resolve()
    cfg["_paths"] = {
        "repo_root": repo_root,
        "raw": (repo_root / "data" / "raw").resolve(),
        "processed": (repo_root / "data" / "processed").resolve(),
        "web_data": (repo_root / "web" / "public" / "data").resolve(),
        "config": cfg_path.parent.resolve(),
    }
    return cfg
