import { Suspense } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Zapytanie ofertowe — Fidens",
  description: "Skontaktuj się z nami w sprawie leasingu lub finansowania pojazdu, maszyny lub sprzętu. Odpowiadamy szybko.",
}
import KontaktForm from "./KontaktForm"

export default function KontaktPage() {
  return (
    <Suspense fallback={<div className="max-w-xl mx-auto px-4 py-24 text-center text-gray-400">Ładowanie...</div>}>
      <KontaktForm />
    </Suspense>
  )
}