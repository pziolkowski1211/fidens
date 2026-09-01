import { createServiceClient } from "@/lib/supabase/service"
import { Resend } from "resend"
import Navbar from "../components/Navbar"

const resend = new Resend(process.env.RESEND_API_KEY)
const MARKETING_AUDIENCE_ID = "36608761-95f3-431e-bb2c-000684e745b4"

async function confirmToken(token: string): Promise<{ ok: boolean; message: string }> {
  const supabase = createServiceClient()

  const { data: contact, error: fetchError } = await supabase
    .from("contact_requests")
    .select("id, name, email, marketing_confirmed")
    .eq("marketing_confirm_token", token)
    .single()

  if (fetchError || !contact) {
    return { ok: false, message: "Link jest nieprawidlowy lub juz wygasl." }
  }

  if (contact.marketing_confirmed) {
    return { ok: true, message: "Ten adres email zostal juz wczesniej potwierdzony." }
  }

  if (!contact.email) {
    return { ok: false, message: "Brak adresu email powiazanego z tym zgloszeniem." }
  }

  try {
    const nameParts = contact.name.trim().split(/\s+/)
    const firstName = nameParts[0] || ""
    const lastName = nameParts.slice(1).join(" ") || ""
    await resend.contacts.create({
      email: contact.email,
      firstName,
      lastName,
      unsubscribed: false,
      audienceId: MARKETING_AUDIENCE_ID,
    })
  } catch (resendError) {
    console.error("Blad dodawania kontaktu do segmentu Resend:", resendError)
    return { ok: false, message: "Wystapil blad podczas potwierdzania zgody. Sprobuj ponownie pozniej." }
  }

  const { error: updateError } = await supabase
    .from("contact_requests")
    .update({ marketing_confirmed: true, marketing_confirm_token: null })
    .eq("id", contact.id)

  if (updateError) {
    console.error("Blad aktualizacji statusu potwierdzenia:", updateError)
  }

  return { ok: true, message: "Dziekujemy! Twoja zgoda na otrzymywanie ofert Fidens zostala potwierdzona." }
}

export default async function PotwierdzZgodePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const params = await searchParams
  const token = params.token

  const result = token
    ? await confirmToken(token)
    : { ok: false, message: "Brak tokenu potwierdzajacego w adresie URL." }

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "#f8f9fb" }}>
      <Navbar />
      <section className="flex-1 flex items-center justify-center px-4 py-16">
        <div
          className="max-w-md w-full rounded-xl p-8 sm:p-10 text-center"
          style={{ backgroundColor: "#ffffff", border: "1px solid #e8eaed" }}
        >
          <div className="mb-5 flex justify-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: result.ok ? "#22c55e" : "#dc2626" }}
            >
              {result.ok ? (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1B2A4A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              )}
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-3" style={{ color: "#1B2A4A" }}>
            {result.ok ? "Potwierdzono" : "Nie udalo sie potwierdzic"}
          </h1>
          <p className="text-sm" style={{ color: "#666" }}>{result.message}</p>
        </div>
      </section>
    </main>
  )
}