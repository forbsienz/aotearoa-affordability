from __future__ import annotations


def rent_confidence(bond_count: int | float | None, min_count: int) -> str:
    if bond_count is None or (isinstance(bond_count, float) and bond_count != bond_count):
        return "low"
    n = int(bond_count)
    if n >= min_count * 3:
        return "high"
    if n >= min_count:
        return "medium"
    return "low"


def ratio_reliable(population: int | float | None, min_pop: int) -> bool:
    if population is None:
        return False
    return int(population) >= min_pop
