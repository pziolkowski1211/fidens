import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import Navbar from "../components/Navbar"
import { createClient } from "@/lib/supabase/server"
import { calculateShowcaseRate, calculateRateWithDownPayment } from "@/lib/leasing/calculator"

type CategoryKey = "osobowe_dostawcze" | "ciezki_transport" | "maszyna" | "maszyna_przemyslowa"
type IconName = "car" | "truck" | "excavator" | "cog" | "building"

interface PageProps {
  searchParams: Promise<{
    marka?: string
    model?: string
    q?: string
    kategoria?: string
    rata_max?: string
    wplata?: string
  }>
}

interface CategoryInfo {
  key: CategoryKey
  name: string
  desc: string
  metaDesc: string
  isMachine: boolean
  icon: IconName
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

const CATEGORIES: CategoryInfo[] = [
  {
    key: "osobowe_dostawcze",
    name: "Osobowe i dostawcze do 3,5 t",
    desc: "Samochody osobowe, SUV-y, vany i busy dostawcze do 3,5 t.",
    metaDesc: "Samochody osobowe i dostawcze do 3,5 t dost\u0119pne w leasingu i finansowaniu na Fidens.pl.",
    isMachine: false,
    icon: "car",
  },
  {
    key: "ciezki_transport",
    name: "Transport ci\u0119\u017cki",
    desc: "Ci\u0105gniki siod\u0142owe, samochody ci\u0119\u017carowe powy\u017cej 3,5 t i naczepy.",
    metaDesc: "Ci\u0105gniki siod\u0142owe, samochody ci\u0119\u017carowe i naczepy w leasingu i finansowaniu na Fidens.pl.",
    isMachine: false,
    icon: "truck",
  },
  {
    key: "maszyna",
    name: "Maszyny budowlane",
    desc: "Koparki, \u0142adowarki i inne maszyny budowlane.",
    metaDesc: "Koparki, \u0142adowarki i inne maszyny budowlane w leasingu i finansowaniu na Fidens.pl.",
    isMachine: true,
    icon: "excavator",
  },
  {
    key: "maszyna_przemyslowa",
    name: "Maszyny przemys\u0142owe",
    desc: "Nowe obrabiarki CNC, strugarki i maszyny do obr\u00f3bki drewna.",
    metaDesc: "Nowe obrabiarki CNC, strugarki i maszyny do obr\u00f3bki drewna w leasingu i finansowaniu na Fidens.pl.",
    isMachine: true,
    icon: "cog",
  },
]

const PAVILION_DESC = "Pawilony modu\u0142owe z finansowaniem leasingowym."

// Klasy ukladu kafelkow (lg: 3 + 2 wysrodkowane w drugim rzedzie)
const TILE_LAYOUT = [
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2 lg:col-start-2",
  "sm:col-span-2 lg:col-span-2",
]

function findCategory(value?: string): CategoryInfo | undefined {
  return CATEGORIES.find((c) => c.key === value)
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams
  const { marka, model, q } = params
  const kategoria = findCategory(params.kategoria)

  let title = "Og\u0142oszenia \u2014 wybierz kategori\u0119 \u2014 Fidens"
  let description = "Samochody osobowe i dostawcze, transport ci\u0119\u017cki, maszyny budowlane i przemys\u0142owe oraz pawilony modu\u0142owe \u2014 oferty leasingu i finansowania na Fidens.pl."
  let url = "https://fidens.pl/ogloszenia"
  let canonical: string | undefined = "https://fidens.pl/ogloszenia"

  if (marka && model) {
    title = `Oferty: ${capitalize(marka)} ${capitalize(model)} \u2014 Fidens`
    description = `Sprawd\u017a dost\u0119pne oferty ${capitalize(marka)} ${capitalize(model)} w leasingu i finansowaniu na Fidens.pl.`
    canonical = undefined
  } else if (marka) {
    title = `Oferty: ${capitalize(marka)} \u2014 Fidens`
    description = `Sprawd\u017a dost\u0119pne oferty ${capitalize(marka)} w leasingu i finansowaniu na Fidens.pl.`
    canonical = undefined
  } else if (q) {
    title = `Wyniki wyszukiwania: "${q}" \u2014 Fidens`
    description = `Wyniki wyszukiwania dla "${q}" w\u015br\u00f3d ofert leasingu i finansowania na Fidens.pl.`
    canonical = undefined
  } else if (kategoria) {
    title = `${kategoria.name} \u2014 oferty leasingu \u2014 Fidens`
    description = kategoria.metaDesc
    url = `https://fidens.pl/ogloszenia?kategoria=${kategoria.key}`
    canonical = url
  }

  return {
    title,
    description,
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: {
      title,
      description,
      url,
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
  const kategoria = findCategory(params.kategoria)
  const rataMax = Number(params.rata_max) > 0 ? Number(params.rata_max) : null
  const wplata = Number(params.wplata) > 0 ? Number(params.wplata) : null

  const isLanding = !marka && !model && !q && !kategoria

  if (isLanding) {
    return <KategorieEkran />
  }

  const supabase = await createClient()

  let query = supabase
    .from("listings")
    .select("id, slug, title, brand, model, year, mileage_km, price_pln, vat_type, badge, vehicle_type, listing_images(url, is_cover)")
    .eq("status", "active")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })

  if (kategoria) {
    query = query.eq("vehicle_type", kategoria.key)
  }
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
    console.error("B\u0142\u0105d pobierania og\u0142osze\u0144:", error)
  }

