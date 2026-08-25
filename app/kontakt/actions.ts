"use server"
import { createClient } from "@/lib/supabase/server"

export async function submitContactForm(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get("name") as string
  const phone = formData.get("phone") as string
  const email = formData.get("email") as string
  const nip = formData.get("nip") as string
  const message = formData.get("message") as string
  const slug = formData.get("slug") as string
  const wstepna = formData.get("wstepna") as string
  const msc = formData.get("msc") as string
  const wykup = formData.get("wykup") as string

  let listingId: string | null = null

  if (slug) {
    const { data: listing } = await supabase
      .from("listings")
      .select("id")
      .eq("slug", slug)
      .single()

    if (listing) {
      listingId = listing.id
    }
  }

  const { error } = await supabase.from("contact_requests").insert({
    name,
    phone,
    email,
    nip: nip || null,
    message: message || null,
    listing_id: listingId,
    leasing_initial_pct: wstepna ? Number(wstepna) : null,
    leasing_months: msc ? Number(msc) : null,
    leasing_residual_pct: wykup ? Number(wykup) : null,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
