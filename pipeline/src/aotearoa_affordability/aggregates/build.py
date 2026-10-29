from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

import pandas as pd

from aotearoa_affordability.aggregates.confidence import ratio_reliable, rent_confidence
from aotearoa_affordability.narrative.tone import hero_narrative


def _row_for(df: pd.DataFrame, slug: str) -> dict[str, Any]:
    if df.empty or "slug" not in df.columns:
        return {}
    hit = df.loc[df["slug"] == slug]
    if hit.empty:
        return {}
    return hit.iloc[0].to_dict()


def _yoy(current: float | None, prior: float | None) -> float | None:
    if current is None or prior is None or prior == 0:
        return None
    return round(((current - prior) / prior) * 100, 1)


def _metric(
    *,
    value: float | None,
    unit: str,
    geography: str,
    geography_label: str,
    period: str,
    source: str,
    yoy_pct: float | None = None,
    confidence: str = "medium",
    note: str | None = None,
    extra: dict[str, Any] | None = None,
) -> dict[str, Any]:
    out: dict[str, Any] = {
        "value": value,
        "unit": unit,
        "geography": geography,
        "geography_label": geography_label,
        "period": period,
        "source": source,
        "yoy_pct": yoy_pct,
        "confidence": confidence,
    }
    if note:
        out["note"] = note
    if extra:
        out.update(extra)
    return out


def _national_from(sources: dict[str, pd.DataFrame]) -> dict[str, Any]:
    cpi = sources["cpi"]
    spi = sources["spi"]
    mortgage = sources["mortgage"]

    cpi_yoy = None
    cpi_period = None
    if not cpi.empty:
        latest = cpi.sort_values("period").iloc[-1]
        cpi_yoy = float(latest["yoy_pct"]) if pd.notna(latest.get("yoy_pct")) else None
        cpi_period = str(latest["period"])

    floating = None
    mort_period = None
    if not mortgage.empty:
        latest_m = mortgage.sort_values("period").iloc[-1]
        floating = float(latest_m["floating_rate_pct"])
        mort_period = str(latest_m["period"])

    fuel_yoy = elec_yoy = None
    spi_period = None
    if not spi.empty:
        latest_s = spi.sort_values("period").iloc[-1]
        fuel_yoy = float(latest_s["petrol_yoy_pct"]) if pd.notna(latest_s.get("petrol_yoy_pct")) else None
        elec_yoy = (
            float(latest_s["electricity_yoy_pct"])
            if pd.notna(latest_s.get("electricity_yoy_pct"))
            else None
        )
        spi_period = str(latest_s["period"])

    return {
        "cpi_all_groups": _metric(
            value=cpi_yoy,
            unit="yoy_pct",
            geography="national",
            geography_label="New Zealand",
            period=cpi_period or "n/a",
            source="Stats NZ CPI",
            yoy_pct=cpi_yoy,
        ),
        "petrol": _metric(
            value=fuel_yoy,
            unit="yoy_pct",
            geography="national",
            geography_label="New Zealand",
            period=spi_period or "n/a",
            source="Stats NZ Selected Price Indexes",
            yoy_pct=fuel_yoy,
        ),
        "electricity": _metric(
            value=elec_yoy,
            unit="yoy_pct",
            geography="national",
            geography_label="New Zealand",
            period=spi_period or "n/a",
            source="Stats NZ Selected Price Indexes",
            yoy_pct=elec_yoy,
        ),
        "mortgage_floating_rate_pct": floating,
        "mortgage_rate_period": mort_period,
    }


