import Link from "next/link"
import type { Metadata } from "next"
import Navbar from "../components/Navbar"
import { createClient } from "@/lib/supabase/server"
import { calculateShowcaseRate } from "@/lib/leasing/calculator"

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
  rate: number | null
  badge: string | null
  vehicle_type: string | null
  cover_url: string | null
  is_marza: boolean
}

interface RawListingRow {
  id: string
  slug: string
  title: string
  brand: string | null
  model: string | null
  year: number | null
  mileage_km: number | null
  price_pln: number | null
  vat_type: string | null
  badge: string | null
  vehicle_type: string | null
  listing_images: { url: string; is_cover: boolean }[] | null
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams
  const { marka, model, q } = params

  let title = "Wszystkie ogłoszenia — Fidens"
  let description = "Przeglądaj aktualną ofertę pojazdów osobowych, ciężarowych i maszyn budowlanych dostępnych w leasingu i finansowaniu na Fidens.pl."

  if (marka && model) {
    title = `Oferty: ${capitalize(marka)} ${capitalize(model)} — Fidens`
    description = `Sprawdź dostępne oferty ${capitalize(marka)} ${capitalize(model)} w leasingu i finansowaniu na Fidens.pl.`
  } else if (marka) {
    title = `Oferty: ${capitalize(marka)} — Fidens`
    description = `Sprawdź dostępne oferty ${capitalize(marka)} w leasingu i finansowaniu na Fidens.pl.`
  } else if (q) {
    title = `Wyniki wyszukiwania: "${q}" — Fidens`
    description = `Wyniki wyszukiwania dla "${q}" wśród ofert leasingu i finansowania na Fidens.pl.`
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://fidens.pl/ogloszenia",
      siteName: "Fidens",
      locale: "pl_PL",
      type: "website",
      images: [{ url: "https://fidens.pl/og-image.png", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://fidens.pl/og-image.png"],
    },
  }
}

export default async function OgloszeniaPage({ searchParams }: PageProps) {
  const params = await searchParams
  const marka = params.marka
  const model = params.model
  const q = params.q

  const supabase = await createClient()

  let query = supabase
    .from("listings")
    .select("id, slug, title, brand, model, year, mileage_km, price_pln, vat_type, badge, vehicle_type, listing_images(url, is_cover)")
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
    console.error("Błąd pobierania ogłoszeń:", error)
  }

  const listingsArr: ListingCard[] = ((data as RawListingRow[] | null) || []).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    brand: row.brand,
    model: row.model,
    year: row.year,
    mileage_km: row.mileage_km,
    rate: row.price_pln ? calculateShowcaseRate(row.price_pln, row.vat_type === "marza") : null,
    badge: row.badge,
    vehicle_type: row.vehicle_type,
    cover_url: extractCoverUrl(row.listing_images),
    is_marza: row.vat_type === "marza",
  }))

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
                  <div className="h-44 sm:h-48 flex items-center justify-center overflow-hidden" style={{ backgroundColor: "#e8eaed" }}>
                    {auto.cover_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={auto.cover_url} alt={auto.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm" style={{ color: "#aaa" }}>Brak zdjęcia</span>
                    )}
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
                      {[auto.year, auto.mileage_km ? formatNumber(auto.mileage_km) + " km" : null].filter(Boolean).join(" \u00B7 ")}
                    </div>
                    {auto.rate && (
                      <div className="text-[22px] font-bold" style={{ color: "#1B2A4A" }}>
                        od {formatNumber(Math.round(auto.rate))} zł <span className="text-[13px] font-normal" style={{ color: "#888" }}>/msc{!auto.is_marza && " netto"}</span>
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
          Nie mamy aktualnie tego pojazdu w ofercie, ale możesz o niego zapytać
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

function extractCoverUrl(images: { url: string; is_cover: boolean }[] | null | undefined): string | null {
  if (!images || images.length === 0) return null
  const cover = images.find((img) => img.is_cover === true)
  return cover ? cover.url : images[0].url
}