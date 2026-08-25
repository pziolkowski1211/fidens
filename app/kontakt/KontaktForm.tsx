"use client"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
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
      setErrorMsg(result.error || "Cos poszlo nie tak")
    }
  }

  if (status === "sent") {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4" style={{ color: "#1B2A4A" }}>
          Dziekujemy!
        </h1>
        <p className="text-gray-600">Skontaktujemy sie z Toba wkrotce.</p>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-2" style={{ color: "#1B2A4A" }}>
        Zapytanie ofertowe
      </h1>

      {marka && model && (
        <p className="text-gray-600 mb-6">
          Zapytanie o: <strong>{marka} {model}</strong>
          {typ && <> ({typ})</>}
          {rata && <> - rata od {rata} zl/msc</>}
        </p>
      )}

      <form action={handleSubmit} className="space-y-4">
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="wstepna" value={wstepna} />
        <input type="hidden" name="msc" value={msc} />
        <input type="hidden" name="wykup" value={wykup} />

        <div>
          <label className="block text-sm font-medium mb-1">Imie i nazwisko *</label>
          <input
            type="text"
            name="name"
            required
            className="w-full border rounded-lg px-3 py-2"
            style={{ borderColor: "#e8eaed" }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Telefon *</label>
          <input
            type="tel"
            name="phone"
            required
            className="w-full border rounded-lg px-3 py-2"
            style={{ borderColor: "#e8eaed" }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input
            type="email"
            name="email"
            required
            className="w-full border rounded-lg px-3 py-2"
            style={{ borderColor: "#e8eaed" }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">NIP (opcjonalnie)</label>
          <input
            type="text"
            name="nip"
            className="w-full border rounded-lg px-3 py-2"
            style={{ borderColor: "#e8eaed" }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Wiadomosc (opcjonalnie)</label>
          <textarea
            name="message"
            rows={4}
            className="w-full border rounded-lg px-3 py-2"
            style={{ borderColor: "#e8eaed" }}
          />
        </div>

        {status === "error" && (
          <p className="text-red-600 text-sm">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full py-3 rounded-lg font-semibold text-white"
          style={{ backgroundColor: "#F0A500" }}
        >
          {status === "sending" ? "Wysylanie..." : "Wyslij zapytanie"}
        </button>
      </form>
    </div>
  )
}
