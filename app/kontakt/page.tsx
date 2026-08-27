import { Suspense } from "react"
import KontaktForm from "./KontaktForm"

export default function KontaktPage() {
  return (
    <Suspense fallback={<div className="max-w-xl mx-auto px-4 py-24 text-center text-gray-400">Ładowanie...</div>}>
      <KontaktForm />
    </Suspense>
  )
}