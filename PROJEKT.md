# Fidens.pl - Projekt strony

## Cel projektu
Strona dla brokera/dealera leasingowego (auta osobowe, ciezarowe, maszyny budowlane).
Klienci wchodza glownie z social mediow -> mobile pierwszy priorytet.

## Stack techniczny
- **Next.js 16** (App Router) + TypeScript + Tailwind v4
- **Supabase** - baza danych (Postgres), Auth (panel admina), Storage (zdjecia)
- **Vercel** - hosting -> fidens.pl
- **Resend** - planowane do wysylki maili z formularzy (3000/msc free)

## Repo i srodowisko
- **GitHub:** github.com/pziolkowski1211/fidens
- **Lokalne:** C:\Users\pziol\fidens
- **Edytor:** VS Code
- **Terminal:** PowerShell
- **Hostname dev (mobile testy):** npx next dev -H 0.0.0.0

## Klucze i sekrety
Plik .env.local (NIE w gitu) zawiera:
- NEXT_PUBLIC_SUPABASE_URL - https://mglgfsaimktblkzjkmfg.supabase.co
- NEXT_PUBLIC_SUPABASE_ANON_KEY - sb_publishable_LgsGRj9uVhBigrIXMPY5Rw_89VdFLlN

Te same klucze sa dodane na Vercel (Environment Variables -> Production/Preview/Development).

## Identyfikacja wizualna
- **Granat (primary):** #1B2A4A
- **Pomaranczowy (accent):** #F0A500
- **Tlo jasne:** #f8f9fb
- **Bordery:** #e8eaed
- **Logo jasne (na ciemne tlo):** public/jasne.png (1536x1024 px, transparent)
- **Logo ciemne (na jasne tlo):** public/ciemne.png (1536x1024 px, transparent)

## Struktura folderow

fidens/
- app/
  - components/
    - Navbar.tsx (nawigacja desktop/mobile + hamburger)
    - SearchAutocomplete.tsx (wyszukiwarka z autocomplete)
  - ogloszenia/
    - page.tsx (lista ogloszen z filtrami z URL, podpieta do Supabase)
    - [slug]/
      - page.tsx (strona pojedynczego ogloszenia, podpieta do Supabase)
  - favicon.ico
  - globals.css
  - layout.tsx
  - page.tsx (strona glowna, podpieta do Supabase)
- lib/
  - supabase/
    - client.ts (klient browser)
    - server.ts (klient server, cookies)
    - types.ts (typy TS dla bazy - UWAGA: NIE zawiera nowych kolumn vat_type, available_leasing, available_pozyczka - dlatego w komponentach uzywamy lokalnych interfejsow)
  - vehicles/
    - catalog.ts (statyczna lista marek/modeli, BEZ polskich znakow - np. Citroen zamiast Citroen)
- public/
  - jasne.png (logo na ciemne tlo)
  - ciemne.png (logo na jasne tlo)
- .env.local (klucze, poza git)
- PROJEKT.md (ten plik)
- AGENTS.md (instrukcje dla AI)

## Schemat bazy Supabase
Tabele utworzone (RLS wlaczone):

### listings (ogloszenia)
- id UUID PK
- title, slug (unikalny), vehicle_type ('osobowe'|'ciezarowe'|'maszyna')
- status ('active'|'inactive'|'sold')
- brand, model, variant, year, mileage_km, mileage_hours
- fuel (enum), transmission (enum), power_hp, engine_cc, color, country_origin
- price_pln, leasing_rate_pln, leasing_initial_pct, leasing_months, leasing_residual_pct
- is_featured (Ogloszenie tygodnia), badge ("Nowe"/"Promocja"/null)
- otomoto_url, otomoto_id (do importu/synchronizacji)
- description, location_city
- search_vector (TSVECTOR + GIN index dla pelnotekstowego wyszukiwania)
- **vat_type** ('vat23' | 'marza') DEFAULT 'vat23' - DODANE 29.04.2026
- **available_leasing** BOOLEAN DEFAULT TRUE - DODANE 29.04.2026
- **available_pozyczka** BOOLEAN DEFAULT FALSE - DODANE 29.04.2026

