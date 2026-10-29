import { NextResponse } from "next/server";

/**
 * Address autocomplete stub. Wire Addressfinder (or similar) with
 * ADDRESSFINDER_KEY / ADDRESSFINDER_SECRET when available.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();
  if (q.length < 3) {
    return NextResponse.json({ results: [] });
  }
  return NextResponse.json({
    results: [],
    message:
      "Address search is not configured yet. Use the island → region → district picker, or set ADDRESSFINDER credentials.",
  });
}
