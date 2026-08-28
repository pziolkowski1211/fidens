import Link from "next/link";
import Image from "next/image";
import Navbar from "./components/Navbar";
import { createClient } from "@/lib/supabase/server";
import { calculateShowcaseRate } from "@/lib/leasing/calculator";

interface FeaturedListing {
  id: string;
  slug: string;
  title: string;
  year: number | null;
  mileage_km: number | null;
  fuel: string | null;
  transmission: string | null;
  rate: number | null;
  badge: string | null;
  cover_url: string | null;
  is_marza: boolean;
}

interface LatestListing {
  id: string;
  slug: string;
  title: string;
  year: number | null;
  mileage_km: number | null;
  vehicle_type: string | null;
  rate: number | null;
  badge: string | null;
  cover_url: string | null;
  is_marza: boolean;
}

export default async function Home() {
  const supabase = await createClient();

  const { data: featuredData } = await supabase
    .from("listings")
    .select("id, slug, title, year, mileage_km, fuel, transmission, price_pln, vat_type, badge, listing_images(url, is_cover)")
    .eq("status", "active")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const featuredRaw = featuredData as { id: string; slug: string; title: string; year: number | null; mileage_km: number | null; fuel: string | null; transmission: string | null; price_pln: number | null; vat_type: string | null; badge: string | null; listing_images: { url: string; is_cover: boolean }[] | null } | null;
  const featured: FeaturedListing | null = featuredRaw
    ? {
        id: featuredRaw.id,
        slug: featuredRaw.slug,
        title: featuredRaw.title,
        year: featuredRaw.year,
        mileage_km: featuredRaw.mileage_km,
        fuel: featuredRaw.fuel,
        transmission: featuredRaw.transmission,
        rate: featuredRaw.price_pln ? calculateShowcaseRate(featuredRaw.price_pln, featuredRaw.vat_type === "marza") : null,
        badge: featuredRaw.badge,
        cover_url: extractCoverUrl(featuredRaw.listing_images),
        is_marza: featuredRaw.vat_type === "marza",
      }
    : null;

  let latestQuery = supabase
    .from("listings")
    .select("id, slug, title, year, mileage_km, vehicle_type, price_pln, vat_type, badge, listing_images(url, is_cover)")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(3);

  if (featured) {
    latestQuery = latestQuery.neq("id", featured.id);
  }

  const { data: latestData } = await latestQuery;
  const latest: LatestListing[] = (latestData || []).map((row: { id: string; slug: string; title: string; year: number | null; mileage_km: number | null; vehicle_type: string | null; price_pln: number | null; vat_type: string | null; badge: string | null; listing_images: { url: string; is_cover: boolean }[] | null }) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    year: row.year,
    mileage_km: row.mileage_km,
    vehicle_type: row.vehicle_type,
    rate: row.price_pln ? calculateShowcaseRate(row.price_pln, row.vat_type === "marza") : null,
    badge: row.badge,
    cover_url: extractCoverUrl(row.listing_images),
    is_marza: row.vat_type === "marza",
  }));

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#f8f9fb" }}>

      <Navbar />

      {/* HERO */}
      <section style={{ backgroundColor: "#1B2A4A" }} className="px-4 sm:px-6 py-12 sm:py-16 lg:py-20 text-center">
        <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
          Finansowanie pojazdów<br className="hidden sm:inline" />
          <span className="sm:hidden"> </span>i maszyn budowlanych
        </h1>
        <p className="text-white/60 text-base sm:text-lg mb-4 px-4">
          Leasing, kredyt, wynajem &mdash; szybka decyzja kredytowa.<br className="hidden sm:inline" />
          <span className="sm:hidden"> </span>Ty wybierasz pojazd, my zajmujemy się resztą.
        </p>
      </section>

      {/* OGŁOSZENIE TYGODNIA */}
      {featured && (
        <section className="px-4 sm:px-6 py-10 sm:py-12" style={{ backgroundColor: "#ffffff" }}>
          <div className="max-w-[1100px] mx-auto">
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "#1B2A4A" }}>Ogłoszenie tygodnia</h2>
              <span className="text-[11px] font-bold py-[3px] px-[10px] rounded-full" style={{ backgroundColor: "#F0A500", color: "#1B2A4A" }}>
                Wyróżnione
              </span>
            </div>

            <Link
              href={"/ogloszenia/" + featured.slug}
              className="rounded-xl overflow-hidden flex flex-col lg:flex-row hover:shadow-lg transition-shadow block"
              style={{ backgroundColor: "#f8f9fb", border: "1px solid #e8eaed" }}
            >
              <div className="relative w-full lg:w-[400px] h-48 sm:h-64 lg:h-auto flex-shrink-0 flex items-center justify-center overflow-hidden" style={{ backgroundColor: "#e8eaed" }}>
                {featured.cover_url ? (
                  <Image src={featured.cover_url} alt={featured.title} fill sizes="(max-width: 1024px) 100vw, 400px" className="object-cover" priority />
                ) : (
                  <span className="text-sm" style={{ color: "#aaa" }}>Brak zdjęcia</span>
                )}
              </div>

              <div className="p-6 sm:p-8 flex flex-col">
                <div className="text-[11px] font-bold py-[3px] px-[10px] rounded-[3px] inline-block mb-3 self-start" style={{ backgroundColor: "#F0A500", color: "#1B2A4A" }}>
                  Ogłoszenie tygodnia
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-[28px] font-bold mb-2" style={{ color: "#1B2A4A" }}>
                  {featured.title}
                </h3>
                <p className="text-sm mb-5" style={{ color: "#888" }}>
                  {[
                    featured.year,
                    featured.mileage_km ? formatNumber(featured.mileage_km) + " km" : null,
                    featured.fuel ? capitalize(featured.fuel) : null,
                    featured.transmission ? capitalize(featured.transmission) : null,
                  ].filter(Boolean).join(" \u00B7 ")}
                </p>
                {featured.rate && (
                  <div className="text-[28px] sm:text-3xl lg:text-[36px] font-bold mb-5" style={{ color: "#1B2A4A" }}>
                    od {formatNumber(Math.round(featured.rate))} zł <span className="text-base font-normal" style={{ color: "#888" }}>/miesiąc{!featured.is_marza && " netto"}</span>
                  </div>
                )}
                <span className="font-bold rounded-lg py-3.5 px-6 sm:px-8 text-sm sm:text-[15px] self-start" style={{ backgroundColor: "#F0A500", color: "#1B2A4A" }}>
                  Sprawdź ofertę &rarr;
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* NAJNOWSZE OFERTY */}
      {latest.length > 0 && (
        <section className="px-4 sm:px-6 py-10 sm:py-12">
          <div className="max-w-[1100px] mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "#1B2A4A" }}>Najnowsze oferty</h2>
              <Link href="/ogloszenia" className="text-sm font-semibold" style={{ color: "#F0A500" }}>
                Zobacz wszystkie &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {latest.map((auto) => (
                <Link
                  key={auto.id}
                  href={"/ogloszenia/" + auto.slug}
                  className="rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow block"
                  style={{ backgroundColor: "#ffffff", border: "1px solid #e8eaed" }}
                >
                  <div className="relative h-44 sm:h-48 flex items-center justify-center overflow-hidden" style={{ backgroundColor: "#e8eaed" }}>
                    {auto.cover_url ? (
                      <Image src={auto.cover_url} alt={auto.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
                    ) : (
                      <span className="text-sm" style={{ color: "#aaa" }}>Brak zdjęcia</span>
                    )}
                  </div>
                  <div className="p-4">
                    {auto.badge && (
                      <div className="text-[10px] py-0.5 px-2 rounded-[3px] inline-block mb-2"
                        style={{
                          backgroundColor: auto.badge === "Promocja" ? "#fff3e0" : "#e8f4e8",
                          color: auto.badge === "Promocja" ? "#e65100" : "#2a7a2a"
                        }}>
                        {auto.badge}
                      </div>
                    )}
                    <div className="text-base font-bold mb-1" style={{ color: "#1B2A4A" }}>{auto.title}</div>
                    <div className="text-[13px] mb-3" style={{ color: "#888" }}>
                      {[
                        auto.year,
                        auto.mileage_km ? formatNumber(auto.mileage_km) + " km" : null,
                      ].filter(Boolean).join(" \u00B7 ")}
                    </div>
                    {auto.rate && (
                      <div className="text-[22px] font-bold" style={{ color: "#1B2A4A" }}>
                        od {formatNumber(Math.round(auto.rate))} zł <span className="text-[13px] font-normal" style={{ color: "#888" }}>/msc{!auto.is_marza && " netto"}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* JAK TO DZIALA */}
      <section className="px-4 sm:px-6 py-12 sm:py-16" style={{ backgroundColor: "#1B2A4A" }}>
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-white text-2xl sm:text-3xl font-bold text-center mb-10 sm:mb-12">
            Jak to działa?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-4">
            {[
              { nr: "1", tekst: "Złóż zapytanie online" },
              { nr: "2", tekst: "Decyzja w 60 minut" },
              { nr: "3", tekst: "Podpisz umowę" },
              { nr: "4", tekst: "Wpłać opłatę wstępną" },
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
            Opinie klientów
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { tekst: "Ekspresowa decyzja, zero stresu. Polecam każdemu przedsiębiorcy.", imie: "Marek K.", miasto: "Warszawa" },
              { tekst: "Wszystko załatwione w jeden dzień. Auto stało pod domem następnego dnia.", imie: "Tomasz W.", miasto: "Kraków" },
              { tekst: "Profesjonalne podejście, najlepsza oferta leasingu jaką znalazłem.", imie: "Anna P.", miasto: "Wrocław" },
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

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatNumber(n: number): string {
  return n.toLocaleString("pl-PL").replace(/,/g, " ");
}

function extractCoverUrl(images: { url: string; is_cover: boolean }[] | null | undefined): string | null {
  if (!images || images.length === 0) return null;
  const cover = images.find((img) => img.is_cover === true);
  return cover ? cover.url : images[0].url;
}