  const allListings: ListingCard[] = ((data as RawListingRow[] | null) || []).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    brand: row.brand,
    model: row.model,
    year: row.year,
    mileage_km: row.mileage_km,
    rate: row.price_pln
      ? wplata
        ? calculateRateWithDownPayment(row.price_pln, row.vat_type === "marza", wplata)
        : calculateShowcaseRate(row.price_pln, row.vat_type === "marza")
      : null,
    badge: row.badge,
    vehicle_type: row.vehicle_type,
    cover_url: extractCoverUrl(row.listing_images),
    is_marza: row.vat_type === "marza",
  }))
  const listingsArr = rataMax ? allListings.filter((l) => l.rate !== null && l.rate <= rataMax) : allListings

  let title = kategoria ? kategoria.name : "Og\u0142oszenia"
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

  const hasSearch = Boolean(marka || model || q)
  const noResults = listingsArr.length === 0

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "#f8f9fb" }}>
      <Navbar />

      <section className="px-4 sm:px-6 py-10 sm:py-12" style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e8eaed" }}>
        <div className="max-w-[1100px] mx-auto">
          <Link href="/ogloszenia" className="text-[13px] inline-block mb-3 hover:underline" style={{ color: "#888" }}>
            &larr; Kategorie
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "#1B2A4A" }}>
            {title}
          </h1>
          {hasSearch && kategoria && (
            <p className="text-sm mb-1" style={{ color: "#888" }}>
              {"Kategoria: " + kategoria.name}
            </p>
          )}
          {rataMax && (
            <p className="text-sm mb-1" style={{ color: "#888" }}>
              Maksymalna rata: {formatNumber(rataMax)} z&#322;/msc
            </p>
          )}
          {wplata && (
            <p className="text-sm mb-1" style={{ color: "#888" }}>
              Wp&#322;ata w&#322;asna: {formatNumber(wplata)} z&#322;
            </p>
          )}          {!noResults && (
            <p className="text-sm" style={{ color: "#888" }}>
              Znaleziono <strong>{listingsArr.length}</strong> {pluralizeOferty(listingsArr.length)}
            </p>
          )}
          <div className="mt-5">
            <CategoryPills active={kategoria?.key} marka={marka} model={model} q={q} />
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-10 sm:py-12 flex-1">
        <div className="max-w-[1100px] mx-auto">
          {noResults ? (
            <BrakOfert filterText={filterText} marka={marka} model={model} kategoria={kategoria} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {listingsArr.map((auto) => (
                <Link
                  key={auto.id}
                  href={"/ogloszenia/" + auto.slug}
                  className="group rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col"
                  style={{ backgroundColor: "#ffffff", border: "1px solid #e8eaed" }}
                >
                  <div className="relative h-44 sm:h-48 flex items-center justify-center overflow-hidden" style={{ backgroundColor: "#e8eaed" }}>
                    {auto.cover_url ? (
                      <Image src={auto.cover_url} alt={auto.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <span className="text-sm" style={{ color: "#aaa" }}>{"Brak zdj\u0119cia"}</span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    {auto.badge && (
                      <div className="text-[10px] py-0.5 px-2 rounded-[3px] inline-block self-start mb-2"
                        style={{
                          backgroundColor: auto.badge === "Promocja" ? "#fff3e0" : "#e8f4e8",
                          color: auto.badge === "Promocja" ? "#e65100" : "#2a7a2a"
                        }}>
                        {auto.badge}
                      </div>
                    )}
                    <div className="text-base font-bold mb-1" style={{ color: "#1B2A4A" }}>{auto.title}</div>
                    <div className="flex items-center gap-3 text-[13px] mb-3" style={{ color: "#888" }}>
                      {auto.year && (
                        <span className="flex items-center gap-1">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F0A500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2"></rect>
                            <path d="M16 2v4M8 2v4M3 10h18"></path>
                          </svg>
                          {auto.year}
                        </span>
                      )}
                      {auto.mileage_km ? (
                        <span className="flex items-center gap-1">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F0A500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 12l4-4"></path>
                          </svg>
                          {formatNumber(auto.mileage_km)} km
                        </span>
                      ) : null}
                    </div>
                    {auto.rate && (
                      <div className="text-[22px] font-bold mt-auto" style={{ color: "#1B2A4A" }}>
                        od {formatNumber(Math.round(auto.rate))} {"z\u0142"} <span className="text-[13px] font-normal" style={{ color: "#888" }}>/msc{!auto.is_marza && " netto"}</span>
                        {wplata && (
                          <span className="block text-[12px] font-normal" style={{ color: "#888" }}>przy wp&#322;acie {formatNumber(wplata)} z&#322;</span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}

function KategorieEkran() {
  const tiles = [
    ...CATEGORIES.map((c) => ({
      href: "/ogloszenia?kategoria=" + c.key,
      name: c.name,
      desc: c.desc,
      icon: c.icon,
      cta: "Zobacz oferty",
    })),
    {
      href: "/pawilony",
      name: "Pawilony",
      desc: PAVILION_DESC,
      icon: "building" as IconName,
      cta: "Zobacz pawilony",
    },
  ]

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "#f8f9fb" }}>
      <Navbar />

      <section className="px-4 sm:px-6 py-10 sm:py-14" style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e8eaed" }}>
        <div className="max-w-[1100px] mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "#1B2A4A" }}>
            {"Wybierz kategori\u0119"}
          </h1>
          <p className="text-[15px]" style={{ color: "#666" }}>
            {"Znajd\u017a sprz\u0119t, kt\u00f3ry sfinansujemy w leasingu."}
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-10 sm:py-12 flex-1">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
            {tiles.map((tile, idx) => (
              <Link
                key={tile.href}
                href={tile.href}
                className={"group rounded-xl p-6 sm:p-7 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#F0A500] " + TILE_LAYOUT[idx]}
                style={{ backgroundColor: "#ffffff", border: "1px solid #e8eaed" }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: "#1B2A4A" }}
                >
                  <CategoryIcon name={tile.icon} />
                </div>
                <div className="text-lg font-bold mb-2" style={{ color: "#1B2A4A" }}>{tile.name}</div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "#666" }}>{tile.desc}</p>
                <span className="mt-auto text-sm font-bold" style={{ color: "#1B2A4A" }}>
                  {tile.cta}{" "}
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1" style={{ color: "#F0A500" }}>&rarr;</span>
                </span>
              </Link>
            ))}
          </div>

          <p className="text-center text-sm mt-10" style={{ color: "#666" }}>
            {"Nie widzisz tego, czego szukasz? Sprowadzimy sprz\u0119t na zam\u00f3wienie. "}
            <Link href="/kontakt" className="font-bold underline" style={{ color: "#1B2A4A" }}>
              {"Napisz do nas"}
            </Link>
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}

function CategoryIcon({ name }: { name: IconName }) {
  const common = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#F0A500",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  }

  if (name === "car") {
    return (
      <svg {...common}>
        <path d="M3 13l2-5a2 2 0 0 1 2-1h10a2 2 0 0 1 2 1l2 5v4h-3M3 13v4h3M3 13h18" />
        <circle cx="7.5" cy="17" r="1.8" />
        <circle cx="16.5" cy="17" r="1.8" />
      </svg>
    )
  }
  if (name === "truck") {
    return (
      <svg {...common}>
        <path d="M2 6h11v10H2zM13 9h4l3 3v4h-7" />
        <circle cx="6" cy="17.5" r="1.8" />
        <circle cx="17" cy="17.5" r="1.8" />
      </svg>
    )
  }
  if (name === "excavator") {
    return (
      <svg {...common}>
        <rect x="3" y="16" width="13" height="4" rx="2" />
        <path d="M5 16v-4h7v4M8 12V8l6-5 3 3M17 6l3 7h-4" />
      </svg>
    )
  }
  if (name === "cog") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6" />
    </svg>
  )
}

function CategoryPills({
  active,
  marka,
  model,
  q,
}: {
  active?: CategoryKey
  marka?: string
  model?: string
  q?: string
}) {
  const base = "inline-flex items-center whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium transition-colors"

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
      {CATEGORIES.map((c) => {
        const isActive = c.key === active
        return (
          <Link
            key={c.key}
            href={buildCategoryHref(c.key, marka, model, q)}
            className={base + (isActive ? "" : " hover:border-[#F0A500]")}
            style={{
              backgroundColor: isActive ? "#1B2A4A" : "#ffffff",
              color: isActive ? "#ffffff" : "#1B2A4A",
              border: "1px solid " + (isActive ? "#1B2A4A" : "#e8eaed"),
            }}
          >
            {c.name}
          </Link>
        )
      })}
      <Link
        href="/pawilony"
        className={base + " hover:border-[#F0A500]"}
        style={{ backgroundColor: "#ffffff", color: "#1B2A4A", border: "1px solid #e8eaed" }}
      >
        Pawilony
      </Link>
    </div>
  )
}

function SiteFooter() {
  return (
    <footer className="px-4 sm:px-6 py-8 sm:py-10" style={{ backgroundColor: "#1B2A4A" }}>
      <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="text-xl font-bold tracking-widest" style={{ color: "#F0A500" }}>FIDENS</div>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
          <a href="/o-nas" className="text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>Poznaj Fidens</a>
          <a href="/leasing" className="text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>Leasing</a>
          <a href="/kontakt" className="text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>Kontakt</a>
          <a href="/regulamin" className="text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>Regulamin</a>
          <a href="/polityka" className="text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>{"Polityka prywatno\u015bci"}</a>
        </div>
        <div className="text-xs text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
          {"(c) 2026 Fidens. Wszelkie prawa zastrze\u017cone."}
        </div>
      </div>
    </footer>
  )
}

function BrakOfert({
  filterText,
  marka,
  model,
  kategoria,
}: {
  filterText: string
  marka?: string
  model?: string
  kategoria?: CategoryInfo
}) {
  const kontaktParams = new URLSearchParams()
  if (marka) kontaktParams.set("marka", marka)
  if (model) kontaktParams.set("model", model)
  const kontaktUrl = "/kontakt" + (kontaktParams.toString() ? "?" + kontaktParams.toString() : "")

  const isMachine = Boolean(kategoria?.isMachine)
  const line1 = isMachine
    ? "Nie mamy teraz tego sprz\u0119tu w ofercie, ale mo\u017cemy go sprowadzi\u0107 \u2014"
    : "Nie mamy aktualnie tego pojazdu w ofercie, ale mo\u017cesz o niego zapyta\u0107 \u2014"
  const line2 = isMachine
    ? "specjalnie dla Ciebie, na zam\u00f3wienie."
    : "sprowadzimy go specjalnie dla Ciebie."
  const ctaLabel = isMachine ? "Zapytaj o ofert\u0119" : "Zapytaj o ten pojazd"

  return (
    <div className="rounded-xl p-8 sm:p-16 text-center max-w-[600px] mx-auto"
      style={{ backgroundColor: "#ffffff", border: "1px solid #e8eaed" }}>
      <div className="text-5xl mb-4">&#128269;</div>
      <h2 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: "#1B2A4A" }}>
        Brak ofert{filterText ? " dla" : " w tej kategorii"} {filterText && <span style={{ color: "#F0A500" }}>{filterText}</span>}
      </h2>
      <p className="text-[15px] leading-relaxed mb-6" style={{ color: "#666" }}>
        {line1}
        <br />{line2}
      </p>
      <Link
        href={kontaktUrl}
        className="font-bold rounded-lg py-3.5 px-8 text-[15px] inline-block hover:opacity-90 transition-opacity"
        style={{ backgroundColor: "#F0A500", color: "#1B2A4A" }}
      >
        {ctaLabel} &rarr;
      </Link>
      <div className="mt-6">
        <Link href="/ogloszenia" className="text-[13px] underline" style={{ color: "#888" }}>
          {"Wr\u00f3\u0107 do kategorii"}
        </Link>
      </div>
    </div>
  )
}

function buildCategoryHref(key: CategoryKey, marka?: string, model?: string, q?: string): string {
  const p = new URLSearchParams()
  if (marka) p.set("marka", marka)
  if (model) p.set("model", model)
  if (q) p.set("q", q)
  p.set("kategoria", key)
  return "/ogloszenia?" + p.toString()
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function pluralizeOferty(n: number): string {
  if (n === 1) return "ofert\u0119"
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
