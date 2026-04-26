import Image from "next/image"
import Link from "next/link"
import SearchAutocomplete from "../components/SearchAutocomplete"

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
    <main className="min-h-screen" style={{ backgroundColor: "#f8f9fb" }}>
      <nav style={{ backgroundColor: "#1B2A4A" }} className="px-6 py-4 relative flex items-center">
        <Link href="/" className="flex items-center" style={{ width: "180px" }}>
          <Image src="/jasne.png" alt="Fidens" width={300} height={200} style={{ height: "55px", width: "auto" }} priority />
        </Link>

        <div className="absolute left-1/2 -translate-x-1/2">
          <SearchAutocomplete variant="desktop" />
        </div>

        <div className="ml-auto flex items-center gap-8">
          <Link href="/leasing" style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}>Jak dziala leasing</Link>
          <Link href="/o-nas" style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}>O nas</Link>
          <Link href="/kontakt" style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}>Kontakt</Link>
        </div>
      </nav>

      <section className="px-6 py-12" style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e8eaed" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "32px", fontWeight: 700, color: "#1B2A4A", marginBottom: "8px" }}>
            {title}
          </h1>
          {filterText && (
            <p style={{ fontSize: "14px", color: "#888" }}>
              Znaleziono <strong>{listings.length}</strong> {pluralizeOferty(listings.length)}
            </p>
          )}
        </div>
      </section>

      <section className="px-6 py-12">
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          {noResults ? (
            <BrakOfert filterText={filterText} marka={marka} model={model} />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
              {listings.map((auto) => (
                <div key={auto.id} style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e8eaed", overflow: "hidden" }}>
                  <div style={{ height: "180px", backgroundColor: "#e8eaed" }} />
                  <div style={{ padding: "16px" }}>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: "#1B2A4A" }}>{auto.nazwa}</div>
                    <div style={{ fontSize: "13px", color: "#888" }}>{auto.rok}</div>
                    <div style={{ fontSize: "22px", fontWeight: 700, color: "#1B2A4A", marginTop: "8px" }}>
                      {auto.rata} zl <span style={{ fontSize: "13px", color: "#888", fontWeight: 400 }}>/msc</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer style={{ backgroundColor: "#1B2A4A" }} className="px-6 py-10 mt-auto">
        <div style={{ maxWidth: "1100px", margin: "0 auto", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>
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
    <div style={{
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      border: "1px solid #e8eaed",
      padding: "64px 32px",
      textAlign: "center",
      maxWidth: "600px",
      margin: "0 auto",
    }}>
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>&#128269;</div>
      <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#1B2A4A", marginBottom: "12px" }}>
        Brak ofert{filterText && " dla"} {filterText && <span style={{ color: "#F0A500" }}>{filterText}</span>}
      </h2>
      <p style={{ fontSize: "15px", color: "#666", lineHeight: "1.6", marginBottom: "24px" }}>
        Nie mamy aktualnie tego pojazdu w ofercie, ale mozesz o niego zapytac &mdash;
        <br />sprowadzimy go specjalnie dla Ciebie.
      </p>
      <Link
        href={kontaktUrl}
        style={{
          backgroundColor: "#F0A500",
          color: "#1B2A4A",
          padding: "14px 32px",
          borderRadius: "8px",
          fontSize: "15px",
          fontWeight: 700,
          textDecoration: "none",
          display: "inline-block",
        }}
      >
        Zapytaj o ten pojazd &rarr;
      </Link>
      <div style={{ marginTop: "24px" }}>
        <Link href="/ogloszenia" style={{ color: "#888", fontSize: "13px", textDecoration: "underline" }}>
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
