import Link from "next/link";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Pawilony i kontenery na zamówienie z płyty warstwowej | Fidens.pl",
  description:
    "Szeroki wybór pawilonów i kontenerów, spersonalizowanych pod Twoje potrzeby. Domy modułowe, pawilony biurowe i gastronomiczne z finansowaniem w leasingu lub pożyczce.",
};

export default function PawilonyPage() {
  const realizacje = [
    {
      slug: "domek-caloroczny-35m2-z-antresola",
      nazwa: "Domek całoroczny 35m² z antresolą",
      kategoria: "Dom całoroczny",
      wymiary: "10m × 3,5m",
      powierzchnia: "35 m²",
      cena: "158 000 zł brutto",
      cenaPlaceholder: false,
      zdjecie: "/pawilony/domek-caloroczny-35m2-z-antresola/1.jpg",
    },
    {
      slug: "dom-modulowy-40m2-10x4m",
      nazwa: "Dom modułowy 40m²",
      kategoria: "Dom modułowy",
      wymiary: "10m × 4m",
      powierzchnia: "40 m²",
      cena: "150 000 zł brutto",
      cenaPlaceholder: true,
      zdjecie: "/pawilony/dom-modulowy-40m2-10x4m/1.jpg",
    },
    {
      slug: "pawilon-biurowy-24m2-8x3m",
      nazwa: "Pawilon modułowy 24m²",
      kategoria: "Pawilon modułowy",
      wymiary: "8m × 3m",
      powierzchnia: "24 m²",
      cena: "108 000 zł brutto",
      cenaPlaceholder: true,
      zdjecie: "/pawilony/pawilon-biurowy-24m2-8x3m/1.jpg",
    },
    {
      slug: "pawilon-gastronomiczny-18m2-6x3m",
      nazwa: "Pawilon gastronomiczny 18m²",
      kategoria: "Pawilon gastronomiczny",
      wymiary: "6m × 3m",
      powierzchnia: "18 m²",
      cena: "81 000 zł brutto",
      cenaPlaceholder: true,
      zdjecie: "/pawilony/pawilon-gastronomiczny-18m2-6x3m/1.jpg",
    },
    {
      slug: "domek-modulowy-42m2-elewacja-palisandrowa",
      nazwa: "Domek modułowy 42m² z elewacją palisandrową",
      kategoria: "Domek modułowy",
      wymiary: "7m × 6m",
      powierzchnia: "42 m²",
      cena: "190 000 zł brutto",
      cenaPlaceholder: true,
      zdjecie: "/pawilony/domek-modulowy-42m2-elewacja-palisandrowa/1.jpg",
    },
  ];

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#f8f9fb" }}>
      <Navbar />

      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#1B2A4A" }}>
          Pawilony i kontenery na zamówienie
        </h1>
        <p className="text-base md:text-lg text-gray-700">
          Szeroki wybór pawilonów i kontenerów modułowych, w pełni spersonalizowanych pod Twoje
          potrzeby. Jaki projekt sobie wymarzysz — taki zrealizujemy i wycenimy. Poniżej przykładowe
          realizacje wraz z orientacyjną wyceną.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {realizacje.map((r) => (
            <Link
              key={r.slug}
              href={`/pawilony/${r.slug}`}
              className="group rounded-xl overflow-hidden bg-white block transition-all duration-300 hover:-translate-y-1"
              style={{ border: "1px solid #e8eaed", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
            >
              <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                <img
                  src={r.zdjecie}
                  alt={r.nazwa}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span
                  className="absolute top-3 left-3 text-[11px] font-bold px-3 py-1 rounded-full"
                  style={{ backgroundColor: "#1B2A4A", color: "#fff" }}
                >
                  {r.kategoria}
                </span>
              </div>
              <div className="p-4">
                <h2 className="text-lg font-bold mb-2" style={{ color: "#1B2A4A" }}>
                  {r.nazwa}
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-1.5">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F0A500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 3H3v18h18V3z"></path>
                      <path d="M3 9h18"></path>
                      <path d="M9 21V9"></path>
                    </svg>
                    {r.wymiary}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F0A500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                    </svg>
                    {r.powierzchnia}
                  </span>
                </div>
                <div className="text-xs mb-1.5" style={{ color: "#888" }}>
                  Cena orientacyjna
                </div>
                <div
                  className="inline-block text-base font-bold px-3 py-1.5 rounded-lg"
                  style={
                    r.cenaPlaceholder
                      ? { backgroundColor: "#FFF3B0", color: "#1B2A4A" }
                      : { backgroundColor: "#FFF8E8", color: "#1B2A4A" }
                  }
                >
                  od {r.cena}
                </div>
              </div>
            </Link>
          ))}

          <div
            className="rounded-xl overflow-hidden bg-white flex flex-col items-center justify-center text-center p-6 transition-all duration-300 hover:-translate-y-1"
            style={{ border: "2px dashed #F0A500" }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: "#FFF3B0" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F0A500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"></path>
              </svg>
            </div>
            <h2 className="text-lg font-bold mb-2" style={{ color: "#1B2A4A" }}>
              Twój własny projekt
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Nie widzisz tego, czego szukasz? Zaprojektujemy i wycenimy pawilon lub kontener
              dokładnie pod Twoje potrzeby.
            </p>
            <Link
              href="/kontakt"
              className="inline-block px-6 py-3 rounded-lg font-semibold text-white no-underline hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#F0A500", color: "#1B2A4A" }}
            >
              Zapytaj o wycenę
            </Link>
          </div>
        </div>

        <p className="text-sm text-gray-500 text-center mt-8">
          Każdy projekt wyceniamy indywidualnie i dopasowujemy do oczekiwań klienta. Podane
          ceny mają charakter orientacyjny.
        </p>
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
  );
}