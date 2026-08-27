import Link from "next/link";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Leasing dla firm | Fidens.pl",
  description:
    "Sfinansuj pojazd lub inny przedmiot w leasingu operacyjnym lub pożyczce leasingowej. Fidens dobiera finansowanie dopasowane do Twojej sytuacji.",
};

export default function LeasingPage() {
  const steps = [
    {
      title: "Wybierasz przedmiot",
      text: "Przeglądasz nasze ogłoszenia i wybierasz interesujący Cię pojazd lub maszynę.",
    },
    {
      title: "Dopasowujesz parametry",
      text: "W kalkulatorze ustawiasz wpłatę, okres i wykup pod swoją sytuację.",
    },
    {
      title: "Wysyłasz zapytanie",
      text: "Kontaktujemy się z Tobą i finalizujemy formalności.",
    },
    {
      title: "Podpisujesz umowę",
      text: "My zajmujemy się resztą: ubezpieczeniem, GAP-em, rejestracją.",
    },
  ];

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#f8f9fb" }}>
      <Navbar />

      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#1B2A4A" }}>
          Leasing dla firm
        </h1>
        <p className="text-base md:text-lg text-gray-700">
          Sfinansuj pojazd lub inny przedmiot — a Fidens poprowadzi Cię przez cały proces.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold mb-4" style={{ color: "#1B2A4A" }}>
          Dlaczego leasing przez Fidens?
        </h2>
        <p className="text-gray-700 text-base md:text-lg">
          Nie zostajesz sam z formalnościami. Dobieramy finansowanie dopasowane do Twojej sytuacji,
          a po podpisaniu umowy zajmujemy się także ubezpieczeniem, GAP-em i rejestracją. Twoja firma
          zyskuje kompleksową obsługę w jednym miejscu.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold mb-4" style={{ color: "#1B2A4A" }}>
          Leasing operacyjny czy pożyczka leasingowa?
        </h2>
        <p className="text-gray-700 mb-6">
          Rodzaj finansowania zależy od tego, jak sprzedawany jest dany przedmiot oraz od Twoich preferencji:
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl p-6 bg-white" style={{ border: "1px solid #e8eaed" }}>
            <h3 className="text-lg font-semibold mb-2" style={{ color: "#1B2A4A" }}>
              Leasing operacyjny (VAT-23)
            </h3>
            <p className="text-gray-600 text-sm md:text-base">
              Klasyczny leasing z opcją wykupu na koniec umowy. Raty stanowią koszt uzyskania przychodu,
              co obniża podstawę opodatkowania firmy.
            </p>
          </div>
          <div className="rounded-xl p-6 bg-white" style={{ border: "1px solid #e8eaed" }}>
            <h3 className="text-lg font-semibold mb-2" style={{ color: "#1B2A4A" }}>
              Pożyczka leasingowa (VAT-marża)
            </h3>
            <p className="text-gray-600 text-sm md:text-base">
              Dotyczy przedmiotów sprzedawanych na zasadzie VAT-marża. Finansowanie bez opcji wykupu —
              przedmiot od razu staje się Twoją własnością.
            </p>
          </div>
        </div>
        <p className="text-gray-700 mt-6">
          Dobierzemy dla Ciebie odpowiedni wariant finansowania — dopasowany do przedmiotu i Twoich potrzeb.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold mb-6" style={{ color: "#1B2A4A" }}>
          Jak to wygląda krok po kroku
        </h2>
        <div className="grid gap-4">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="rounded-xl p-6 bg-white flex gap-4 items-start"
              style={{ border: "1px solid #e8eaed" }}
            >
              <div
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white"
                style={{ backgroundColor: "#F0A500" }}
              >
                {i + 1}
              </div>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: "#1B2A4A" }}>
                  {s.title}
                </h3>
                <p className="text-gray-600 text-sm md:text-base">{s.text}</p>
              </div>
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
