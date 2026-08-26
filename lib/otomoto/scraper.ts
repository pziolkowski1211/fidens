// lib/otomoto/scraper.ts
// Import danych ogloszenia z OtoMoto na podstawie linku.
// Strona OtoMoto (Next.js) osadza dane ogloszenia w kilku miejscach wewnatrz
// bloku __NEXT_DATA__:
// - obiekt "advert" (marka, model, cena, rok, przebieg, paliwo, tytul)
// - obiekt "cepikWidget" (kolor, skrzynia biegow, moc, pojemnosc silnika,
//   kraj pochodzenia) - dostepny tylko dla ogloszen ze zweryfikowanymi danymi
//   CEPIK, wiec moze czasem brakowac.
// Wyciagamy je przez dopasowanie nawiasow klamrowych (nie regex na cala
// tresc, bo JSON zawiera zagniezdzone obiekty).
//
// UWAGA: parser best-effort. Jesli OtoMoto zmieni strukture strony, funkcja
// zwroci puste pola + warnings zamiast sie wywalic - wtedy trzeba uzupelnic
// dane recznie.

export type OtomotoScrapedData = {
  otomotoId: string | null
  otomotoUrl: string
  title: string | null
  pricePln: number | null
  brand: string | null
  model: string | null
  year: number | null
  mileageKm: number | null
  fuel: "benzyna" | "diesel" | "elektryczny" | "hybryda" | "lpg" | "inny" | null
  transmission: "manualna" | "automatyczna" | "inne" | null
  color: string | null
  powerHp: number | null
  engineCc: number | null
  countryOrigin: string | null
  warnings: string[]
}

// Wyciaga obiekt JSON zaczynajacy sie od podanego markera, licząc nawiasy
// klamrowe (z uwzglednieniem stringow i znakow ucieczki), zeby znalezc
// dokladny koniec obiektu.
function extractJsonObject(html: string, marker: string): unknown | null {
  const markerIdx = html.indexOf(marker)
  if (markerIdx === -1) return null

  const start = html.indexOf("{", markerIdx)
  if (start === -1) return null

  let depth = 0
  let inString = false
  let escapeNext = false

  for (let i = start; i < html.length; i++) {
    const ch = html[i]

    if (escapeNext) {
      escapeNext = false
      continue
    }
    if (ch === "\\") {
      escapeNext = true
      continue
    }
    if (ch === '"') {
      inString = !inString
      continue
    }
    if (inString) continue

    if (ch === "{") {
      depth++
    } else if (ch === "}") {
      depth--
      if (depth === 0) {
        const jsonStr = html.slice(start, i + 1)
        try {
          return JSON.parse(jsonStr)
        } catch {
          return null
        }
      }
    }
  }
  return null
}

function mapFuel(raw: unknown): OtomotoScrapedData["fuel"] {
  if (typeof raw !== "string") return null
  const key = raw.trim().toLowerCase()
  if (key === "benzyna") return "benzyna"
  if (key === "diesel") return "diesel"
  if (key === "elektryczny") return "elektryczny"
  if (key === "hybryda") return "hybryda"
  if (key === "lpg") return "lpg"
  if (key.length > 0) return "inny"
  return null
}

function mapTransmission(raw: unknown): OtomotoScrapedData["transmission"] {
  if (typeof raw !== "string") return null
  const key = raw.trim().toLowerCase()
  if (key === "manualna") return "manualna"
  if (key === "automatyczna") return "automatyczna"
  if (key.length > 0) return "inne"
  return null
}

// "149 KM" -> 149 ; "1 969 cm3" -> 1969 (nie 19693 - "cm3" konczy sie cyfra!)
function parseFirstNumber(raw: unknown): number | null {
  if (typeof raw !== "string") return null
  const compact = raw.replace(/\s+/g, "")
  const match = compact.match(/^(\d+)/)
  if (!match) return null
  return Number(match[1])
}

// Wyciaga adresy zdjec galerii ze strony OtoMoto. Zdjecia sa serwowane przez
// CDN (ireland.apollo.olxcdn.com) z parametrem rozmiaru w adresie
// (np. ";s=5120x0;q=100" dla pelnego rozmiaru, ";s=148x110" dla miniaturki).
// Kazde zdjecie wystepuje na stronie kilka razy w roznych rozmiarach - bierzemy
// unikalny identyfikator pliku i budujemy WLASNY adres w rozmiarze ~1600px,
// zeby nie sciagac ogromnych oryginalow (CDN sam przeskaluje na zadanie).
const OTOMOTO_IMAGE_PATTERN =
  /https:\/\/ireland\.apollo\.olxcdn\.com\/v1\/files\/([A-Za-z0-9_\-.]+)\/image;s=(\d+)x\d+/g

export function extractOtomotoImageUrls(html: string): string[] {
  const seenFileIds = new Set<string>()
  const urls: string[] = []

  let match: RegExpExecArray | null
  OTOMOTO_IMAGE_PATTERN.lastIndex = 0
  while ((match = OTOMOTO_IMAGE_PATTERN.exec(html)) !== null) {
    const fileId = match[1]
    const width = Number(match[2])
    // Pomijamy male miniaturki (np. 148x110, 5x5) - interesuja nas tylko
    // warianty, ktore wskazuja na zdjecie galerii (szerokosc >= 1000).
    if (width < 1000) continue
    if (seenFileIds.has(fileId)) continue
    seenFileIds.add(fileId)
    urls.push(`https://ireland.apollo.olxcdn.com/v1/files/${fileId}/image;s=1600x0;q=75`)
  }

  return urls
}

