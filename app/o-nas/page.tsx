import Link from "next/link";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Dlaczego Fidens? | Fidens.pl",
  description:
    "Fidens to wyselekcjonowane pojazdy i maszyny budowlane oraz elastyczne finansowanie dopasowane do Twoich potrzeb.",
};

export default function ONasPage() {
  const benefits = [
    {
      title: "Sprawdzeni dostawcy, zweryfikowane pojazdy",
      text: "Współpracujemy wyłącznie ze sprawdzonymi salonami, komisami i firmami handlowymi, a każdy pojazd i maszyna przechodzi weryfikację dokumentów i historii przed publikacją oferty.",
    },
    {
      title: "Finansowanie dopasowane do Ciebie",
      text: "Leasing lub pożyczka, dobrane do Twojej sytuacji.",
    },
    {
      title: "Szeroka współpraca z bankami",
      text: "Współpracujemy z największymi bankami i instytucjami leasingowymi w Polsce.",
    },
    {
      title: "Kompleksowa obsługa od A do Z",
      text: "Ubezpieczenie, GAP, rejestracja pojazdu — zajmujemy się formalnościami, żebyś Ty nie musiał.",
    },
    {
      title: "Osobisty kontakt",
      text: "Prowadzimy Twoją sprawę od pierwszego kontaktu do podpisania umowy i jesteśmy dostępni, gdy pojawią się pytania.",
    },
  ];

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#f8f9fb" }}>
      <Navbar />

      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#1B2A4A" }}>
          Dlaczego Fidens?
        </h1>
        <p className="text-base md:text-lg text-gray-700">
          Fidens to miejsce z wyselekcjonowanymi, starannie dobranymi pojazdami i maszynami budowlanymi.
          Współpracujemy z największymi bankami w Polsce, dzięki czemu oferujemy elastyczne i korzystne
          warunki finansowania.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-16">
        <div className="grid gap-6">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-xl p-6 bg-white"
              style={{ border: "1px solid #e8eaed" }}
            >
              <h2 className="text-lg font-semibold mb-2" style={{ color: "#1B2A4A" }}>
                {b.title}
              </h2>
              <p className="text-gray-600 text-sm md:text-base">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-20 text-center">
        <h2 className="text-2xl font-bold mb-6" style={{ color: "#1B2A4A" }}>
          Gotowy, by zacząć?
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/ogloszenia"
            className="px-6 py-3 rounded-lg font-semibold text-white text-center"
            style={{ backgroundColor: "#1B2A4A" }}
          >
            Zobacz ogłoszenia
          </Link>
          <Link
            href="/kontakt"
            className="px-6 py-3 rounded-lg font-semibold text-center"
            style={{ backgroundColor: "#F0A500", color: "#1B2A4A" }}
          >
            Skontaktuj się z nami
          </Link>
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
