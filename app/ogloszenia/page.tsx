import Link from "next/link"
import Navbar from "../components/Navbar"
import { createClient } from "@/lib/supabase/server"

interface PageProps {
  searchParams: Promise<{
    marka?: string
    model?: string
    q?: string
  }>
}

interface ListingCard {
  id: string
  slug: string
  title: string
  brand: string | null
  model: string | null
  year: number | null
  mileage_km: number | null
  leasing_rate_pln: number | null
  badge: string | null
  vehicle_type: string | null
}

export default async function OgloszeniaPage({ searchParams }: PageProps) {
  const params = await searchParams
  const marka = params.marka
  const model = params.model
  const q = params.q

  const supabase = await createClient()

  let query = supabase
    .from("listings")
    .select("id, slug, title, brand, model, year, mileage_km, leasing_rate_pln, badge, vehicle_type")
    .eq("status", "active")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })

  if (marka) {
    query = query.ilike("brand", marka)
  }
  if (model) {
    query = query.ilike("model", model)
  }
  if (q) {
    query = query.textSearch("search_vector", q, { type: "websearch", config: "simple" })
  }

  const { data, error } = await query

  if (error) {
    console.error("Blad pobierania ogloszen:", error)
  }

  const listingsArr: ListingCard[] = (data as ListingCard[] | null) || []

  let title = "Wszystkie ogłoszenia"
  let filterText = ""
  if (marka && model) {
    filterText = capitalize(marka) + " " + capitalize(model)
    title = "Oferty: " + filterText
  } else if (marka) {
    filterText = capitalize(marka)
    title = "Oferty: " + filterText
  } else if (q) {
    filterText = q
    title = "Wyniki wyszukiwania: \"" + q + "\""
  }

  const noResults = listingsArr.length === 0

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "#f8f9fb" }}>
      <Navbar />

      <section className="px-4 sm:px-6 py-10 sm:py-12" style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e8eaed" }}>
        <div className="max-w-[1100px] mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "#1B2A4A" }}>
            {title}
          </h1>
          {!noResults && (
            <p className="text-sm" style={{ color: "#888" }}>
              Znaleziono <strong>{listingsArr.length}</strong> {pluralizeOferty(listingsArr.length)}
            </p>
          )}
        </div>
      </section>

      <section className="px-4 sm:px-6 py-10 sm:py-12 flex-1">
        <div className="max-w-[1100px] mx-auto">
          {noResults ? (
            <BrakOfert filterText={filterText} marka={marka} model={model} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {listingsArr.map((auto) => (
                <Link
                  key={auto.id}
                  href={"/ogloszenia/" + auto.slug}
                  className="rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow block"
                  style={{ backgroundColor: "#ffffff", border: "1px solid #e8eaed" }}
                >
                  <div className="h-44 sm:h-48 flex items-center justify-center" style={{ backgroundColor: "#e8eaed" }}>
                    <span className="text-sm" style={{ color: "#aaa" }}>Zdjęcie pojazdu</span>
                  </div>
                  <div className="p-4">
                    {auto.badge && (
                      <div className="text-[10px] py-0.5 px-2 rounded-[3px] inline-block mb-2"
                        style={{
                          backgroundColor: auto.badge === "Promocja" ? "#fff3e0" : "#e8f4e8",
                          color: auto.badge === "Promocja" ? "#e65100" : "#2a7a2a"
                        }}>
                        {auto.badge}
                      </div>
                    )}
                    <div className="text-base font-bold mb-1" style={{ color: "#1B2A4A" }}>{auto.title}</div>
                    <div className="text-[13px] mb-3" style={{ color: "#888" }}>
                      {[auto.year, auto.mileage_km ? formatNumber(auto.mileage_km) + " km" : null].filter(Boolean).join(" · ")}
                    </div>
                    {auto.leasing_rate_pln && (
                      <div className="text-[22px] font-bold" style={{ color: "#1B2A4A" }}>
                        od {formatNumber(auto.leasing_rate_pln)} zł <span className="text-[13px] font-normal" style={{ color: "#888" }}>/msc</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="px-4 sm:px-6 py-8 sm:py-10" style={{ backgroundColor: "#1B2A4A" }}>
        <div className="max-w-[1100px] mx-auto text-center text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          (c) 2026 Fidens. Wszelkie prawa zastrzeżone.
        </div>
      </footer>
    </main>
  )
}

function BrakOfert({ filterText, marka, model }: { filterText: string; marka?: string; model?: string }) {
  const kontaktParams = new URLSearchParams()
  if (marka) kontaktParams.set("marka", marka)
  if (model) kontaktParams.set("model", model)
  const kontaktUrl = "/kontakt" + (kontaktParams.toString() ? "?" + kontaktParams.toString() : "")

  return (
    <div className="rounded-xl p-8 sm:p-16 text-center max-w-[600px] mx-auto"
      style={{ backgroundColor: "#ffffff", border: "1px solid #e8eaed" }}>
      <div className="text-5xl mb-4">&#128269;</div>
      <h2 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: "#1B2A4A" }}>
        Brak ofert{filterText && " dla"} {filterText && <span style={{ color: "#F0A500" }}>{filterText}</span>}
      </h2>
      <p className="text-[15px] leading-relaxed mb-6" style={{ color: "#666" }}>
        Nie mamy aktualnie tego pojazdu w ofercie, ale możesz o niego zapytać &mdash;
        <br />sprowadzimy go specjalnie dla Ciebie.
      </p>
      <Link
        href={kontaktUrl}
        className="font-bold rounded-lg py-3.5 px-8 text-[15px] inline-block hover:opacity-90 transition-opacity"
        style={{ backgroundColor: "#F0A500", color: "#1B2A4A" }}
      >
        Zapytaj o ten pojazd &rarr;
      </Link>
      <div className="mt-6">
        <Link href="/ogloszenia" className="text-[13px] underline" style={{ color: "#888" }}>
          Lub zobacz wszystkie dostępne oferty
        </Link>
      </div>
    </div>
  )
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function pluralizeOferty(n: number): string {
  if (n === 1) return "ofertę"
  if (n >= 2 && n <= 4) return "oferty"
  return "ofert"
}

function formatNumber(n: number): string {
  return n.toLocaleString("pl-PL").replace(/,/g, " ")
}