def _build_ta_brief(
    ta: dict[str, Any],
    sources: dict[str, pd.DataFrame],
    national: dict[str, Any],
    cfg: dict[str, Any],
) -> dict[str, Any]:
    slug = ta["slug"]
    rent_row = _row_for(sources["rent"], slug)
    earn_row = _row_for(sources["earnings"], slug)
    hpi_row = _row_for(sources["hpi"], slug)
    census_row = _row_for(sources["census"], slug)
    commute_row = _row_for(sources["commute"], slug)

    rpi = sources["rpi"]
    fpi = sources["fpi"]
    cpi_region = ta["cpi_region"]
    rpi_row = {}
    fpi_row = {}
    if not rpi.empty:
        hit = rpi.loc[rpi["cpi_region"] == cpi_region]
        if not hit.empty:
            rpi_row = hit.sort_values("period").iloc[-1].to_dict()
    if not fpi.empty:
        hit = fpi.loc[fpi["cpi_region"] == cpi_region]
        if not hit.empty:
            fpi_row = hit.sort_values("period").iloc[-1].to_dict()

    bond_count = rent_row.get("bond_count")
    rent_conf = rent_confidence(
        bond_count, cfg["confidence"]["min_bond_count_for_rent"]
    )
    pop = int(census_row.get("population") or ta.get("population") or 0)

    rent_gm = rent_row.get("geometric_mean_weekly")
    rent_prior = rent_row.get("prior_geometric_mean_weekly")
    rent_yoy = _yoy(
        float(rent_gm) if rent_gm == rent_gm and rent_gm is not None else None,
        float(rent_prior) if rent_prior == rent_prior and rent_prior is not None else None,
    )

    earn_med = earn_row.get("median_quarterly_earnings")
    earn_prior = earn_row.get("prior_median_quarterly_earnings")
    earn_yoy = _yoy(
        float(earn_med) if earn_med == earn_med and earn_med is not None else None,
        float(earn_prior) if earn_prior == earn_prior and earn_prior is not None else None,
    )
    # Approximate weekly earnings from quarterly median
    weekly_earn = None
    if earn_med == earn_med and earn_med is not None:
        weekly_earn = float(earn_med) / 13.0

    median_price = hpi_row.get("median_sale_price")
    hpi_yoy = hpi_row.get("hpi_yoy_pct")
    floating = national.get("mortgage_floating_rate_pct")
    illus_weekly = None
    if (
        median_price == median_price
        and median_price is not None
        and floating is not None
    ):
        # Illustrative interest-only weekly cost on 80% LVR — not a lending offer
        principal = float(median_price) * 0.8
        annual_interest = principal * (float(floating) / 100.0)
        illus_weekly = round(annual_interest / 52.0, 0)

    rent_share = None
    mort_share = None
    if weekly_earn and rent_gm == rent_gm and rent_gm is not None and weekly_earn > 0:
        rent_share = round((float(rent_gm) / weekly_earn) * 100, 1)
    if weekly_earn and illus_weekly and weekly_earn > 0:
        mort_share = round((float(illus_weekly) / weekly_earn) * 100, 1)

    modes = {}
    if commute_row:
        for key in ("drive", "public_transport", "walk_or_cycle", "work_from_home", "other"):
            if key in commute_row and pd.notna(commute_row[key]):
                modes[key] = float(commute_row[key])

    brief: dict[str, Any] = {
        "slug": slug,
        "display_name": ta["name"],
        "grain": "ta",
        "geography": {
            "ta_slug": slug,
            "ta_name": ta["name"],
            "region_slug": ta["region_slug"],
            "region_name": ta["region_name"],
            "island": ta["island"],
            "cpi_region": cpi_region,
            "population": pop,
        },
        "ratio_comparison_reliable": ratio_reliable(
            pop, cfg["confidence"]["min_population_for_ratio"]
        ),
        "rent": {
            **_metric(
                value=float(rent_gm) if rent_gm == rent_gm and rent_gm is not None else None,
                unit="nzd_per_week",
                geography="ta",
                geography_label=ta["name"],
                period=str(rent_row.get("period") or "n/a"),
                source="MBIE Tenancy Services rental bond data",
                yoy_pct=rent_yoy,
                confidence=rent_conf,
                note="Typical new tenancy rent (geometric mean), not all tenants.",
                extra={"bond_count": int(bond_count) if bond_count == bond_count and bond_count is not None else None},
            ),
            "geometric_mean_weekly": float(rent_gm)
            if rent_gm == rent_gm and rent_gm is not None
            else None,
        },
        "earnings": {
            **_metric(
                value=float(earn_med) if earn_med == earn_med and earn_med is not None else None,
                unit="nzd_per_quarter",
                geography="ta",
                geography_label=ta["name"],
                period=str(earn_row.get("period") or "n/a"),
                source="Stats NZ LEED (workplace)",
                yoy_pct=earn_yoy,
                confidence="medium",
                note="Median earnings for continuing jobs based in this district — not resident pay.",
                extra={
                    "approx_weekly": round(weekly_earn, 0) if weekly_earn else None,
                },
            ),
            "median_quarterly_earnings": float(earn_med)
            if earn_med == earn_med and earn_med is not None
            else None,
        },
        "inflation": {
            "cpi_national": national["cpi_all_groups"],
            "rent_rpi": _metric(
                value=float(rpi_row["yoy_pct"])
                if rpi_row.get("yoy_pct") == rpi_row.get("yoy_pct") and rpi_row.get("yoy_pct") is not None
                else None,
                unit="yoy_pct",
                geography="cpi_region",
                geography_label=cpi_region,
                period=str(rpi_row.get("period") or "n/a"),
                source="Stats NZ Rental Price Index (flow)",
                yoy_pct=float(rpi_row["yoy_pct"])
                if rpi_row.get("yoy_pct") == rpi_row.get("yoy_pct") and rpi_row.get("yoy_pct") is not None
                else None,
                note="Regional rent price trend — not suburb-level inflation.",
            ),
            "food": _metric(
                value=float(fpi_row["yoy_pct"])
                if fpi_row.get("yoy_pct") == fpi_row.get("yoy_pct") and fpi_row.get("yoy_pct") is not None
                else None,
                unit="yoy_pct",
                geography="cpi_region",
                geography_label=cpi_region,
                period=str(fpi_row.get("period") or "n/a"),
                source="Stats NZ Food Price Index",
                yoy_pct=float(fpi_row["yoy_pct"])
                if fpi_row.get("yoy_pct") == fpi_row.get("yoy_pct") and fpi_row.get("yoy_pct") is not None
                else None,
            ),
            "petrol": national["petrol"],
            "electricity": national["electricity"],
        },
        "housing": {
            "median_sale_price": _metric(
                value=float(median_price)
                if median_price == median_price and median_price is not None
                else None,
                unit="nzd",
                geography="ta",
                geography_label=ta["name"],
                period=str(hpi_row.get("period") or "n/a"),
                source="HUD MCERT / Property and sales statistics",
                yoy_pct=float(hpi_yoy) if hpi_yoy == hpi_yoy and hpi_yoy is not None else None,
            ),
            "hpi_yoy_pct": float(hpi_yoy) if hpi_yoy == hpi_yoy and hpi_yoy is not None else None,
            "illustrative_mortgage_weekly": _metric(
                value=illus_weekly,
                unit="nzd_per_week",
                geography="ta",
                geography_label=ta["name"],
                period=national.get("mortgage_rate_period") or "n/a",
                source="Illustration: 80% LVR × RBNZ floating rate × local median sale",
                confidence="low",
                note="Not a personalised lending quote. Interest-only illustration only.",
                extra={
                    "floating_rate_pct": floating,
                    "assumed_lvr": 0.8,
                },
            ),
        },
        "census_income": {
            "median_personal_income": _metric(
                value=float(census_row["median_personal_income"])
                if census_row.get("median_personal_income")
                == census_row.get("median_personal_income")
                and census_row.get("median_personal_income") is not None
                else None,
                unit="nzd_per_year",
                geography="ta",
                geography_label=ta["name"],
                period="2023 Census",
                source="Stats NZ 2023 Census",
                note="Resident income baseline — updated after the next census.",
            ),
            "median_household_income": _metric(
                value=float(census_row["median_household_income"])
                if census_row.get("median_household_income")
                == census_row.get("median_household_income")
                and census_row.get("median_household_income") is not None
                else None,
                unit="nzd_per_year",
                geography="ta",
                geography_label=ta["name"],
                period="2023 Census",
                source="Stats NZ 2023 Census",
            ),
            "median_rent_paid_weekly": _metric(
                value=float(census_row["median_rent_paid_weekly"])
                if census_row.get("median_rent_paid_weekly")
                == census_row.get("median_rent_paid_weekly")
                and census_row.get("median_rent_paid_weekly") is not None
                else None,
                unit="nzd_per_week",
                geography="ta",
                geography_label=ta["name"],
                period="2023 Census",
                source="Stats NZ 2023 Census",
                note="Existing tenants' rent paid — differs from new-bond market rent.",
            ),
        },
        "commute": {
            "geography": "ta",
            "geography_label": ta["name"],
            "period": "2023 Census",
            "source": "Stats NZ 2023 Census main means of travel to work",
            "modes_pct": modes,
            "note": "Mode share for people who lived and worked in this area context — not door-to-door travel times.",
        },
        "affordability": {
            "rent_as_pct_of_approx_weekly_earnings": rent_share,
            "illustrative_mortgage_as_pct_of_approx_weekly_earnings": mort_share,
            "note": "Ratios use workplace LEED earnings approximated to weekly. Interpret cautiously.",
        },
        "vs_national": {
            "rent_ratio": None,
            "earnings_growth_vs_cpi": None,
        },
        "comparison_narrative": {"hero": ""},
    }

    # National rent comparison when available
    nat_rent = sources["rent"]
    if not nat_rent.empty and "geometric_mean_weekly" in nat_rent.columns and rent_gm == rent_gm:
        nat_mean = float(nat_rent["geometric_mean_weekly"].mean())
        if nat_mean:
            brief["vs_national"]["rent_ratio"] = round(float(rent_gm) / nat_mean, 2)

    if earn_yoy is not None and national["cpi_all_groups"].get("yoy_pct") is not None:
        brief["vs_national"]["earnings_growth_vs_cpi"] = round(
            earn_yoy - float(national["cpi_all_groups"]["yoy_pct"]), 1
        )

    brief["comparison_narrative"]["hero"] = hero_narrative(brief)
    return brief


