/** Cost rises hurt affordability; wage rises help. */
export type DeltaKind = "cost" | "wage" | "neutral";

export type PressureLevel = "good" | "warn" | "alert" | "flat";

/**
 * Map a YoY delta to a visual sentiment class.
 * - cost: up = negative (Rātā), down = positive (Pounamu)
 * - wage: up = positive, down = negative
 * - neutral: magnitude only, no good/bad
 */
export function deltaSentimentClass(
  value: number | null | undefined,
  kind: DeltaKind = "cost",
): string {
  if (value == null || Number.isNaN(value) || Math.abs(value) < 0.5) {
    return "delta-flat";
  }
  if (kind === "neutral") {
    return value > 0 ? "delta-warn" : "delta-flat";
  }
  const rising = value > 0;
  if (kind === "wage") {
    return rising ? "delta-positive" : "delta-negative";
  }
  // cost
  return rising ? "delta-negative" : "delta-positive";
}

/**
 * Rent / mortgage share of weekly earnings.
 * <30% comfortable, 30–40% tight (Kōwhai), >40% stretched (Rātā).
 */
export function affordabilityPressure(sharePct: number | null | undefined): PressureLevel {
  if (sharePct == null || Number.isNaN(sharePct)) return "flat";
  if (sharePct < 30) return "good";
  if (sharePct <= 40) return "warn";
  return "alert";
}

export function pressureClass(level: PressureLevel): string {
  if (level === "good") return "pressure-good";
  if (level === "warn") return "pressure-warn";
  if (level === "alert") return "pressure-alert";
  return "";
}
