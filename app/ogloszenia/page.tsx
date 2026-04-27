import Link from "next/link"
import Navbar from "../components/Navbar"

interface PageProps {
  searchParams: Promise<{
    marka?: string
    model?: string
    q?: string
  }>
}

export default async function OgloszeniaPage({ searchParams }: PageProps) {
  const params = await searchParams
  const marka = params.marka
  const model = params.model
  const q = params.q

  const listings: Array<{ id: string; nazwa: string; rok: string; przebieg: string; rata: string }> = []

  let title = "Wszystkie ogloszenia"
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

  const noResults = listings.length === 0

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "#f8f9fb" }}>
      <Navbar />

      <section className="px-4 sm:px-6 py-10 sm:py-12" style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e8eaed" }}>
        <div className="max-w-[1100px] mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "#1B2A4A" }}>
            {title}
          </h1>
          {filterText && (
            <p className="text-sm" style={{ color: "#888" }}>
              Znaleziono <strong>{listings.length}</strong> {pluralizeOferty(listings.length)}
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
              {listings.map((auto) => (
                <div key={auto.id} className="rounded-xl overflow-hidden" style={{ backgroundColor: "#ffffff", border: "1px solid #e8eaed" }}>
                  <div className="h-44" style={{ backgroundColor: "#e8eaed" }} />
                  <div className="p-4">
                    <div className="text-base font-bold" style={{ color: "#1B2A4A" }}>{auto.nazwa}</div>
                    <div className="text-[13px]" style={{ color: "#888" }}>{auto.rok}</div>
                    <div className="text-[22px] font-bold mt-2" style={{ color: "#1B2A4A" }}>
                      {auto.rata} zl <span className="text-[13px] font-normal" style={{ color: "#888" }}>/msc</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="px-4 sm:px-6 py-8 sm:py-10" style={{ backgroundColor: "#1B2A4A" }}>
        <div className="max-w-[1100px] mx-auto text-center text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          (c) 2026 Fidens. Wszelkie prawa zastrzezone.
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
        Nie mamy aktualnie tego pojazdu w ofercie, ale mozesz o niego zapytac &mdash;
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
          Lub zobacz wszystkie dostepne oferty
        </Link>
      </div>
    </div>
  )
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function pluralizeOferty(n: number): string {
  if (n === 1) return "oferte"
  if (n >= 2 && n <= 4) return "oferty"
  return "ofert"
}
