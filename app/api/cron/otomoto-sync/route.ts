import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/service"
import { checkOtomotoListingStatus } from "@/lib/otomoto/scraper"

// Endpoint wywolywany przez Vercel Cron (patrz vercel.json) raz dziennie.
// Sprawdza wszystkie ogloszenia z wypelnionym otomoto_url (poza "sold")
// i synchronizuje status z tym co widac na OtoMoto - w obie strony:
// zniknelo z OtoMoto -> status=inactive, wrocilo -> status=active.

export const maxDuration = 60

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createServiceClient()

  const { data: listings, error } = await supabase
    .from("listings")
    .select("id, otomoto_url, status")
    .not("otomoto_url", "is", null)
    .neq("status", "sold")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const results = {
    checked: 0,
    setInactive: 0,
    setActive: 0,
    unchanged: 0,
    unknown: 0,
    errors: [] as string[],
  }

  for (const listing of listings ?? []) {
    if (!listing.otomoto_url) continue
    results.checked++

    const otoStatus = await checkOtomotoListingStatus(listing.otomoto_url)

    if (otoStatus === "unknown") {
      results.unknown++
      continue
    }

    const shouldBeActive = otoStatus === "active"
    const currentlyActive = listing.status === "active"

    if (shouldBeActive === currentlyActive) {
      results.unchanged++
      continue
    }

    const newStatus = shouldBeActive ? "active" : "inactive"

    const { error: updateError } = await supabase
      .from("listings")
      .update({ status: newStatus as "active" | "inactive" | "sold" })
      .eq("id", listing.id)

    if (updateError) {
      results.errors.push(`${listing.id}: ${updateError.message}`)
      continue
    }

    if (newStatus === "active") {
      results.setActive++
    } else {
      results.setInactive++
    }

    // Male opoznienie miedzy zapytaniami, zeby nie obciazac OtoMoto
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  return NextResponse.json(results)
}
