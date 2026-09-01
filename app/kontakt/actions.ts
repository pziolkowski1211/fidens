"use server"
import { createClient } from "@/lib/supabase/server"
import { Resend } from "resend"
import { validateContactForm } from "@/lib/kontakt/validate"
import { headers } from "next/headers"

const resend = new Resend(process.env.RESEND_API_KEY)

const RATE_LIMIT_MAX_REQUESTS = 3
const RATE_LIMIT_WINDOW_MINUTES = 10

async function getClientIp(): Promise<string | null> {
  const headersList = await headers()
  const forwardedFor = headersList.get("x-forwarded-for")
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim()
  }
  return headersList.get("x-real-ip")
}

export async function submitContactForm(formData: FormData) {
  const honeypot = formData.get("website") as string
  if (honeypot) {
    return { success: true }
  }
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
  const marketingConsent = formData.get("marketingConsent") === "on"

  const validation = validateContactForm({ name, phone, email, nip, message })
  if (!validation.valid) {
    return { success: false, error: validation.error, field: validation.field }
  }

  const ipAddress = await getClientIp()

  if (ipAddress) {
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString()
    const { count } = await supabase
      .from("contact_requests")
      .select("id", { count: "exact", head: true })
      .eq("ip_address", ipAddress)
      .gte("created_at", windowStart)

    if (count !== null && count >= RATE_LIMIT_MAX_REQUESTS) {
      return {
        success: false,
        error: "Zbyt wiele zapytan w krotkim czasie. Sprobuj ponownie za kilka minut.",
      }
    }
  }

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
    marketing_consent: marketingConsent,
    ip_address: ipAddress,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  if (marketingConsent && email) {
    try {
      const nameParts = name.trim().split(/\s+/)
      const firstName = nameParts[0] || ""
      const lastName = nameParts.slice(1).join(" ") || ""
      await resend.contacts.create({
        email,
        firstName,
        lastName,
        unsubscribed: false,
        audienceId: "36608761-95f3-431e-bb2c-000684e745b4",
      })
    } catch (contactError) {
      console.error("Blad dodawania kontaktu do segmentu Resend:", contactError)
    }
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