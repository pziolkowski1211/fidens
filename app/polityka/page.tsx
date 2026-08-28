import Navbar from "../components/Navbar";

export const metadata = {
  title: "Polityka prywatnosci | Fidens.pl",
  description: "Polityka prywatnosci serwisu Fidens.pl - zasady przetwarzania danych osobowych.",
};

function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ backgroundColor: "#FFF3B0", padding: "0 4px", borderRadius: "3px", fontWeight: 600 }}>
      {children}
    </span>
  );
}

export default function PolitykaPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#f8f9fb" }}>
      <Navbar />

      <section className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center" style={{ color: "#1B2A4A" }}>
          Polityka prywatności
        </h1>

        <div className="prose max-w-none" style={{ color: "#374151" }}>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: "#1B2A4A" }}>§1 Administrator danych</h2>
          <p>
            Administratorem danych osobowych zbieranych za pośrednictwem Serwisu fidens.pl jest{" "}
            <Placeholder>[NAZWA SPÓŁKI]</Placeholder> Sp. z o.o. z siedzibą w <Placeholder>[MIASTO]</Placeholder>, ul.{" "}
            <Placeholder>[ADRES]</Placeholder>, NIP: <Placeholder>[NIP]</Placeholder>, KRS: <Placeholder>[KRS]</Placeholder>.
            Kontakt w sprawach danych osobowych: kontakt@fidens.pl.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: "#1B2A4A" }}>§2 Jakie dane zbieramy</h2>
          <p>Za pośrednictwem formularza kontaktowego zbieramy wyłącznie:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>imię i nazwisko,</li>
            <li>NIP,</li>
            <li>numer telefonu,</li>
            <li>adres e-mail.</li>
          </ul>
          <p>
            Fidens <strong>nie zbiera</strong> danych wrażliwych (np. numeru PESEL, numeru dowodu osobistego, danych
            finansowych, danych współmałżonka). Dane te, jeśli są wymagane do złożenia wniosku o finansowanie,
            przekazywane są bezpośrednio bankowi lub instytucji leasingowej, zgodnie z ich własnymi zasadami przetwarzania danych.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: "#1B2A4A" }}>§3 Cel i podstawa prawna przetwarzania</h2>
          <p>Dane przetwarzane są w celu:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>udzielenia odpowiedzi na Zapytanie i przedstawienia informacji o możliwościach finansowania — podstawa prawna: art. 6 ust. 1 lit. b RODO (działania podejmowane przed zawarciem umowy, na żądanie osoby, której dane dotyczą),</li>
            <li>kontaktu zwrotnego oraz obsługi zgłoszenia — podstawa prawna: art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes administratora).</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: "#1B2A4A" }}>§4 Odbiorcy danych</h2>
          <p>Dane mogą być przekazywane:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>bankom i instytucjom leasingowym, z którymi Fidens współpracuje — w celu realizacji Zapytania o finansowanie,</li>
            <li>dostawcom usług technicznych obsługujących Serwis (hosting, baza danych, wysyłka e-maili) — działającym jako podmioty przetwarzające na zlecenie Fidens.</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: "#1B2A4A" }}>§5 Okres przechowywania danych</h2>
          <p>Dane przechowywane są przez okres niezbędny do obsługi Zapytania, a następnie przez okres wynikający z przepisów prawa (np. przedawnienia roszczeń) lub do momentu wniesienia sprzeciwu.</p>

          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: "#1B2A4A" }}>§6 Prawa osoby, której dane dotyczą</h2>
          <p>
            Przysługuje Ci prawo do: dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania,
            przenoszenia danych oraz wniesienia sprzeciwu wobec przetwarzania. Przysługuje Ci również prawo wniesienia
            skargi do Prezesa Urzędu Ochrony Danych Osobowych.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: "#1B2A4A" }}>§7 Pliki cookies</h2>
          <p>
            Serwis wykorzystuje wyłącznie pliki cookies niezbędne do jego prawidłowego działania (np. utrzymanie sesji
            w panelu administracyjnym). Serwis <strong>nie wykorzystuje obecnie</strong> narzędzi analitycznych ani reklamowych.
          </p>
          <p className="italic">
            W przypadku wdrożenia takich narzędzi w przyszłości (np. Google Analytics, Meta Pixel), niniejsza Polityka
            zostanie zaktualizowana, a zgoda Użytkownika zostanie pobrana przed uruchomieniem tych narzędzi, zgodnie
            z obowiązującymi przepisami.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: "#1B2A4A" }}>§8 Bezpieczeństwo danych</h2>
          <p>Fidens stosuje odpowiednie środki techniczne i organizacyjne w celu ochrony danych osobowych przed nieuprawnionym dostępem, utratą lub zniszczeniem.</p>

          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: "#1B2A4A" }}>§9 Zmiany Polityki</h2>
          <p>
            Fidens zastrzega sobie prawo do zmiany niniejszej Polityki Prywatności. Aktualna wersja zawsze dostępna
            jest pod adresem fidens.pl/polityka.
          </p>
          <p>Polityka obowiązuje od dnia <Placeholder>[DATA]</Placeholder>.</p>
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
