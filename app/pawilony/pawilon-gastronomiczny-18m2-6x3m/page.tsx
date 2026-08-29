import Link from "next/link";
import Navbar from "../../components/Navbar";
import Carousel from "../../components/Carousel";
import PawilonCalculator from "../../components/PawilonCalculator";

export const metadata = {
  title: "Pawilon gastronomiczny 18m² (6x3m) | Pawilony Fidens.pl",
  description:
    "Pawilon gastronomiczny 18m², wymiary 6x3m. Realizacja z płyty warstwowej — sprawdź szczegóły i orientacyjną ratę w leasingu.",
};

const SLUG = "pawilon-gastronomiczny-18m2-6x3m";
const NAZWA = "Pawilon gastronomiczny 18m²";
const CENA = 81000;

const zdjecia = [
  { url: `/pawilony/${SLUG}/1.jpg`, position: 0 },
  { url: `/pawilony/${SLUG}/2.jpg`, position: 1 },
  { url: `/pawilony/${SLUG}/3.jpg`, position: 2 },
  { url: `/pawilony/${SLUG}/4.jpg`, position: 3 },
];

function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ backgroundColor: "#FFF3B0", padding: "0 4px", borderRadius: "3px", fontWeight: 600 }}>
      {children}
    </span>
  );
}

export default function PawilonPage() {
  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "#f8f9fb" }}>
      <Navbar />

      <div className="px-4 sm:px-6 pt-5 pb-3" style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e8eaed" }}>
        <div className="max-w-[1100px] mx-auto flex items-center flex-wrap gap-2 text-sm">
          <Link href="/" className="transition-colors hover:text-[#F0A500]" style={{ color: "#888" }}>Strona główna</Link>
          <span style={{ color: "#ccc" }}>&rsaquo;</span>
          <Link href="/pawilony" className="transition-colors hover:text-[#F0A500]" style={{ color: "#888" }}>Pawilony</Link>
          <span style={{ color: "#ccc" }}>&rsaquo;</span>
          <span className="font-semibold" style={{ color: "#1B2A4A" }}>{NAZWA}</span>
        </div>
      </div>

      <section className="px-4 sm:px-6 py-8 sm:py-10 flex-1">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: "#1B2A4A" }}>{NAZWA}</h1>

            <Carousel images={zdjecia} alt={NAZWA} />

            <div className="rounded-xl p-6 mb-6 mt-6" style={{ backgroundColor: "#ffffff", border: "1px solid #e8eaed" }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: "#1B2A4A" }}>Dane obiektu</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                <div className="flex justify-between border-b pb-2" style={{ borderColor: "#f0f0f0" }}>
                  <dt className="text-sm" style={{ color: "#888" }}>Wymiary</dt>
                  <dd className="text-sm font-semibold" style={{ color: "#1B2A4A" }}>6m &times; 3m</dd>
                </div>
                <div className="flex justify-between border-b pb-2" style={{ borderColor: "#f0f0f0" }}>
                  <dt className="text-sm" style={{ color: "#888" }}>Powierzchnia</dt>
                  <dd className="text-sm font-semibold" style={{ color: "#1B2A4A" }}>18 m&sup2;</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: "#ffffff", border: "1px solid #e8eaed" }}>
              <h2 className="text-lg font-bold mb-3" style={{ color: "#1B2A4A" }}>Wyposażenie</h2>
              <p className="text-[15px]" style={{ color: "#555" }}>
                <Placeholder>[DO UZUPEŁNIENIA - lista wyposażenia]</Placeholder>
              </p>
            </div>

            <div className="rounded-xl p-6" style={{ backgroundColor: "#ffffff", border: "1px solid #e8eaed" }}>
              <h2 className="text-lg font-bold mb-3" style={{ color: "#1B2A4A" }}>Sprawdza się jako</h2>
              <p className="text-[15px]" style={{ color: "#555" }}>
                <Placeholder>[DO UZUPEŁNIENIA - zastosowania]</Placeholder>
              </p>
              <p className="text-sm mt-4" style={{ color: "#aaa" }}>
                Każdy projekt wyceniamy indywidualnie i dopasowujemy do oczekiwań klienta. Podana
                cena ma charakter orientacyjny.
              </p>
            </div>
          </div>

          <aside className="lg:sticky lg:top-20 lg:self-start">
            <p className="text-xs mb-2 p-2 rounded" style={{ backgroundColor: "#FFF3B0", color: "#1B2A4A" }}>
              <strong>[UWAGA: cena poniżej to placeholder — {CENA.toLocaleString("pl-PL")} zł — podmień na realną wartość przed promowaniem strony]</strong>
            </p>
            <div className="rounded-xl p-6" style={{ backgroundColor: "#ffffff", border: "1px solid #e8eaed" }}>
              <PawilonCalculator price={CENA} slug={SLUG} brand="Pawilon" model={NAZWA} />
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
  );
}
