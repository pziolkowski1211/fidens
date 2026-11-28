import Link from "next/link"

// TRESC ROBOCZA - przed startem produkcyjnym do konsultacji z prawnikiem
// (zwlaszcza odpowiedzi o roli posrednika, VAT i racie orientacyjnej).
const FAQ = [
  {
    q: "Czym zajmuje się Fidens?",
    a: "Fidens pomaga firmom wybrać pojazd lub maszynę i sprawdzić możliwości ich sfinansowania, między innymi w leasingu. Pokazujemy oferty, przygotowujemy kalkulację i wspieramy w kontakcie z instytucją finansującą.",
  },
  {
    q: "Czy kalkulacja jest bezpłatna?",
    a: "Tak. Zamówienie kalkulacji nie wiąże się z kosztami po Twojej stronie. Wystarczy wypełnić formularz kontaktowy lub skorzystać z kalkulatora przy ogłoszeniu.",
  },
  {
    q: "Czy podana rata jest ostateczna?",
    a: "Nie, raty na stronie są orientacyjne. Wyliczamy je przy przykładowych założeniach (na przykład 60 miesięcy i określona wpłata własna). Ostateczna rata zależy od oferty instytucji finansującej, Twojej sytuacji i warunków umowy.",
  },
  {
    q: "Czy potrzebuję wpłaty własnej?",
    a: "To zależy od oferty finansującego, rodzaju pojazdu i Twojej sytuacji. W wyszukiwarce na stronie głównej możesz sprawdzić, jak wpłata własna wpływa na orientacyjną ratę i które ogłoszenia mieszczą się w Twoim budżecie.",
  },
  {
    q: "Jak wygląda rozliczenie VAT przy leasingu?",
    a: "Zasady zależą od rodzaju umowy, formy opodatkowania firmy i tego, czy pojazd jest sprzedawany z VAT, czy w procedurze VAT-marża. Warto skonsultować je z księgowym lub doradcą podatkowym. Chętnie pomożemy dobrać ofertę do Twojej sytuacji.",
  },
  {
    q: "Co jeszcze można sfinansować poza samochodami?",
    a: "Oprócz samochodów osobowych i dostawczych finansujemy między innymi transport ciężki, maszyny budowlane i przemysłowe oraz pawilony i domy modułowe. Szczegóły zależą od przedmiotu finansowania i instytucji finansującej.",
  },
  {
    q: "Nie widzę ogłoszenia z tym, czego szukam. Co dalej?",
    a: "Napisz do nas, a sprowadzimy sprzęt na zamówienie. Podaj markę, model i budżet, a wrócimy z propozycją.",
  },
]

export default function FaqSection() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  }

  return (
    <section
      aria-label="Najczęstsze pytania"
      className="px-4 sm:px-6 py-12 sm:py-16"
      style={{ backgroundColor: "#f8f9fb" }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-[800px] mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2" style={{ color: "#1B2A4A" }}>
          Najczęstsze pytania
        </h2>
        <p className="text-center text-[15px] mb-8 sm:mb-10" style={{ color: "#666" }}>
          Krótkie odpowiedzi na to, o co pytają nas klienci.
        </p>

        <div className="flex flex-col gap-3">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl overflow-hidden transition-shadow hover:shadow-md"
              style={{ backgroundColor: "#ffffff", border: "1px solid #e8eaed" }}
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 py-4 sm:px-6 [&::-webkit-details-marker]:hidden">
                <span className="font-bold text-[15px] sm:text-base" style={{ color: "#1B2A4A" }}>
                  {item.q}
                </span>
                <span
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-lg font-bold leading-none transition-transform duration-300 group-open:rotate-45"
                  style={{ backgroundColor: "#F0A500", color: "#1B2A4A" }}
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="px-5 pb-5 sm:px-6 text-[15px] leading-relaxed" style={{ color: "#555" }}>
                {item.a}
              </p>
            </details>
          ))}
        </div>

        <p className="text-center text-sm mt-8" style={{ color: "#666" }}>
          Nie znalazłeś odpowiedzi?{" "}
          <Link href="/kontakt" className="font-bold underline" style={{ color: "#1B2A4A" }}>
            Napisz do nas
          </Link>
        </p>
      </div>
    </section>
  )
}