### Enum fuel_type (paliwa)
Dozwolone wartosci: benzyna, diesel, elektryczny, hybryda, lpg, inny, plug-in
**Aktywnie uzywamy:** benzyna, diesel, elektryczny, hybryda, plug-in (lpg i inny zostaly w bazie ale nie pokazujemy w UI)

### Enum transmission_type (skrzynia)
Dozwolone wartosci: manualna, automatyczna, inne
**Aktywnie uzywamy:** manualna, automatyczna (inne zostalo w bazie ale nie pokazujemy w UI)

### listing_images (galeria zdjec)
- id, listing_id (FK), storage_path, url, position, is_cover
- 1 cover per listing (constraint UNIQUE)

### contact_requests (zapytania z formularza)
- id, listing_id (FK, nullable), name, phone, email
- leasing_initial_pct, leasing_months, leasing_residual_pct
- is_read, notes (admin)

### Storage bucket
- listing-images - publiczny odczyt, upload tylko zalogowany admin

### RLS policies
- Public: SELECT na active listings + ich images, INSERT na contact_requests
- Authenticated (admin): pelny dostep do wszystkich tabel

## Testowe ogloszenia w bazie (3 sztuki)
Wstawione 29.04.2026 jako dane testowe:

1. **BMW 5 Series 530d xDrive** (slug: bmw-5-series-530d-xdrive-2022)
   - vat_type: vat23, available_leasing: TRUE, available_pozyczka: FALSE
   - is_featured: TRUE (Ogloszenie tygodnia)
   - Cena: 195 000 zl netto, rata orientacyjna: 1 890 zl/msc
   - Parametry domyslne: wstepna 10%, okres 48msc, wykup 20%
   - Badge: "Nowe"

2. **Mercedes-Benz Sprinter 519 CDI** (slug: mercedes-sprinter-519-cdi-2021)
   - vat_type: vat23, available_leasing: TRUE, available_pozyczka: FALSE
   - Cena: 165 000 zl netto, rata orientacyjna: 1 650 zl/msc
   - Parametry domyslne: wstepna 10%, okres 60msc, wykup 15%
   - Badge: "Promocja"

3. **Caterpillar 320 D2** (slug: caterpillar-320-d2-2019)
   - vat_type: marza, available_leasing: FALSE, available_pozyczka: TRUE
   - Cena: 245 000 zl brutto, rata orientacyjna: 4 100 zl/msc
   - Parametry domyslne: wstepna 15%, okres 60msc, wykup BRAK (pozyczka)
   - Badge: brak

**WAZNE:** Te raty sa wpisane "na oko" - po dostarczeniu ofert z banku przeliczymy je dokladnym wzorem i podmienimy w bazie.

## Decyzje produktowe (zatwierdzone z klientem)

### Ogolne
- **Galeria zdjec:** karuzela (wiele zdjec na ogloszenie), strzalki + kropki + swipe na mobile, klik = lightbox pelnoekranowy
- **Wyszukiwarka:** autocomplete typu Google ze statycznej listy. Klik w sugestie -> /ogloszenia?marka=X&model=Y. Brak wynikow -> CTA "Zapytaj o ten pojazd" z prefilled marka/modelem
- **Mobile nawigacja:** logo + lupa + hamburger. Drawer wysuwany z prawej
- **Logo klikalne** (powrot na strone glowna)
- **Import z OtoMoto:** scraping po URL ogloszenia (brak oficjalnego API). Zdjecia uploadowane RECZNIE (osobno od OtoMoto). Synchronizacja: jak ogloszenie znika z OtoMoto -> znika z Fidens

### Wyswietlanie cen i raty (kluczowa decyzja)
- **Strona glowna i lista /ogloszenia:** pokazujemy tylko RATE (np. "od 1 890 zl/msc"). Cena pojazdu UKRYTA
- **Strona pojedynczego ogloszenia /ogloszenia/[slug]:** pokazujemy CENE pojazdu + rate. Cena z labelem:
  - vat23 -> "Cena netto"
  - marza -> "Cena (VAT-marza)"
