#!/usr/bin/env python3
"""Generate fixtures then build JSON (alias for quick sample serving data)."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent


def main() -> None:
    env = {"PYTHONPATH": str(SCRIPTS.parent / "src")}
    import os

    full_env = {**os.environ, **env}
    subprocess.check_call(
        [sys.executable, str(SCRIPTS / "generate_fixtures.py")], env=full_env
    )
    subprocess.check_call(
        [sys.executable, str(SCRIPTS / "build_aggregates.py")], env=full_env
    )


if __name__ == "__main__":
    main()
