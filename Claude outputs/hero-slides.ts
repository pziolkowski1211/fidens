// lib/config/hero-slides.ts
//
// TRESC SLAJDOW NA STRONIE GLOWNEJ - edytujesz tylko ten plik.
//
// Jak zmienic slajd:      zmien title / subtitle / ctaLabel / ctaHref.
// Jak wylaczyc slajd:     ustaw enabled: false.
// Jak ustawic koniec:     endDate: "RRRR-MM-DD" - po tej dacie slajd sam znika
//                         (data liczona wlacznie, wg czasu polskiego).
// Jak dodac slajd:        skopiuj dowolny wpis i zmien id (musi byc unikalne).
// Zdjecie tla:            wrzuc plik do public/hero/ i wpisz sciezke w image,
//                         np. "/hero/promo.jpg". Bez zdjecia jest granatowe tlo.
// Czas zmiany slajdu:     HERO_INTERVAL_MS (w milisekundach, 8000 = 8 sekund).

export interface HeroSlide {
  id: string
  enabled: boolean
  endDate?: string
  badge?: string
  title: string
  subtitle?: string
  image?: string
  ctaLabel: string
  ctaHref: string
  stars?: boolean
}

export const HERO_INTERVAL_MS = 8000

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "promo",
    enabled: true,
    endDate: "2026-12-31",
    badge: "Promocja",
    // UZUPELNIC: dokladne warunki promocji (co, do kiedy, przy jakich ofertach).
    title: "Promocja do końca roku",
    subtitle: "Auto z pełnym bakiem",
    image: "/hero/promo.jpg",
    ctaLabel: "Zobacz oferty",
    ctaHref: "/ogloszenia?kategoria=osobowe_dostawcze",
  },
  {
    id: "od-reki",
    enabled: true,
    title: "Auta dostępne od ręki",
    subtitle: "Ty wybierasz pojazd, my zajmujemy się resztą.",
    image: "/hero/odreki.jpg",
    ctaLabel: "Zobacz oferty",
    ctaHref: "/ogloszenia?kategoria=osobowe_dostawcze",
  },
  {
    id: "maszyny",
    enabled: true,
    title: "Maszyny budowlane i przemysłowe w leasingu",
    subtitle: "Koparki, ładowarki, obrabiarki CNC i maszyny do obróbki drewna.",
    image: "/hero/maszyny.jpg",
    ctaLabel: "Zobacz maszyny",
    ctaHref: "/ogloszenia?kategoria=maszyna",
  },
  {
    id: "pawilony",
    enabled: true,
    title: "Pawilony i kontenery na zamówienie",
    subtitle: "Zaprojektujemy, wycenimy i sfinansujemy.",
    image: "/hero/pawilony.jpg",
    ctaLabel: "Zobacz pawilony",
    ctaHref: "/pawilony",
  },
  {
    // Wlacz dopiero, gdy bedzie wizytowka Google z prawdziwymi opiniami
    // i wpisz tu link do niej w ctaHref.
    id: "opinie",
    enabled: false,
    title: "Sprawdź opinie klientów",
    subtitle: "Zobacz, jak oceniają nas klienci.",
    stars: true,
    ctaLabel: "Zobacz opinie w Google",
    ctaHref: "https://www.google.com/",
  },
]

// Zwraca slajdy, ktore maja byc dzis pokazane (wlaczone i nie po terminie).
export function getActiveSlides(now: Date = new Date()): HeroSlide[] {
  const today = now.toLocaleDateString("sv-SE", { timeZone: "Europe/Warsaw" })
  return HERO_SLIDES.filter((s) => s.enabled && (!s.endDate || today <= s.endDate))
}
