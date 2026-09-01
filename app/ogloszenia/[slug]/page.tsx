import { notFound } from "next/navigation"
import Link from "next/link"
import { cache } from "react"
import type { ReactNode } from "react"
import type { Metadata } from "next"
import Navbar from "../../components/Navbar"
import Carousel from "../../components/Carousel"
import LeasingCalculator from "../../components/LeasingCalculator"
import { createClient } from "@/lib/supabase/server"

function parseInlineBold(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={`${keyPrefix}-b-${i}`}>{part.slice(2, -2)}</strong>
    }
    return <span key={`${keyPrefix}-t-${i}`}>{part}</span>
  })
}

function renderDescription(text: string): ReactNode {
  const lines = text.split("\n")
  const blocks: ReactNode[] = []
  let currentList: string[] = []
  let blockIndex = 0

  function flushList() {
    if (currentList.length > 0) {
      const listIndex = blockIndex++
      blocks.push(
        <ul key={`ul-${listIndex}`} className="list-disc pl-5 space-y-1 my-2">
          {currentList.map((item, i) => (
            <li key={`li-${listIndex}-${i}`}>{parseInlineBold(item, `li-${listIndex}-${i}`)}</li>
          ))}
        </ul>
      )
      currentList = []
    }
  }

  for (const line of lines) {
    const trimmed = line.trim()
    const boldHeadingMatch = trimmed.match(/^\*\*(.+):\*\*$/)
    const hashHeadingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/)
    const isHr = trimmed === "---" || trimmed === "***"
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      currentList.push(trimmed.slice(2))
    } else if (isHr) {
      flushList()
      blocks.push(<hr key={`hr-${blockIndex++}`} className="my-4" style={{ borderColor: "#e8eaed" }} />)
    } else if (hashHeadingMatch) {
      flushList()
      const level = hashHeadingMatch[1].length
      const headingIndex = blockIndex++
      const sizeClass = level === 1 ? "text-xl" : level === 2 ? "text-lg" : "text-base"
      blocks.push(
        <h3 key={`h-${headingIndex}`} className={`${sizeClass} font-bold mt-4 mb-2`} style={{ color: "#1B2A4A" }}>
          {parseInlineBold(hashHeadingMatch[2], `h-${headingIndex}`)}
        </h3>
      )
    } else if (boldHeadingMatch) {
      flushList()
      const headingIndex = blockIndex++
      blocks.push(
        <h3 key={`h-${headingIndex}`} className="text-lg font-bold mt-4 mb-2" style={{ color: "#1B2A4A" }}>
          {boldHeadingMatch[1]}:
        </h3>
      )
    } else {
      flushList()
      if (trimmed.length === 0) {
        blocks.push(<br key={`br-${blockIndex++}`} />)
      } else {
        const pIndex = blockIndex++
        blocks.push(
          <p key={`p-${pIndex}`} className="mb-2">
            {parseInlineBold(trimmed, `p-${pIndex}`)}
          </p>
        )
      }
    }
  }
  flushList()

  return <div className="text-[15px] leading-relaxed" style={{ color: "#555" }}>{blocks}</div>
}

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
  is_cover?: boolean
}

const getListing = cache(async (slug: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase.from("listings").select("*").eq("slug", slug).eq("status", "active").single()

  if (error || !data) {
    return null
  }

  const listing = data as Listing

  const { data: imagesData } = await supabase.from("listing_images").select("url, position, is_cover").eq("listing_id", listing.id).order("position", { ascending: true })

  const images: ListingImage[] = imagesData || []

  return { listing, images }
})

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const result = await getListing(slug)

  if (!result) {
    return {
      title: "Ogłoszenie nie znalezione — Fidens",
    }
  }

  const { listing, images } = result
  const cover = images.find((i) => i.is_cover)?.url || images[0]?.url

  const priceText = listing.price_pln ? `${listing.price_pln.toLocaleString("pl-PL")} zł` : ""
  const description = listing.description
    ? listing.description.slice(0, 155)
    : `${listing.brand ?? ""} ${listing.model ?? ""} ${listing.year ?? ""} — ${priceText}. Sprawdź ofertę leasingu i finansowania na Fidens.pl.`.trim()

  return {
    title: `${listing.title} — Fidens`,
    description,
    openGraph: {
      title: listing.title,
      description,
      url: `https://fidens.pl/ogloszenia/${listing.slug}`,
      siteName: "Fidens",
      locale: "pl_PL",
      type: "website",
      images: cover ? [{ url: cover, width: 1200, height: 630, alt: listing.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: listing.title,
      description,
      images: cover ? [cover] : undefined,
    },
  }
}

export default async function OgloszenieDetailPage({ params }: PageProps) {
  const { slug } = await params
  const result = await getListing(slug)

  if (!result) {
    notFound()
  }

  const { listing, images } = result

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

  const coverImage = images.find((i) => i.is_cover)?.url || images[0]?.url

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: listing.title,
    brand: listing.brand || undefined,
    model: listing.model || undefined,
    vehicleModelDate: listing.year || undefined,
    fuelType: listing.fuel || undefined,
    vehicleTransmission: listing.transmission || undefined,
    color: listing.color || undefined,
    image: coverImage || undefined,
    mileageFromOdometer: listing.mileage_km
      ? { "@type": "QuantitativeValue", value: listing.mileage_km, unitCode: "KMT" }
      : undefined,
    offers: listing.price_pln
      ? {
          "@type": "Offer",
          price: listing.price_pln,
          priceCurrency: "PLN",
          availability: "https://schema.org/InStock",
          url: `https://fidens.pl/ogloszenia/${listing.slug}`,
        }
      : undefined,
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "#f8f9fb" }}>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="px-4 sm:px-6 pt-5 pb-3" style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e8eaed" }}>
        <div className="max-w-[1100px] mx-auto flex items-center flex-wrap gap-2 text-sm">
          <Link href="/" className="transition-colors hover:text-[#F0A500]" style={{ color: "#888" }}>Strona główna</Link>
          <span style={{ color: "#ccc" }}>&rsaquo;</span>
          <Link href="/ogloszenia" className="transition-colors hover:text-[#F0A500]" style={{ color: "#888" }}>Ogłoszenia</Link>
          <span style={{ color: "#ccc" }}>&rsaquo;</span>
          <span className="font-semibold" style={{ color: "#1B2A4A" }}>{listing.title}</span>
        </div>
      </div>

      <section className="px-4 sm:px-6 py-8 sm:py-10 flex-1">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">

          <div className="min-w-0">
            <div className="flex items-start gap-3 mb-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: "#1B2A4A" }}>{listing.title}</h1>
              {listing.badge && (<span className="text-[11px] font-bold py-[3px] px-[10px] rounded-full mt-2" style={{ backgroundColor: listing.badge === "Promocja" ? "#fff3e0" : "#e8f4e8", color: listing.badge === "Promocja" ? "#e65100" : "#2a7a2a" }}>{listing.badge}</span>)}
            </div>

            <Carousel images={images} alt={listing.title} />

            {params_list.length > 0 && (
              <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: "#ffffff", border: "1px solid #e8eaed" }}>
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

            {listing.description && (
              <div className="rounded-xl p-6" style={{ backgroundColor: "#ffffff", border: "1px solid #e8eaed" }}>
                <h2 className="text-lg font-bold mb-3" style={{ color: "#1B2A4A" }}>Opis</h2>
                {renderDescription(listing.description)}
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

function capitalizeFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