- **location_city:** zostalo w bazie ale NIE pokazujemy w UI (klient nie chce by widoczne)

### Mechanizm raty domyslnej (kluczowa decyzja)
- W bazie kazde ogloszenie ma `leasing_rate_pln` + `leasing_initial_pct` + `leasing_months` + `leasing_residual_pct`
- TO SA DOMYSLNE PARAMETRY ustawiane przez admina dla danego ogloszenia (np. "wstepna 10% / okres 48msc / wykup 20% -> rata 1 890 zl")
- Ta rata wyswietla sie na karcie ogloszenia (lista, strona glowna)
- Po wejsciu na strone ogloszenia kalkulator startuje z tymi parametrami, ale klient moze je zmieniac
- W panelu admina: dorobimy mini-kalkulator z przyciskiem "Ustaw jako domyslne" - admin krecil suwakami i zapisywal stan

### Kalkulator leasingu/pozyczki
- **Stopy procentowe:** JEDNA aktualna stopa (edytowalna w panelu admina). BEZ wyboru stala/zmienna dla klienta
- **Suwaki leasing:** oplata wstepna 0-45%, okres 24-72 msc, wykup zalezny od okresu
- **Suwaki pozyczka:** oplata wstepna 0-45%, okres 24-72 msc (BEZ wykupu)
- **Wykup zalezny od okresu (max %):**
  - 24 msc -> 55%
  - 36 msc -> 45%
  - 48 msc -> 40%
  - 60 msc -> 35%
  - 72 msc -> 30%
- **Wybor leasing/pozyczka:**
  - vat23 + tylko leasing -> kalkulator leasingu
  - vat23 + obie opcje -> taby [Leasing] [Pozyczka]
  - marza -> tylko kalkulator pozyczki
- **UI kalkulatora:** TYLKO suwaki + pogrubiona rata. Bez sumy oplat, RRSO, sumy rat
- **Pod kalkulatorem:** "Rata orientacyjna. Dokladna oferta po kontakcie."
- **WZOR raty:** czeka na 6 ofert z banku (3 leasing + 3 pozyczka) ktore klient ma podeslac

### Modal kontaktowy "Zapytaj o ten pojazd"
- Pola **obowiazkowe:** email, telefon, NIP
- Pola **opcjonalne:** imie i nazwisko, wiadomosc
- Po wyslaniu: zapis do contact_requests + (potem) Resend mail do wlasciciela

## Stan prac (29.04.2026)

### Zrobione
- [x] Konto Supabase + projekt "Fidens"
- [x] Schemat bazy (3 tabele + storage bucket + RLS)
- [x] Klucze Supabase w .env.local i na Vercel
- [x] Klienty Supabase (browser + server)
- [x] Typy TypeScript dla bazy (UWAGA: nie zawiera kolumn vat_type, available_leasing, available_pozyczka - uzywamy lokalnych interfejsow w plikach)
- [x] Statyczny katalog marek/modeli
- [x] Wyszukiwarka autocomplete (desktop + mobile)
- [x] Strona glowna z sekcjami: hero, ogloszenie tygodnia, najnowsze oferty, jak to dziala, opinie, stopka
- [x] Strona /ogloszenia z obsluga query params + komunikat "Brak ofert" + CTA
- [x] Logo (klikalne) w nawigacji i stopce
- [x] Wyszukiwarka wycentrowana na desktop
- [x] Responsywnosc: hamburger menu z drawerem, lupa rozwijajaca pole szukaj, sekcje 1/2/3 kolumny
- [x] Wgrane na Vercel -> fidens.pl
- [x] **Naprawa polskich znakow w UI** (page, Navbar, ogloszenia, search) - 29.04.2026
- [x] **Dodanie kolumn vat_type, available_leasing, available_pozyczka** do tabeli listings - 29.04.2026
- [x] **Dodanie wartosci 'plug-in' do enuma fuel_type** - 29.04.2026
- [x] **3 testowe ogloszenia w bazie** (BMW, Mercedes, Caterpillar) - 29.04.2026
- [x] **Strona pojedynczego ogloszenia /ogloszenia/[slug]/page.tsx** - 29.04.2026
  - Pobiera dane z Supabase po slug
  - Wyswietla tylko pola z wartoscia (params_list)
  - Cena z labelem netto/VAT-marza
  - Placeholder galerii (komponent karuzeli do zrobienia)
  - Placeholder kalkulatora (do zrobienia)
  - Przycisk "Zapytaj o ten pojazd" (modal do zrobienia)