def build_all(cfg: dict[str, Any], sources: dict[str, pd.DataFrame]) -> dict[str, Any]:
    national = _national_from(sources)
    briefs = []
    for ta in cfg["pilot_tas"]:
        briefs.append(_build_ta_brief(ta, sources, national, cfg))

    areas = []
    for b in briefs:
        g = b["geography"]
        areas.append(
            {
                "slug": b["slug"],
                "name": b["display_name"],
                "display_name": b["display_name"],
                "grain": "ta",
                "ta_slug": g["ta_slug"],
                "ta_name": g["ta_name"],
                "region_slug": g["region_slug"],
                "region_name": g["region_name"],
                "island": g["island"],
                "cpi_region": g["cpi_region"],
                "population": g["population"],
                "has_brief": True,
            }
        )

    # Sample SA2 rows under each TA for picker hierarchy (from census if tagged)
    census = sources["census"]
    if not census.empty and "sa2_slug" in census.columns:
        for _, row in census.dropna(subset=["sa2_slug"]).iterrows():
            areas.append(
                {
                    "slug": row["sa2_slug"],
                    "name": row.get("sa2_name") or row["sa2_slug"],
                    "display_name": f"{row.get('sa2_name')}, {row.get('ta_name')}",
                    "grain": "sa2",
                    "ta_slug": row["slug"],
                    "ta_name": row.get("ta_name"),
                    "region_slug": row.get("region_slug"),
                    "region_name": row.get("region_name"),
                    "island": row.get("island"),
                    "cpi_region": row.get("cpi_region"),
                    "population": int(row["population"]) if pd.notna(row.get("population")) else 0,
                    "has_brief": False,
                    "parent_ta_brief": row["slug"],
                }
            )

    geography = {
        "territorial_authorities": {
            b["slug"]: {
                "slug": b["slug"],
                "name": b["display_name"],
                "region_slug": b["geography"]["region_slug"],
                "island": b["geography"]["island"],
                "cpi_region": b["geography"]["cpi_region"],
                "rent_weekly": (b.get("rent") or {}).get("geometric_mean_weekly"),
                "earnings_yoy_pct": (b.get("earnings") or {}).get("yoy_pct"),
            }
            for b in briefs
        },
        "regions": {},
        "islands": {
            "north-island": {"slug": "north-island", "name": "North Island"},
            "south-island": {"slug": "south-island", "name": "South Island"},
        },
        "cpi_regions": cfg["cpi_regions"],
    }

    for b in briefs:
        rs = b["geography"]["region_slug"]
        if rs not in geography["regions"]:
            geography["regions"][rs] = {
                "slug": rs,
                "name": b["geography"]["region_name"],
                "island": b["geography"]["island"],
            }

    periods = []
    for frame in sources.values():
        if isinstance(frame, pd.DataFrame) and not frame.empty and "period" in frame.columns:
            periods.extend(frame["period"].astype(str).tolist())
    data_through = max(periods) if periods else datetime.now(timezone.utc).strftime("%Y-%m")

    meta = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "pipeline_version": cfg["pipeline_version"],
        "data_through": data_through,
        "product": "Aotearoa Affordability",
        "disclaimer": "Not affiliated with Stats NZ, MBIE, HUD, RBNZ, or any government agency.",
        "geography_note": "Live wage and rent trends are TA-level. CPI/HLPI are national or five broad regions. Census income is a static 2023 baseline.",
    }

    return {
        "meta": meta,
        "areas": areas,
        "national": national,
        "geography": geography,
        "briefs": briefs,
    }
