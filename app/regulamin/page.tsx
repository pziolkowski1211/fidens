import Navbar from "../components/Navbar";

export const metadata = {
  title: "Regulamin | Fidens.pl",
  description: "Regulamin korzystania z serwisu Fidens.pl.",
};

function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ backgroundColor: "#FFF3B0", padding: "0 4px", borderRadius: "3px", fontWeight: 600 }}>
      {children}
    </span>
  );
}

export default function RegulaminPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#f8f9fb" }}>
      <Navbar />

      <section className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center" style={{ color: "#1B2A4A" }}>
          Regulamin
        </h1>

        <div className="prose max-w-none" style={{ color: "#374151" }}>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: "#1B2A4A" }}>§1 Postanowienia ogólne</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Niniejszy Regulamin określa zasady korzystania z serwisu internetowego dostępnego pod adresem fidens.pl (dalej: &quot;Serwis&quot;).</li>
            <li>
              Właścicielem i administratorem Serwisu jest <Placeholder>[NAZWA SPÓŁKI]</Placeholder> Sp. z o.o. z siedzibą w{" "}
              <Placeholder>[MIASTO]</Placeholder>, ul. <Placeholder>[ADRES]</Placeholder>, NIP: <Placeholder>[NIP]</Placeholder>,
              REGON: <Placeholder>[REGON]</Placeholder>, wpisana do Krajowego Rejestru Sądowego pod numerem KRS:{" "}
              <Placeholder>[KRS]</Placeholder> (dalej: &quot;Fidens&quot; lub &quot;Usługodawca&quot;).
            </li>
            <li>Kontakt z Usługodawcą możliwy jest pod adresem e-mail: kontakt@fidens.pl.</li>
          </ol>

          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: "#1B2A4A" }}>§2 Definicje</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li><strong>Serwis</strong> — strona internetowa fidens.pl wraz z wszystkimi jej podstronami i funkcjonalnościami.</li>
            <li><strong>Użytkownik</strong> — każda osoba korzystająca z Serwisu.</li>
            <li><strong>Ogłoszenie</strong> — prezentacja pojazdu, maszyny lub innego przedmiotu dostępnego do sfinansowania, pochodząca od zewnętrznego dostawcy (salonu, komisu, firmy handlowej).</li>
            <li><strong>Zapytanie</strong> — formularz kontaktowy wypełniany przez Użytkownika w celu uzyskania informacji o możliwości finansowania danego przedmiotu.</li>
          </ol>

          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: "#1B2A4A" }}>§3 Charakter i zakres usług</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Fidens prowadzi działalność pośrednictwa w zakresie pozyskiwania finansowania (leasing operacyjny, pożyczka leasingowa) dla przedsiębiorców zainteresowanych pojazdami, maszynami budowlanymi i innymi przedmiotami prezentowanymi w Serwisie.</li>
            <li>Fidens nie jest instytucją finansową, bankiem ani firmą leasingową — pośredniczy w kontakcie między Użytkownikiem a bankami i instytucjami leasingowymi, z którymi współpracuje.</li>
            <li>Przedmioty prezentowane w Ogłoszeniach pochodzą od zewnętrznych dostawców. Fidens weryfikuje dokumentację i historię przedmiotu przed publikacją Ogłoszenia, jednak nie jest sprzedawcą ani właścicielem prezentowanych przedmiotów.</li>
            <li>Kalkulator dostępny przy Ogłoszeniach ma charakter wyłącznie orientacyjny i nie stanowi oferty w rozumieniu Kodeksu cywilnego. Ostateczne warunki finansowania ustalane są indywidualnie z bankiem lub instytucją leasingową.</li>
            <li>Serwis skierowany jest do przedsiębiorców korzystających z Serwisu w związku z prowadzoną działalnością gospodarczą.</li>
          </ol>

          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: "#1B2A4A" }}>§4 Zasady korzystania z Serwisu</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Korzystanie z Serwisu jest bezpłatne.</li>
            <li>Do korzystania z Serwisu niezbędne jest urządzenie z dostępem do Internetu oraz przeglądarką internetową.</li>
            <li>Wysyłając Zapytanie, Użytkownik oświadcza, że podane przez niego dane są prawdziwe i aktualne.</li>
            <li>Zabronione jest dostarczanie przez Użytkownika treści o charakterze bezprawnym.</li>
          </ol>

          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: "#1B2A4A" }}>§5 Odpowiedzialność</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Fidens dokłada starań, aby informacje prezentowane w Serwisie były aktualne i rzetelne, jednak nie gwarantuje dostępności konkretnego przedmiotu ani uzyskania finansowania na warunkach wskazanych w kalkulatorze.</li>
            <li>Fidens nie ponosi odpowiedzialności za działania banków i instytucji leasingowych, w tym za decyzje dotyczące przyznania finansowania.</li>
            <li>Fidens nie ponosi odpowiedzialności za przerwy w działaniu Serwisu wynikające z przyczyn technicznych niezależnych od Usługodawcy.</li>
          </ol>

          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: "#1B2A4A" }}>§6 Reklamacje</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Reklamacje dotyczące funkcjonowania Serwisu można zgłaszać na adres e-mail: kontakt@fidens.pl.</li>
            <li>Usługodawca rozpatruje reklamację w terminie 14 dni od jej otrzymania.</li>
          </ol>

          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: "#1B2A4A" }}>§7 Ochrona danych osobowych</h2>
          <p>Zasady przetwarzania danych osobowych określa odrębny dokument — Polityka Prywatności, dostępna pod adresem fidens.pl/polityka.</p>

          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: "#1B2A4A" }}>§8 Postanowienia końcowe</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Usługodawca zastrzega sobie prawo do zmiany Regulaminu. Zmieniony Regulamin wchodzi w życie z dniem publikacji w Serwisie.</li>
            <li>W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie mają przepisy prawa polskiego.</li>
            <li>Regulamin obowiązuje od dnia <Placeholder>[DATA]</Placeholder>.</li>
          </ol>
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
