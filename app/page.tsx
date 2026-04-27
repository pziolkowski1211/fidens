import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#f8f9fb" }}>

      <Navbar />

      {/* HERO */}
      <section style={{ backgroundColor: "#1B2A4A" }} className="px-4 sm:px-6 py-12 sm:py-16 lg:py-20 text-center">
        <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
          Finansowanie pojazdow<br className="hidden sm:inline" />
          <span className="sm:hidden"> </span>i maszyn budowlanych
        </h1>
        <p className="text-white/60 text-base sm:text-lg mb-4 px-4">
          Leasing, kredyt, wynajem &mdash; szybka decyzja kredytowa.<br className="hidden sm:inline" />
          <span className="sm:hidden"> </span>Ty wybierasz pojazd, my zajmujemy sie reszta.
        </p>
      </section>

      {/* OGLOSZENIE TYGODNIA */}
      <section className="px-4 sm:px-6 py-10 sm:py-12" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "#1B2A4A" }}>Ogloszenie tygodnia</h2>
            <span className="text-[11px] font-bold py-[3px] px-[10px] rounded-full" style={{ backgroundColor: "#F0A500", color: "#1B2A4A" }}>
              Wyroznione
            </span>
          </div>

          <div className="rounded-xl overflow-hidden flex flex-col lg:flex-row" style={{ backgroundColor: "#f8f9fb", border: "1px solid #e8eaed" }}>
            {/* Zdjecie */}
            <div className="w-full lg:w-[400px] h-48 sm:h-64 lg:h-auto flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: "#e8eaed" }}>
              <span className="text-sm" style={{ color: "#aaa" }}>Zdjecie pojazdu</span>
            </div>

            {/* Tresc */}
            <div className="p-6 sm:p-8 flex flex-col">
              <div className="text-[11px] font-bold py-[3px] px-[10px] rounded-[3px] inline-block mb-3 self-start" style={{ backgroundColor: "#F0A500", color: "#1B2A4A" }}>
                Ogloszenie tygodnia
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-[28px] font-bold mb-2" style={{ color: "#1B2A4A" }}>
                BMW 5 Series 530d xDrive
              </h3>
              <p className="text-sm mb-5" style={{ color: "#888" }}>
                2022 &middot; 68 000 km &middot; Diesel &middot; Automat &middot; Salon Polska
              </p>
              <div className="text-[28px] sm:text-3xl lg:text-[36px] font-bold mb-1" style={{ color: "#1B2A4A" }}>
                1 890 zl <span className="text-base font-normal" style={{ color: "#888" }}>/miesiac</span>
              </div>
              <p className="text-xs mb-5" style={{ color: "#bbb" }}>Cena pojazdu dostepna po kontakcie</p>
              <button className="font-bold rounded-lg py-3.5 px-6 sm:px-8 text-sm sm:text-[15px] border-none cursor-pointer self-start hover:opacity-90 transition-opacity" style={{ backgroundColor: "#F0A500", color: "#1B2A4A" }}>
                Sprawdz oferte &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* NAJNOWSZE OFERTY */}
      <section className="px-4 sm:px-6 py-10 sm:py-12">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "#1B2A4A" }}>Najnowsze oferty</h2>
            <a href="/ogloszenia" className="text-sm font-semibold" style={{ color: "#F0A500" }}>
              Zobacz wszystkie &rarr;
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { nazwa: "Audi A6 40 TDI", rok: "2021", przebieg: "95 000 km", rata: "1 490", badge: "Nowe" },
              { nazwa: "Volvo FH 500", rok: "2020", przebieg: "410 000 km", rata: "3 200", badge: "Nowe" },
              { nazwa: "Caterpillar 320", rok: "2019", przebieg: "Koparka", rata: "4 100", badge: "Promocja" },
            ].map((auto) => (
              <div key={auto.nazwa} className="rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" style={{ backgroundColor: "#ffffff", border: "1px solid #e8eaed" }}>
                <div className="h-44 sm:h-48 flex items-center justify-center" style={{ backgroundColor: "#e8eaed" }}>
                  <span className="text-sm" style={{ color: "#aaa" }}>Zdjecie pojazdu</span>
                </div>
                <div className="p-4">
                  <div className="text-[10px] py-0.5 px-2 rounded-[3px] inline-block mb-2"
                    style={{
                      backgroundColor: auto.badge === "Promocja" ? "#fff3e0" : "#e8f4e8",
                      color: auto.badge === "Promocja" ? "#e65100" : "#2a7a2a"
                    }}>
                    {auto.badge}
                  </div>
                  <div className="text-base font-bold mb-1" style={{ color: "#1B2A4A" }}>{auto.nazwa}</div>
                  <div className="text-[13px] mb-3" style={{ color: "#888" }}>{auto.rok} &middot; {auto.przebieg}</div>
                  <div className="text-[22px] font-bold" style={{ color: "#1B2A4A" }}>
                    {auto.rata} zl <span className="text-[13px] font-normal" style={{ color: "#888" }}>/msc</span>
                  </div>
                  <button className="mt-3 w-full text-white py-2.5 rounded-md text-[13px] font-semibold border-none cursor-pointer hover:opacity-90 transition-opacity" style={{ backgroundColor: "#1B2A4A" }}>
                    Sprawdz oferte
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JAK TO DZIALA */}
      <section className="px-4 sm:px-6 py-12 sm:py-16" style={{ backgroundColor: "#1B2A4A" }}>
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-white text-2xl sm:text-3xl font-bold text-center mb-10 sm:mb-12">
            Jak to dziala?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-4">
            {[
              { nr: "1", tekst: "Zloz wniosek online" },
              { nr: "2", tekst: "Decyzja w 60 minut" },
              { nr: "3", tekst: "Podpisz umowe" },
              { nr: "4", tekst: "Wplac oplate wstepna" },
              { nr: "5", tekst: "Rejestrujemy i ubezpieczamy" },
              { nr: "6", tekst: "Pojazd gotowy do drogi" },
            ].map((krok) => (
              <div key={krok.nr} className="text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold"
                  style={{ backgroundColor: "#F0A500", color: "#1B2A4A" }}>
                  {krok.nr}
                </div>
                <div className="text-[13px] leading-snug" style={{ color: "rgba(255,255,255,0.85)" }}>
                  {krok.tekst}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OPINIE */}
      <section className="px-4 sm:px-6 py-12 sm:py-16" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 sm:mb-12" style={{ color: "#1B2A4A" }}>
            Opinie klientow
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { tekst: "Ekspresowa decyzja, zero stresu. Polecam kazdemu przedsiebiorcy.", imie: "Marek K.", miasto: "Warszawa" },
              { tekst: "Wszystko zalatwione w jeden dzien. Auto stalo pod domem nastepnego dnia.", imie: "Tomasz W.", miasto: "Krakow" },
              { tekst: "Profesjonalne podejscie, najlepsza oferta leasingu jaka znalazlem.", imie: "Anna P.", miasto: "Wroclaw" },
            ].map((opinia) => (
              <div key={opinia.imie} className="rounded-xl p-6" style={{ backgroundColor: "#f8f9fb", border: "1px solid #e8eaed" }}>
                <div className="text-lg mb-3" style={{ color: "#F0A500" }}>&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <p className="text-sm leading-relaxed mb-4 italic" style={{ color: "#555" }}>
                  &quot;{opinia.tekst}&quot;
                </p>
                <div className="text-[13px] font-semibold" style={{ color: "#1B2A4A" }}>
                  {opinia.imie}, {opinia.miasto}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STOPKA */}
      <footer className="px-4 sm:px-6 py-8 sm:py-10" style={{ backgroundColor: "#1B2A4A" }}>
        <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-xl font-bold tracking-widest" style={{ color: "#F0A500" }}>FIDENS</div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            <a href="/o-nas" className="text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>O mnie</a>
            <a href="/kontakt" className="text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>Kontakt</a>
            <a href="/regulamin" className="text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>Regulamin</a>
            <a href="/polityka" className="text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>Polityka prywatnosci</a>
          </div>
          <div className="text-xs text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
            (c) 2026 Fidens. Wszelkie prawa zastrzezone.
          </div>
        </div>
      </footer>

    </main>
  );
}