- [x] **Podpiecie strony glownej do bazy** - 29.04.2026
  - Sekcja "Ogloszenie tygodnia" pobiera ogloszenie z is_featured=TRUE
  - Sekcja "Najnowsze oferty" pobiera 3 najnowsze (z wykluczeniem ogloszenia tygodnia)
  - Karty klikalne -> /ogloszenia/[slug]
- [x] **Podpiecie listy /ogloszenia do bazy** - 29.04.2026
  - Pobiera wszystkie active z filtrowaniem po marka/model/q
  - Sortowanie po is_featured DESC, created_at DESC
  - Karty klikalne
- [x] **Naprawa typow TypeScript** dla buildu produkcyjnego - 29.04.2026
  - Dodane lokalne interfejsy Listing, FeaturedListing, LatestListing, ListingCard w plikach
  - Build na Vercel przechodzi

### Do zrobienia (priorytety)

#### CZEKA NA OFERTY Z BANKU (od klienta Pawla)
1. **Kalkulator leasingu** - suwaki + dynamiczny wzor raty (annuitet)
2. **Kalkulator pozyczki** - suwaki bez wykupu

Klient ma podeslac 6 ofert bankowych:
- 3 leasing dla ceny 100 000 zl netto z roznymi parametrami (wstepna 10/25/45%, okres 36/48/60 msc, wykup 20/30/35%)
- 3 pozyczka dla ceny 100 000 zl brutto z roznymi parametrami (wstepna 10/25/45%, okres 36/48/60 msc, BEZ wykupu)
- Z kazdej oferty: cena, wstepna, okres, wykup, miesieczna RATA, oprocentowanie/RRSO, suma oplat
- Najlepiej screenshoty z kalkulatorow bankowych

#### MOZNA ROBIC BEZ OFERT Z BANKU
3. **Galeria zdjec** - karuzela na stronie ogloszenia (komponent client) + lightbox pelnoekranowy. Placeholder dopoki nie ma zdjec w bazie. Po zrobieniu panelu admina i upload zdjec zacznie pokazywac realne.

4. **Modal kontaktowy** - wyskakuje po kliku "Zapytaj o ten pojazd". Pola: email/tel/NIP obowiazkowe + imie/wiadomosc opcjonalne. Zapis do contact_requests. Resend - pozniej.

5. **Panel admina /admin** (DUZY ETAP - 3-5 sesji)
   - Logowanie przez Supabase Auth (tylko 1 user)
   - CRUD na ogloszeniach (tworzenie, edycja, usuwanie)
   - Mini-kalkulator z przyciskiem "Ustaw jako domyslne" -> zapisuje rate i parametry
   - Walidacja: marza -> wymusza pozyczka, vat23 -> mozna leasing/pozyczka/oba
   - Dropdown paliwa: tylko benzyna/diesel/elektryczny/hybryda/plug-in
   - Dropdown skrzyni: tylko manualna/automatyczna (przy maszynach pole ukryte)
   - Pole stopy procentowej (jedna, edytowalna, idzie do kalkulatora)
   - Upload zdjec do Supabase Storage (drag and drop, multi-file)
   - Ustawianie cover image, kolejnosci zdjec
   - Lista contact_requests z mozliwoscia oznaczania jako przeczytane + notatki

6. **Strona /kontakt** - ogolny formularz kontaktowy

7. **Resend** - integracja do wysylki maili z formularzy (po zrobieniu modala kontaktowego)

