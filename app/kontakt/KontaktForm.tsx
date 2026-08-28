"use client"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Navbar from "../components/Navbar"
import { submitContactForm } from "./actions"

export default function KontaktForm() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const marka = searchParams.get("marka")
  const model = searchParams.get("model")
  const typ = searchParams.get("typ")
  const rata = searchParams.get("rata")
  const slug = searchParams.get("slug") || ""
  const wstepna = searchParams.get("wstepna") || ""
  const msc = searchParams.get("msc") || ""
  const wykup = searchParams.get("wykup") || ""

  async function handleSubmit(formData: FormData) {
    setStatus("sending")
    const result = await submitContactForm(formData)
    if (result.success) {
      setStatus("sent")
    } else {
      setStatus("error")
      setErrorMsg(result.error || "Coś poszło nie tak")
    }
  }

  const inputClass = "w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2"
  const labelClass = "block text-sm font-semibold mb-1.5"

  if (status === "sent") {
    return (
      <main className="min-h-screen flex flex-col" style={{ backgroundColor: "#f8f9fb" }}>
        <Navbar />
        <section className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full rounded-xl p-8 sm:p-10 text-center" style={{ backgroundColor: "#ffffff", border: "1px solid #e8eaed" }}>
            <div className="mb-5 flex justify-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: "#22c55e" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1B2A4A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-3" style={{ color: "#1B2A4A" }}>Dziękujemy!</h1>
            <p className="text-sm" style={{ color: "#666" }}>Skontaktujemy się z Tobą wkrótce.</p>
          </div>
        </section>
        <footer className="px-4 sm:px-6 py-8 sm:py-10" style={{ backgroundColor: "#1B2A4A" }}>
          <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="text-xl font-bold tracking-widest" style={{ color: "#F0A500" }}>FIDENS</div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
              <a href="/o-nas" className="text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>Poznaj Fidens</a>
              <a href="/leasing" className="text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>Leasing</a>
              <a href="/kontakt" className="text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>Kontakt</a>
              <a href="/regulamin" className="text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>Regulamin</a>
              <a href="/polityka" className="text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>Polityka prywatności</a>
            </div>
            <div className="text-xs text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
              (c) 2026 Fidens. Wszelkie prawa zastrzeżone.
            </div>
          </div>
        </footer>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "#f8f9fb" }}>
      <Navbar />

      <section className="flex-1 px-4 sm:px-6 py-10 sm:py-14">
        <div className="max-w-xl mx-auto rounded-xl p-6 sm:p-8" style={{ backgroundColor: "#ffffff", border: "1px solid #e8eaed" }}>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#1B2A4A" }}>
            Zapytanie ofertowe
          </h1>
          <p className="text-sm mb-6" style={{ color: "#888" }}>
            Wypełnij poniższy formularz, a nasz doradca skontaktuje się z Tobą tak szybko, jak to możliwe.
          </p>

          {marka && model && (
            <div className="rounded-lg px-4 py-3 mb-6 text-sm" style={{ backgroundColor: "#f8f9fb", border: "1px solid #e8eaed", color: "#1B2A4A" }}>
              Zapytanie o: <strong>{marka} {model}</strong>
              {typ && <> ({typ})</>}
              {rata && <> &middot; rata od {rata} zł/msc</>}
            </div>
          )}

          <form action={handleSubmit} className="space-y-4">
            <input type="hidden" name="slug" value={slug} />
            <input type="hidden" name="wstepna" value={wstepna} />
            <input type="hidden" name="msc" value={msc} />
            <input type="hidden" name="wykup" value={wykup} />

            <div>
              <label className={labelClass} style={{ color: "#1B2A4A" }}>Imię i nazwisko *</label>
              <input type="text" name="name" required className={inputClass} style={{ borderColor: "#e8eaed", outlineColor: "#F0A500" }} />
            </div>

            <div>
              <label className={labelClass} style={{ color: "#1B2A4A" }}>Telefon *</label>
              <input type="tel" name="phone" required className={inputClass} style={{ borderColor: "#e8eaed", outlineColor: "#F0A500" }} />
            </div>

            <div>
              <label className={labelClass} style={{ color: "#1B2A4A" }}>Email *</label>
              <input type="email" name="email" required className={inputClass} style={{ borderColor: "#e8eaed", outlineColor: "#F0A500" }} />            </div>

            <div>
              <label className={labelClass} style={{ color: "#1B2A4A" }}>NIP (opcjonalnie)</label>
              <input type="text" name="nip" className={inputClass} style={{ borderColor: "#e8eaed", outlineColor: "#F0A500" }} />
            </div>

            <div>
              <label className={labelClass} style={{ color: "#1B2A4A" }}>Wiadomość (opcjonalnie)</label>
              <textarea name="message" rows={4} className={inputClass} style={{ borderColor: "#e8eaed", outlineColor: "#F0A500" }} />
            </div>

            {status === "error" && (
              <p className="text-sm" style={{ color: "#dc2626" }}>{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full py-3 rounded-lg font-semibold transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              style={{ backgroundColor: "#F0A500", color: "#1B2A4A" }}
            >
              {status === "sending" ? "Wysyłanie..." : "Wyślij zapytanie"}
            </button>

            <p className="text-xs text-center" style={{ color: "#aaa" }}>
              Wysyłając formularz akceptujesz przetwarzanie danych w celu przygotowania oferty.
            </p>
          </form>
        </div>
      </section>

      <footer className="px-4 sm:px-6 py-8 sm:py-10" style={{ backgroundColor: "#1B2A4A" }}>
        <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-xl font-bold tracking-widest" style={{ color: "#F0A500" }}>FIDENS</div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            <a href="/o-nas" className="text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>Poznaj Fidens</a>
            <a href="/leasing" className="text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>Leasing</a>
            <a href="/kontakt" className="text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>Kontakt</a>
            <a href="/regulamin" className="text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>Regulamin</a>
            <a href="/polityka" className="text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>Polityka prywatności</a>
          </div>
          <div className="text-xs text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
            (c) 2026 Fidens. Wszelkie prawa zastrzeżone.
          </div>
        </div>
      </footer>
    </main>
  )
}

