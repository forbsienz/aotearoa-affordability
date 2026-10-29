import { NextResponse } from "next/server";

/** Address → meshblock → TA resolve stub for later geocoder integration. */
export async function GET() {
  return NextResponse.json(
    {
      error: "Address resolve not configured",
      hint: "Use /area/{ta-slug} from the picker until Addressfinder is wired.",
    },
    { status: 501 },
  );
}
