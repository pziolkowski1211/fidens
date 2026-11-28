import Link from "next/link"
import Image from "next/image"

const NAVY = "#1B2A4A"
const GOLD = "#F0A500"

const ITEMS = [
  { name: "Osobowe i dostawcze", href: "/ogloszenia?kategoria=osobowe_dostawcze", image: "/kategorie/osobowe.jpg" },
  { name: "Transport ciężki", href: "/ogloszenia?kategoria=ciezki_transport", image: "/kategorie/transport-ciezki.jpg" },
  { name: "Maszyny budowlane", href: "/ogloszenia?kategoria=maszyna", image: "/kategorie/maszyny-budowlane.jpg" },
  { name: "Maszyny przemysłowe", href: "/ogloszenia?kategoria=maszyna_przemyslowa", image: "/kategorie/maszyny-przemyslowe.jpg" },
  { name: "Domy modułowe i pawilony", href: "/pawilony", image: "/pawilony/pawilon-biurowy-24m2-8x3m/1.jpg" },
]

export default function CategoryStrip() {
  return (
    <section
      aria-label="Kategorie ofert"
      className="px-4 sm:px-6 py-10 sm:py-12"
      style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e8eaed" }}
    >
      <div className="max-w-[1100px] mx-auto">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold" style={{ color: NAVY }}>
              Czego szukasz?
            </h2>
            <p className="text-sm mt-1" style={{ color: "#666" }}>
              Wybierz kategorię i sprawdź dostępne oferty leasingu.
            </p>
          </div>
          <Link
            href="/ogloszenia"
            className="hidden sm:inline text-sm font-bold whitespace-nowrap hover:text-[#F0A500] transition-colors"
            style={{ color: NAVY }}
          >
            Wszystkie ogłoszenia &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {ITEMS.map((item, idx) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                "group relative block overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg " +
                (idx === 0
                  ? "col-span-2 aspect-[16/9] lg:col-span-1 lg:aspect-[3/4]"
                  : "aspect-[4/3] lg:aspect-[3/4]")
              }
              style={{ backgroundColor: NAVY }}
            >
              <Image
                src={item.image}
                alt=""
                fill
                sizes={idx === 0 ? "(min-width: 1024px) 210px, 100vw" : "(min-width: 1024px) 210px, 50vw"}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(27,42,74,0.9) 0%, rgba(27,42,74,0.25) 55%, transparent 100%)" }}
                aria-hidden="true"
              />
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                <div className="text-white font-bold text-[15px] sm:text-base leading-snug">{item.name}</div>
                <div className="mt-1 text-[13px] font-semibold" style={{ color: GOLD }}>
                  Zobacz oferty{" "}
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="sm:hidden text-center mt-5">
          <Link href="/ogloszenia" className="text-sm font-bold" style={{ color: NAVY }}>
            Wszystkie ogłoszenia &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}
