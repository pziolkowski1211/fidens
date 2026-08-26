"use server"
import { createClient } from "@/lib/supabase/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

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

  try {
    await resend.emails.send({
      from: "Fidens <kontakt@fidens.pl>",
      to: "p.ziolkowski1211@gmail.com",
      subject: `Nowe zapytanie: ${name}`,
      text: `Nowe zapytanie ofertowe.

Imie: ${name}
Telefon: ${phone}
Email: ${email}
NIP: ${nip || "brak"}
Wiadomosc: ${message || "brak"}

Parametry leasingu:
Slug ogloszenia: ${slug || "brak"}
Wplata wstepna: ${wstepna || "brak"}%
Okres: ${msc || "brak"} msc
Wykup: ${wykup || "brak"}%`,
    })
  } catch (emailError) {
    console.error("Blad wysylki maila:", emailError)
  }

  return { success: true }
}
