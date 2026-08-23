import { notFound } from "next/navigation"
import Link from "next/link"
import Navbar from "../../components/Navbar"
import Carousel from "../../components/Carousel"
import LeasingCalculator from "../../components/LeasingCalculator"
import { createClient } from "@/lib/supabase/server"

interface PageProps {
  params: Promise<{ slug: string }>
}

interface Listing {
  id: string
  slug: string
  title: string
  brand: string | null
  model: string | null
  year: number | null
  mileage_km: number | null
  fuel: string | null
  transmission: string | null
  power_hp: number | null
  engine_cc: number | null
  color: string | null
  country_origin: string | null
  price_pln: number | null
  leasing_rate_pln: number | null
  badge: string | null
  description: string | null
  vat_type: string | null
}

interface ListingImage {
  url: string
  position: number
}

export default async function OgloszenieDetailPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.from("listings").select("*").eq("slug", slug).eq("status", "active").single()

  if (error || !data) {
    notFound()
  }

  const listing = data as Listing

  const { data: imagesData } = await supabase.from("listing_images").select("url, position").eq("listing_id", listing.id).order("position", { ascending: true })

  const images: ListingImage[] = imagesData || []

  const formatNumber = (n: number | null | undefined): string => {
    if (n === null || n === undefined) return ""
    return n.toLocaleString("pl-PL").replace(/,/g, " ")
  }

  const params_list: Array<{ label: string; value: string }> = []

  if (listing.year) params_list.push({ label: "Rok produkcji", value: String(listing.year) })
  if (listing.mileage_km) params_list.push({ label: "Przebieg", value: formatNumber(listing.mileage_km) + " km" })
  if (listing.fuel) params_list.push({ label: "Paliwo", value: capitalizeFirst(listing.fuel) })
  if (listing.transmission) params_list.push({ label: "Skrzynia biegów", value: capitalizeFirst(listing.transmission) })
  if (listing.power_hp) params_list.push({ label: "Moc", value: listing.power_hp + " KM" })
  if (listing.engine_cc) params_list.push({ label: "Pojemność silnika", value: formatNumber(listing.engine_cc) + " cm3" })
  if (listing.color) params_list.push({ label: "Kolor", value: listing.color })
  if (listing.country_origin) params_list.push({ label: "Pochodzenie", value: listing.country_origin })

  const isMarza = listing.vat_type === "marza"

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "#f8f9fb" }}>
      <Navbar />

      <div className="px-4 sm:px-6 pt-5 pb-2" style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e8eaed" }}>
        <div className="max-w-[1100px] mx-auto text-xs" style={{ color: "#888" }}>
          <Link href="/" className="hover:underline">Strona główna</Link>
          {" > "}
          <Link href="/ogloszenia" className="hover:underline">Ogłoszenia</Link>
          {" > "}
          <span style={{ color: "#1B2A4A" }}>{listing.title}</span>
        </div>
      </div>

      <section className="px-4 sm:px-6 py-8 sm:py-10 flex-1">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">

          <div>
            <Carousel images={images} alt={listing.title} />

            <div className="flex items-start gap-3 mb-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: "#1B2A4A" }}>{listing.title}</h1>
              {listing.badge && (<span className="text-[11px] font-bold py-[3px] px-[10px] rounded-full mt-2" style={{ backgroundColor: listing.badge === "Promocja" ? "#fff3e0" : "#e8f4e8", color: listing.badge === "Promocja" ? "#e65100" : "#2a7a2a" }}>{listing.badge}</span>)}
            </div>

            {listing.description && (
              <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: "#ffffff", border: "1px solid #e8eaed" }}>
                <h2 className="text-lg font-bold mb-3" style={{ color: "#1B2A4A" }}>Opis</h2>
                <p className="text-[15px] leading-relaxed whitespace-pre-line" style={{ color: "#555" }}>{listing.description}</p>
              </div>
            )}

            {params_list.length > 0 && (
              <div className="rounded-xl p-6" style={{ backgroundColor: "#ffffff", border: "1px solid #e8eaed" }}>
                <h2 className="text-lg font-bold mb-4" style={{ color: "#1B2A4A" }}>Dane pojazdu</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  {params_list.map((p) => (
                    <div key={p.label} className="flex justify-between border-b pb-2" style={{ borderColor: "#f0f0f0" }}>
                      <dt className="text-sm" style={{ color: "#888" }}>{p.label}</dt>
                      <dd className="text-sm font-semibold" style={{ color: "#1B2A4A" }}>{p.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-xl p-6" style={{ backgroundColor: "#ffffff", border: "1px solid #e8eaed" }}>
              {listing.price_pln && (
                <LeasingCalculator price={listing.price_pln} isMarza={isMarza} slug={listing.slug} brand={listing.brand} model={listing.model} />
              )}
            </div>
          </aside>

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

function capitalizeFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
