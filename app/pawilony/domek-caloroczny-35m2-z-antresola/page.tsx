import Link from "next/link";
import Navbar from "../../components/Navbar";
import Carousel from "../../components/Carousel";
import PawilonCalculator from "../../components/PawilonCalculator";

export const metadata = {
  title: "Domek całoroczny 35m² z antresolą | Pawilony Fidens.pl",
  description:
    "Domek całoroczny 35m² z antresolą, salonem z aneksem kuchennym, dwiema sypialniami i łazienką. Realizacja z płyty warstwowej — sprawdź ratę w leasingu.",
};

const SLUG = "domek-caloroczny-35m2-z-antresola";
const NAZWA = "Domek całoroczny 35m² z antresolą";
const CENA = 158000;

const zdjecia = [
  { url: `/pawilony/${SLUG}/1.jpg`, position: 0 },
  { url: `/pawilony/${SLUG}/2.jpg`, position: 1 },
  { url: `/pawilony/${SLUG}/3.jpg`, position: 2 },
  { url: `/pawilony/${SLUG}/4.jpg`, position: 3 },
  { url: `/pawilony/${SLUG}/5.jpg`, position: 4 },
  { url: `/pawilony/${SLUG}/6.jpg`, position: 5 },
];

const wyposazenie = [
  "Antresola",
  "Przestronny salon z gotowym aneksem kuchennym",
  "W pełni wykończona łazienka",
  "Dwie komfortowe sypialnie",
  "Klimatyzacja",
  "Taras",
  "Nowoczesna elewacja",
];

const zastosowania = [
  "Dom całoroczny",
  "Domek rekreacyjny",
  "Inwestycja pod wynajem",
  "Biuro lub obiekt usługowy",
];

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
                  <dd className="text-sm font-semibold" style={{ color: "#1B2A4A" }}>10m &times; 3,5m</dd>
                </div>
                <div className="flex justify-between border-b pb-2" style={{ borderColor: "#f0f0f0" }}>
                  <dt className="text-sm" style={{ color: "#888" }}>Powierzchnia</dt>
                  <dd className="text-sm font-semibold" style={{ color: "#1B2A4A" }}>35 m&sup2;</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: "#ffffff", border: "1px solid #e8eaed" }}>
              <h2 className="text-lg font-bold mb-3" style={{ color: "#1B2A4A" }}>Wyposażenie</h2>
              <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "#555" }}>
                {wyposazenie.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl p-6" style={{ backgroundColor: "#ffffff", border: "1px solid #e8eaed" }}>
              <h2 className="text-lg font-bold mb-3" style={{ color: "#1B2A4A" }}>Sprawdza się jako</h2>
              <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "#555" }}>
                {zastosowania.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="text-sm mt-4" style={{ color: "#aaa" }}>
                Każdy projekt wyceniamy indywidualnie i dopasowujemy do oczekiwań klienta. Podana
                cena ma charakter orientacyjny.
              </p>
            </div>
          </div>

          <aside className="lg:sticky lg:top-20 lg:self-start">
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