8. **Import z OtoMoto**
   - Pole "Wklej link OtoMoto" w panelu admina
   - Scraping danych pojazdu (marka, model, rok, przebieg, cena, opis...)
   - Stworzenie listingu z otomoto_url i otomoto_id
   - Zdjecia ZAWSZE wgrywane recznie (osobno)

9. **Synchronizacja z OtoMoto**
   - Cron (Vercel Cron Jobs?) raz dziennie sprawdza wszystkie listings z otomoto_url
   - Jezeli OtoMoto zwraca 404 -> ustaw status='inactive'

10. **Drobiazgi**
    - [ ] Favicon z logo Fidens (use favicon.io/favicon-converter)
    - [ ] Tytuly stron (Open Graph + meta description per strona)
    - [ ] Strony statyczne: /o-nas, /leasing, /regulamin, /polityka

## Konwencje pracy
- **Pisanie kodu:** komendy w terminalu (PowerShell)
  - Dla plikow w normalnych folderach: `@'...'@ | Out-File -FilePath "..." -Encoding utf8`
  - Dla plikow w folderach z nawiasami `[ ]` (np. `[slug]`): `$content = @'...'@ ; Set-Content -LiteralPath "..." -Value $content -Encoding utf8`
- **Polskie znaki w treści plików:** UZYWAMY normalnie (UTF-8 dziala). Restrykcja TYLKO w argumentach komend (nazwy folderow, parametry, wiadomosci git commit) - tam bez ogonkow
- **Test:** zawsze npm run dev na localhost:3000 + sprawdzenie mobile (DevTools F12 -> ikona telefonu)
- **Mobile real device:** npx next dev -H 0.0.0.0 -> wpisac IP komputera w przegladarce telefonu
- **Build produkcyjny:** PRZED kazdym pushem warto sprawdzic `npm run build` lokalnie (Vercel jest rygorystyczny dla TypeScript - dev jest pobłazliwy)
- **Wgranie:** git add . && git commit -m "opis bez polskich znakow" && git push -> Vercel auto-rebuild
- **Wszystkie zmiany testujemy lokalnie ZANIM git push** (zeby fidens.pl sie nie zepsuly)

## Znane problemy/uwagi

### Hydration warning od Bitdefender
Rozszerzenie Bitdefender modyfikuje HTML (atrybuty bis_register, bis_skin_checked, __processed_*) i React zglasza warning "hydration mismatch". To NIE jest blad kodu - tylko deweloperski warning w trybie dev. **W produkcji niewidoczny.** W trybie dev pojawia sie czerwony "1 Issue" w Next.js overlay - mozna ignorowac.

### Typy Supabase nie zawieraja nowych kolumn
`lib/supabase/types.ts` zostal wygenerowany **przed** dodaniem kolumn vat_type, available_leasing, available_pozyczka. Dlatego w komponentach (page.tsx, ogloszenia/page.tsx, ogloszenia/[slug]/page.tsx) **uzywamy lokalnych interfejsow TypeScript** (np. `interface Listing { vat_type: string | null; ... }`) i castujemy `data as Listing`. Dziala. Gdyby kiedys regenerowac types.ts -> usunac lokalne interfejsy.

### TypeScript na produkcji jest rygorystyczny
`npm run dev` przepuszcza wiele rzeczy ktore `npm run build` na Vercel odrzuca (np. `data` z Supabase ma typ `never[]` po sprawdzeniu `if (!data) ...`). Zawsze przed push: `npm run build` lokalnie.

### Folder app/ogloszenia/[slug]
PowerShell traktuje `[slug]` jako wzorzec wildcards przy `Out-File -FilePath`. Trzeba uzywac `Set-Content -LiteralPath` (jak opisano w Konwencjach pracy).

### Polskie znaki w PowerShell
- W **treści plików** (między @' i '@): polskie znaki dzialaja normalnie z `-Encoding utf8`. UZYWAMY!
- W **argumentach komend** (np. `git commit -m "..."`, nazwy folderow): unikamy polskich znakow (psuja sie)