export async function fetchOtomotoListing(url: string): Promise<OtomotoScrapedData> {
  const warnings: string[] = []

  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "pl-PL,pl;q=0.9",
    },
  })

  if (!res.ok) {
    throw new Error(`OtoMoto zwrocilo blad HTTP ${res.status} - sprawdz czy link jest poprawny`)
  }

  const html = await res.text()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const widget =
    (extractJsonObject(html, '"financingAdCarDetailsWidget":{"status"') as any) ??
    (extractJsonObject(html, '"financingSimulatorWidget":{"status"') as any)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const advert = widget?.props?.advert as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cepikWidget = extractJsonObject(html, '"cepikWidget":{"status"') as any
  const cepikDetails = cepikWidget?.props?.advert?.details ?? null

  if (!advert) {
    warnings.push(
      "Nie udalo sie znalezc podstawowych danych ogloszenia na stronie OtoMoto (mogli zmienic strukture strony, albo to jest link do podgladu/isPreview - sprobuj zwyklego publicznego linku). Uzupelnij wszystkie pola recznie."
    )
    return {
      otomotoId: null,
      otomotoUrl: url,
      title: null,
      pricePln: null,
      brand: null,
      model: null,
      year: null,
      mileageKm: null,
      fuel: null,
      transmission: null,
      color: null,
      powerHp: null,
      engineCc: null,
      countryOrigin: null,
      warnings,
    }
  }

  const otomotoId = advert.id ? String(advert.id) : null
  const title = typeof advert.title === "string" ? advert.title : null
  const pricePln = advert.rawPrice ? Math.round(Number(advert.rawPrice)) : null
  const brand = typeof advert.make === "string" ? advert.make : null
  const model = typeof advert.model === "string" ? advert.model : null
  const year = advert.year ? Number(advert.year) : null
  const mileageKm = advert.mileage ? Number(advert.mileage) : null
  const fuel = mapFuel(advert.fuelType)

  // Dane z cepikWidget (jesli dostepne) - kolor, skrzynia, moc, pojemnosc, kraj
  const color = cepikDetails?.color ?? null
  const transmission = mapTransmission(cepikDetails?.gearbox)
  const powerHp = parseFirstNumber(cepikDetails?.engine_power)
  const engineCc = parseFirstNumber(cepikDetails?.engine_capacity)
  const countryOrigin = cepikDetails?.country_origin ?? null

  if (!brand) warnings.push("Nie znaleziono marki - uzupelnij recznie.")
  if (!model) warnings.push("Nie znaleziono modelu - uzupelnij recznie.")
  if (!pricePln) warnings.push("Nie znaleziono ceny - uzupelnij recznie.")

  if (!cepikDetails) {
    warnings.push(
      "To ogloszenie nie ma zweryfikowanych danych CEPIK, wiec kolor/skrzynia/moc/pojemnosc/kraj pochodzenia nie zostaly znalezione - uzupelnij je recznie."
    )
  }
  warnings.push("Wariant (wersja wyposazenia) NIE jest jeszcze wyciagany automatycznie - uzupelnij recznie.")

  return {
    otomotoId,
    otomotoUrl: url,
    title,
    pricePln,
    brand,
    model,
    year,
    mileageKm,
    fuel,
    transmission,
    color,
    powerHp,
    engineCc,
    countryOrigin,
    warnings,
  }
}
export type OtomotoListingStatus = "active" | "inactive" | "unknown"

// Lekkie sprawdzenie czy ogloszenie nadal istnieje na OtoMoto - bez pelnego
// scrapowania wszystkich pol. Uzywane przez cron synchronizujacy.
// - "active": strona zwraca dane ogloszenia (znaleziono obiekt advert)
// - "inactive": OtoMoto zwraca 404/410, albo strona jasno wskazuje ze
//   ogloszenie wygaslo/zostalo zakonczone
// - "unknown": nie udalo sie jednoznacznie stwierdzic (inny blad HTTP,
//   problem sieciowy, zmiana struktury strony) - NIE zmieniamy wtedy
//   statusu w bazie, zeby uniknac falszywego oznaczenia dobrego
//   ogloszenia jako nieaktywne
export async function checkOtomotoListingStatus(url: string): Promise<OtomotoListingStatus> {
  let res: Response

  try {
    res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "pl-PL,pl;q=0.9",
      },
    })
  } catch {
    return "unknown"
  }

  if (res.status === 404 || res.status === 410) {
    return "inactive"
  }

  if (!res.ok) {
    return "unknown"
  }

  const html = await res.text()

  // Uwaga: te teksty sa przypuszczeniem (nie mielismy realnego przykladu
  // wygaslego ogloszenia do sprawdzenia) - moze wymagac poprawki.
  const EXPIRED_MARKERS = [
    "To ogloszenie jest nieaktualne",
    "Ogloszenie zostalo zakonczone",
    "Ogloszenie zostalo usuniete",
  ]
  if (EXPIRED_MARKERS.some((marker) => html.includes(marker))) {
    return "inactive"
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const widget =
    (extractJsonObject(html, '"financingAdCarDetailsWidget":{"status"') as any) ??
    (extractJsonObject(html, '"financingSimulatorWidget":{"status"') as any)
  const advert = widget?.props?.advert

  if (advert) {
    return "active"
  }

  return "unknown"
}
