from __future__ import annotations

from typing import Any


def _pct(value: float | None) -> str:
    if value is None:
        return "unavailable"
    sign = "+" if value > 0 else ""
    return f"{sign}{value:.1f}%"


def hero_narrative(brief: dict[str, Any]) -> str:
    """Deterministic, calm hero copy. Inform, do not alarm."""
    name = brief["display_name"]
    rent = brief.get("rent") or {}
    earnings = brief.get("earnings") or {}
    inflation = brief.get("inflation") or {}

    rent_delta = rent.get("yoy_pct")
    earn_delta = earnings.get("yoy_pct")
    food = (inflation.get("food") or {}).get("yoy_pct")
    cpi_region = (inflation.get("rent_rpi") or {}).get("geography_label") or "your region"

    parts = [f"In {name}, "]
    if rent.get("geometric_mean_weekly") is not None:
        parts.append(
            f"typical new tenancy rent is about ${rent['geometric_mean_weekly']:.0f}/week"
        )
        if rent_delta is not None:
            parts.append(f" ({_pct(rent_delta)} year on year)")
        parts.append(". ")
    else:
        parts.append("new tenancy rent data is limited. ")

    if earn_delta is not None:
        parts.append(
            f"Workplace median earnings moved {_pct(earn_delta)} over the same kind of period"
        )
        if food is not None:
            parts.append(
                f", while food prices in {cpi_region} were {_pct(food)} year on year"
            )
        parts.append(".")
    elif food is not None:
        parts.append(f"Food prices in {cpi_region} were {_pct(food)} year on year.")
    else:
        parts.append("Wage and inflation comparisons will appear as more series load.")

    text = "".join(parts)
    return text[:320]
