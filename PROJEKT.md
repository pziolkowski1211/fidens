# Fidens.pl - Projekt strony

## Cel projektu
Strona dla brokera/dealera leasingowego (auta osobowe, ciezarowe, maszyny budowlane, pawilony).
Klienci wchodza glownie z social mediow -> mobile pierwszy priorytet.

## Stack techniczny
- **Next.js 16** (App Router, Turbopack) + TypeScript + Tailwind v4
- **Supabase** - baza danych (Postgres), Auth (panel admina), Storage (zdjecia)
- **Vercel** - hosting -> fidens.pl (+ Vercel Cron Jobs dla synchronizacji OtoMoto)
- **Resend** - wysylka maili DZIALA (powiadomienia o nowych zapytaniach). Do rozwazenia
  w przyszlosci: mailing/newsletter do osob z marketing_consent=true.

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
- RESEND_API_KEY - uzywany w app/kontakt/actions.ts

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
    - Navbar.tsx (nawigacja desktop/mobile + hamburger, STICKY - sticky top-0 z-50)
    - SearchAutocomplete.tsx (wyszukiwarka z autocomplete)
    - Carousel.tsx (karuzela zdjec + lightbox z klawiszami i swipe, uzywana tez przez pawilony)
    - LeasingCalculator.tsx (kalkulator dla POJAZDOW: suwaki, wybor leasing/pozyczka dla VAT-23,
      prop opcjonalny ctaLabel dla customowego tekstu przycisku, domyslnie "Zapytaj o ten pojazd")
    - PawilonCalculator.tsx (ODDZIELNY kalkulator dla PAWILONOW - patrz sekcja "Pawilony" nizej,
      inna logika: brak wykupu zawsze, leasing operacyjny tylko 48/60 msc)
    - ImageUploader.tsx (upload/reorder/cover/delete zdjec w panelu admina + import z OtoMoto)
  - admin/
    - layout.tsx (naglowek z linkami Ogloszenia/Zapytania + Wyloguj)
    - login/ (logowanie admina przez Supabase Auth)
    - ogloszenia/ (lista + CRUD)
      - nowe/ (formularz dodawania, import OtoMoto, toolbar Bold/Lista dla opisu)
      - [id]/ (edycja pojedynczego ogloszenia, te same funkcje co nowe/)
    - zapytania/ (lista contact_requests, oznaczanie przeczytane/notatki/usuwanie)
      - TODO: dodac widoczny znacznik marketing_consent przy kazdym zapytaniu
  - api/
    - cron/
      - otomoto-sync/route.ts (codzienna synchronizacja o 3:00 - dezaktywuje znikniete ogloszenia)
  - ogloszenia/
    - page.tsx (lista ogloszen z filtrami z URL + cover images)
    - [slug]/
      - page.tsx (strona pojedynczego ogloszenia: tytul -> karuzela -> Dane pojazdu -> Opis
        (renderowany z Markdown) -> LeasingCalculator)
  - pawilony/
    - page.tsx (lista realizacji - na sztywno w kodzie, NIE w bazie danych, male skala)
    - domek-caloroczny-35m2-z-antresola/
      - page.tsx (pierwsza realizacja: tytul -> karuzela (6 zdjec) -> Dane obiektu -> Wyposazenie
        -> Sprawdza sie jako -> PawilonCalculator)
  - o-nas/
    - page.tsx (strona "Dlaczego Fidens?" - zaufanie, benefity, CTA)
  - leasing/
    - page.tsx (strona "Leasing dla firm" - edukacyjna, VAT-23 vs VAT-marza, proces)
  - regulamin/
    - page.tsx (regulamin serwisu - szkic z placeholderami danych spolki)
  - polityka/
    - page.tsx (polityka prywatnosci - szkic z placeholderami danych spolki)
    - TODO: dopisac sekcje o zgodzie marketingowej (podstawa prawna: art. 6 ust. 1 lit. a RODO,
      prawo do wycofania zgody w kazdej chwili) - patrz sekcja "Zgoda marketingowa" nizej
  - kontakt/
    - page.tsx (Suspense wrapper)
    - KontaktForm.tsx (Navbar + formularz + stopka, wlasciwy komponent, ma checkbox
      marketing_consent - patrz sekcja nizej)
    - actions.ts (Server Action submitContactForm - zapisuje do Supabase + wysyla mail
      powiadomienia przez Resend)
  - favicon.ico
  - globals.css (cursor:pointer na suwakach input[type=range] i pseudo-elementach thumb)
  - layout.tsx
  - page.tsx (strona glowna z cover images w ogloszeniu tygodnia i najnowszych)
- lib/
  - supabase/
    - client.ts (klient browser)
    - server.ts (klient server, cookies)
    - types.ts (typy TS dla bazy - PAMIETAC o aktualizacji przy KAZDEJ zmianie schematu w Supabase,
      inaczej build sypie sie na TypeScript, np. "Type X is not assignable to type never")
  - leasing/
    - calculator.ts (wspolny wzor raty - uzywany przez LeasingCalculator, PawilonCalculator
      i karty ogloszen)
  - otomoto/
    - scraper.ts (import danych z OtoMoto - patrz sekcja "Import z OtoMoto" ponizej)
  - vehicles/
    - catalog.ts (statyczna lista marek/modeli)
- public/
  - jasne.png (logo na ciemne tlo)
  - ciemne.png (logo na jasne tlo)
  - pawilony/
    - domek-caloroczny-35m2-z-antresola/ (6 zdjec: 1.jpg - 6.jpg, statyczne, NIE w Supabase Storage)
- .env.local (klucze, poza git)
- vercel.json (konfiguracja crona)
- PROJEKT.md (ten plik)
- AGENTS.md (instrukcje dla AI)
- CLAUDE.md (jak wyzej)

## Schemat bazy Supabase
Tabele utworzone (RLS wlaczone). WAZNE: kazda zmiana schematu w Supabase (SQL Editor) MUSI byc
tez odzwierciedlona w lib/supabase/types.ts, inaczej build TypeScript sie wywali.

### listings (ogloszenia)
- id UUID PK
- title, slug (unikalny), vehicle_type ('osobowe'|'ciezarowe'|'maszyna')
- status ('active'|'inactive'|'sold')
- brand, model, variant, year, mileage_km, mileage_hours
- fuel, transmission, power_hp, engine_cc, color, country_origin
- price_pln, leasing_rate_pln, leasing_initial_pct, leasing_months, leasing_residual_pct
- is_featured (Ogloszenie tygodnia), badge ("Nowe"/"Promocja"/null)
- otomoto_url, otomoto_id (do importu/synchronizacji)
- description, location_city
- vat_type ('marza' lub '23'/null - decyduje typ kalkulatora)
- search_vector (TSVECTOR + GIN index dla pelnotekstowego wyszukiwania)

### listing_images (galeria zdjec)
- id, listing_id (FK), storage_path, url, position, is_cover
- Partial unique index: max 1 cover per listing (WHERE is_cover=true)

### contact_requests (zapytania z formularza)
- id, listing_id (FK, nullable), name, phone, email
- leasing_initial_pct, leasing_months, leasing_residual_pct
- marketing_consent boolean NOT NULL DEFAULT false (DODANE dzisiaj - zgoda na marketing,
  patrz sekcja "Zgoda marketingowa" nizej)
- is_read, notes (admin)

### Storage bucket
- listing-images - publiczny odczyt, upload tylko zalogowany admin
- Folder per ogloszenie (nazwa = slug), np. bmw-5-series-530d-xdrive-2022/bmw-1.jpg
- UWAGA: zdjecia PAWILONOW NIE sa tu - sa statyczne w public/pawilony/ (inna, prostsza logika
  bo male skala, brak potrzeby CRUD)

### RLS policies
- Public: SELECT na active listings + ich images, INSERT na contact_requests
- Authenticated (admin): pelny dostep do wszystkich tabel

## Decyzje produktowe (zatwierdzone z klientem)
- **Galeria zdjec:** karuzela z lightbox (kliknij zdjecie zeby powiekszyc)
- **Kalkulator leasingu (pojazdy):** frontend only, parametry wysylane w URL do /kontakt
  - Dla VAT-marza: zawsze pozyczka leasingowa (bez wykupu) - bez wyboru
  - Dla VAT-23: KLIENT WYBIERA miedzy "Leasing operacyjny" (z wykupem, cena liczona od netto)
    a "Pozyczka" (bez wykupu, cena liczona od brutto) - przelacznik nad kalkulatorem
  - Wzor: annuita z balonem, APR 5,4% (najkorzystniej) do 7,3% (najmniej korzystnie)
  - Uklad "wariant A": rata jako hero (44px), cena drobno pod ratą
  - Cursor pointer na suwakach (thumb) i przyciskach wyboru typu finansowania
  - Prop ctaLabel (opcjonalny) pozwala zmienic tekst przycisku bez wplywu na inne strony
- **Wyszukiwarka:** autocomplete typu Google ze statycznej listy (~50 marek + modele).
- **Mobile nawigacja:** logo + lupa + hamburger. Drawer wysuwany z prawej.
- **Logo klikalne** (powrot na strone glowna).
- **Navbar sticky** - zostaje przyklejony na gorze podczas scrollowania (position: sticky top-0 z-50).
- **Import z OtoMoto:** scraping po URL ogloszenia (brak oficjalnego API). Szczegoly nizej.
- **Formatowanie opisu ogloszen:** wlasny, lekki parser Markdown (bez zewnetrznej biblioteki).
  Obslugiwane: naglowki # ## ### (rozne rozmiary), **pogrubienie**, listy "- "/"* ",
  linia poziona --- lub ***, calkowicie pogrubiona linia konczaca sie dwukropkiem (**Tekst:**)
  tez traktowana jak naglowek. Funkcje renderDescription + parseInlineBold w
  app/ogloszenia/[slug]/page.tsx. Przyciski "B"/"Lista" w panelu admina (oba formularze).
- **Podmiot prawny:** dokumenty prawne (Regulamin/Polityka) na spolke z o.o. (jeszcze
  niezalozona/w trakcie), nie na obecna JDG.
- **PAWILONY (nowa sekcja, ZROBIONA):** osobna zakladka w Navbarze. Podejscie "male portfolio
  na sztywno w kodzie" (NIE baza danych, NIE panel admina) - klient chcial to tak, bo rzadko
  bedzie zmieniac, a przy zmianie i tak edytuje cale ogloszenie. Kazda realizacja to osobny
  statyczny route (np. /pawilony/domek-caloroczny-35m2-z-antresola), zdjecia statyczne w
  public/pawilony/[nazwa]/. Struktura strony analogiczna do /ogloszenia/[slug] (Carousel,
  Dane obiektu, listy cech), ale kalkulator to ODDZIELNY komponent PawilonCalculator.
  - **Zasady finansowania pawilonow (INNE niz przy pojazdach!):**
    - Leasing operacyjny: TYLKO 48 lub 60 miesiecy (przyciski, nie suwak), NIGDY bez wykupu
      (w przeciwienstwie do pojazdow, gdzie leasing operacyjny ZAWSZE ma wykup) - cena mimo
      to liczona od NETTO (VAT nadal odliczalny)
    - Pozyczka: bez zmian wzgledem istniejacej logiki (24-72 msc suwak, cena brutto, bez wykupu)
    - "Leasing finansowy" byl rozwazany jako trzeci typ (od 6 msc), ale ODRZUCONY - klient
      zauwazyl ze matematycznie nie rozni sie od pozyczki, wiec zbedny
  - Ceny realizacji: orientacyjne, z wyraznym zastrzezeniem ze finalna cena zalezy od
    indywidualnej specyfikacji (dostawca wycenia projekt na zamowienie z plyty warstwowej)
- **NOWE kategorie produktowe (ustalone biznesowo, JESZCZE NIE zakodowane):**
  - **Pojazdy/sprzet na kolach** (rozszerzenie istniejacego vehicle_type): dodac "dostawcze"
    i "naczepy" do istniejacych osobowe/ciezarowe/maszyna.
  - **"Maszyny przemyslowe"** (osobna zakladka) - maszyny stolarskie od wspolnika (firma
    Gantech, gantech-maszyny.pl). NIE MYLIC z "maszynami budowlanymi" w /ogloszenia.
    Mala skala na start, elastyczne parametry.
  - **"Import"** (osobna zakladka, nazwa do ustalenia) - przedmioty 250-300k+ PLN z zagranicy,
    podejscie portfolio, kazdy przypadek omawiany indywidualnie z klientem.
  - Fotowoltaika/pompy ciepla/magazyny energii - NIE ROBIMY (odrzucone przez klienta).

## Zgoda marketingowa (ZROBIONE czesciowo dzisiaj)

### Co jest zrobione
- Checkbox w formularzu /kontakt (app/kontakt/KontaktForm.tsx) - WYRAZNIE oznaczony wizualnie
  (zolte tlo #FFF8E8, ramka pomaranczowa, wiekszy checkbox w=h=5, accentColor pomaranczowy),
  ale ODZNACZONY DOMYSLNIE (wymog prawny - RODO art. 7 ust. 4 + Prawo telekomunikacyjne art. 172,
  wyrok TSUE Planet49 C-673/17). Tekst: "Chcę otrzymywać informacje o promocjach i nowych
  ofertach Fidens." - CELOWO osobny od zdania o przetwarzaniu danych w celu oferty (te dwie
  zgody NIE MOGA byc polaczone w jedno zdanie/checkbox - to bylby powazny blad prawny, klient
  chcial to polaczyc, wytlumaczono mu dlaczego nie mozna).
- Kolumna marketing_consent boolean NOT NULL DEFAULT false w contact_requests (dodana przez
  Supabase SQL Editor, NIE przez migracje w kodzie - trzeba pamietac o tym przy kolejnych
  zmianach schematu, ze robi sie to recznie w Supabase dashboard)
- app/kontakt/actions.ts czyta formData.get("marketingConsent") === "on" i zapisuje do bazy
- lib/supabase/types.ts zaktualizowany o marketing_consent: boolean

### Do zrobienia (TODO)
- Znacznik/badge w /admin/zapytania pokazujacy marketing_consent przy kazdym zapytaniu
- Dopisac do Polityki Prywatnosci (/polityka) sekcje o tej nowej podstawie przetwarzania:
  podstawa prawna art. 6 ust. 1 lit. a RODO (zgoda), prawo do wycofania zgody w kazdej chwili,
  jak wypisac sie z komunikacji marketingowej
- Docelowo: funkcja wysylki mailingu (np. zyczenia swiateczne, promocje) do wszystkich z
  marketing_consent=true, przez Resend. Na start wystarczy recznie wyeksportowac liste z
  Supabase (SQL: SELECT email FROM contact_requests WHERE marketing_consent = true) i wyslac
  przez Resend recznie/prostym skryptem. Pelny system kampanii w panelu admina - dopiero
  gdy realnie potrzebny (wiecej zebranych zgod).

## Strony statyczne

### /o-nas - "Dlaczego Fidens?"
Zrobione. Krotka strona budujaca zaufanie (benefity, wspolpraca z bankami, kompleksowa obsluga,
osobisty kontakt) + CTA. Link w Navbar i stopce: "Poznaj Fidens".

### /leasing - "Leasing dla firm"
Zrobione. Strona edukacyjno-sprzedazowa dla klientow B2B (VAT-23 vs VAT-marza, proces).
Usunieta z gownego Navbara - zostaje TYLKO w stopce (cel: SEO).

### /pawilony
Zrobione (pierwsza realizacja). Patrz sekcja "Decyzje produktowe" wyzej dla pelnych szczegolow.

### /regulamin i /polityka
Zrobione (szkic). NIE zweryfikowane prawniczo. Placeholdery danych spolki oznaczone zoltym
tlem (latwo zauwazalne): [NAZWA SPOLKI], [MIASTO], [ADRES], [NIP], [REGON], [KRS], [DATA].

WAZNE PRZED PUBLIKACJA NA PRODUKCJI:
- Uzupelnic dane spolki z o.o. po jej zalozeniu/rejestracji
- Skonsultowac oba dokumenty z prawnikiem/kancelaria
- Dopisac sekcje o zgodzie marketingowej (patrz "Zgoda marketingowa" wyzej)
- Fidens zbiera WYLACZNIE: imie, nazwisko, NIP, telefon, e-mail (formularz kontaktowy) +
  teraz TEZ opcjonalna zgode marketingowa
- Sekcja cookies opisuje stan faktyczny: brak GA/Meta Pixel. GDY klient wdrozy te narzedzia -
  TRZEBA zaktualizowac Polityke + dodac banner zgody na cookies PRZED zaladowaniem (RODO/ePrivacy)

## Navbar - struktura (zaktualizowana)

### Desktop (top menu)
Ogloszenia -> Pawilony -> Poznaj Fidens -> Kontakt -> CTA "Zamow bezplatna kalkulacje"
STICKY - przyklejony do gory ekranu przy scrollowaniu.

### Mobile (drawer)
Strona glowna -> Ogloszenia -> Pawilony -> Poznaj Fidens -> Kontakt -> CTA

### Stopka (kopiowana per-strona, patrz "Znane problemy")
Poznaj Fidens, Leasing, Kontakt, Regulamin, Polityka prywatnosci
Ujednolicona na WSZYSTKICH stronach.

## Strona pojedynczego ogloszenia /ogloszenia/[slug] - uklad
1. Okruszki (breadcrumb) - strzalka "rsaquo", hover pomaranczowy przez CSS (NIE onMouseEnter/
   onMouseLeave - to Server Component)
2. Tytul (h1) + badge
3. Karuzela zdjec
4. Dane pojazdu
5. Opis (Markdown)
6. LeasingCalculator (sidebar, sticky)

## Pawilony /pawilony/[nazwa] - uklad
1. Okruszki (Strona glowna > Pawilony > [Nazwa])
2. Tytul (h1)
3. Carousel (te same komponent co ogloszenia, zdjecia statyczne z public/)
4. Dane obiektu (wymiary, powierzchnia)
5. Wyposazenie (lista)
6. Sprawdza sie jako (lista zastosowan) + zastrzezenie o indywidualnej wycenie
7. PawilonCalculator (sidebar, sticky) - ctaLabel="Zapytaj o ten obiekt"

## Import z OtoMoto - szczegoly (lib/otomoto/scraper.ts)

### Jak dziala
Strona OtoMoto (Next.js) osadza dane w bloku __NEXT_DATA__. Scraper wyciaga dwa obiekty przez
dopasowanie nawiasow klamrowych (funkcja extractJsonObject, marker + brace-matching):
- **widget.props.advert** (marker: financingAdCarDetailsWidget/financingSimulatorWidget)
  -> podstawowe dane: id, title, rawPrice, make, model, year, mileage, fuelType
- **fullAdvert** (marker: '"advert":{"id":"' - LAPIE PIERWSZE wystapienie, czyli glowny advert)
  -> fullAdvert.details to tablica {key, label, value, group} ZE WSZYSTKIMI polami technicznymi
  NIEZALEZNIE od CEPIK. Budowane w detailsMap. To glowne, niezawodne zrodlo.
- cepikWidget - fallback, CZESTO NIEDOSTEPNE (status!=0). Kolor/skrzynia/moc/pojemnosc/kraj
  brane najpierw z detailsMap, dopiero potem z cepikDetails jako fallback.

### Niezawodnosc
- fetch() ma timeout 15s (AbortController)

### Struktura plikow (WAZNE - dwa osobne pliki, nie mieszac!)
- app/admin/ogloszenia/otomoto-actions.ts - TYLKO importOtomotoListing (dane tekstowe:
  marka/model/cena/rok/przebieg/paliwo/moc/pojemnosc/skrzynia/kolor/kraj). NIE importuje
  sharp i NIE laczy sie z Supabase - lekki, szybki.
- app/admin/ogloszenia/otomoto-photos-actions.ts - TYLKO importOtomotoPhotos (import zdjec,
  przycinanie znaku wodnego). Importuje sharp - CIEZKI, wymaga natywnej biblioteki.
- POWOD ROZDZIELENIA (incydent 29.08): oba byly w jednym pliku z sharp zaimportowanym na
  gorze. Nawet klikniecie "Importuj dane" (ktore sharp w ogole nie uzywa) ladowalo caly
  modul, w tym sharp - a na Vercel sharp nie mogl zaladowac natywnej biblioteki
  (ERR_DLOPEN_FAILED: libvips-cpp.so... cannot open shared object file), co psulo NAWET
  funkcje ktore sharp nie potrzebuja. Rozdzielenie na dwa pliki naprawilo import danych
  natychmiast, bez potrzeby naprawiania samego sharp.
- next.config.ts ma serverExternalPackages: ["sharp"] (mowi Turbopack zeby nie probowal
  pakowac natywnego modulu sharp, tylko zostawic go jako zwykly require() Node.js) - to
  NIE wystarczylo samo w sobie do naprawy bledu (blad nadal wystepowal przy imporcie zdjec
  po tej zmianie), ale zostaje jako dobra praktyka.
- WNIOSEK NA PRZYSZLOSC: pliki z ciezkimi/natywnymi zaleznosciami (sharp, i podobne) NIE
  powinny byc w tym samym module co lekkie funkcje wywolywane czesciej/w innych kontekstach -
  nawet nieuzywany import u gory pliku wplywa na cala reszte modulu.
- app/admin/ogloszenia/nowe/layout.tsx i app/admin/ogloszenia/[id]/layout.tsx maja
  export const maxDuration = 30 (Server Component wrapper, bo same page.tsx sa "use client"
  i nie moga eksportowac route segment config) - wydluza limit czasu funkcji Vercel z
  domyslnych 10s. To osobna, mniejsza poprawka - nie byla finalnym rozwiazaniem problemu
  z importem danych (to byl sharp), ale warto ja zachowac na wypadek gdyby import
  faktycznie kiedys trwal dlugo (np. wolna odpowiedz OtoMoto).
- handleImportOtomoto ma try/catch/finally - setImporting(false) ZAWSZE sie wykona

## Kalkulator leasingu (pojazdy) - szczegoly

### Wzor (lib/leasing/calculator.ts, wspolny z PawilonCalculator)
Klasyczna annuita z balonem:
kapital = cena - wplata
PV = kapital - wykup / (1+r)^n
rata = PV * r / (1 - (1+r)^(-n))

### APR (5,4% - 7,3%)
Score liczony ze srednich: wplata_score, okres_score, (opcjonalnie wykup_score jesli hasWykup)
APR = APR_MIN + score * (APR_MAX - APR_MIN)

### Wybor typu finansowania (LeasingCalculator - pojazdy)
- VAT-marza: zawsze pozyczka (bez wykupu)
- VAT-23: przelacznik Leasing operacyjny (hasWykup=true, cena od netto) / Pozyczka (od brutto)

### Limity suwakow (pojazdy)
- Wplata: 0-45%
- Okres: 24-72 msc (krok 12)
- Wykup: dynamiczny min/max zalezny od okresu (24msc: 16-55%, 36: 1-45%, 48: 1-40%, 60: 1-35%, 72: 1-30%)

### Rata "od X zl" na kartach ogloszen
Funkcja calculateShowcaseRate() - wariant B (wplata 20%, okres 60 msc, wykup MAX dla okresu).

## Stan prac

### Zrobione
- [x] Konto Supabase + projekt "Fidens", schemat bazy, klucze, klienty, typy TS
- [x] Statyczny katalog marek/modeli, wyszukiwarka autocomplete
- [x] Strona glowna, /ogloszenia z filtrami, logo klikalne, responsywnosc
- [x] Strona pojedynczego ogloszenia, karuzela + lightbox
- [x] Cover images, zdjecia w Storage
- [x] LeasingCalculator z wyborem typu finansowania dla VAT-23
- [x] Formularz kontaktowy /kontakt + Resend (powiadomienie mailowe)
- [x] Strony /o-nas, /leasing, /regulamin, /polityka (dwie ostatnie - szkic)
- [x] Panel admina /admin (login, CRUD ogloszen, lista zapytan)
- [x] Import z OtoMoto (niezawodny - timeout + try/catch + detailsMap)
- [x] Synchronizacja z OtoMoto - Vercel Cron, codziennie o 3:00
- [x] Navbar: Ogloszenia + Pawilony w menu, Leasing tylko w stopce, sticky
- [x] Ujednolicone stopki na wszystkich stronach
- [x] Formatowanie opisu ogloszen (Markdown) + przyciski Bold/Lista w admin
- [x] Dynamiczna rata "od X zl" na kartach ogloszen
- [x] **Pawilony** - strona listy + pierwsza realizacja, PawilonCalculator (48/60 msc bez wykupu)
- [x] **Cursor pointer wszedzie** - suwaki, przyciski w kalkulatorach, formularz kontaktowy,
  CALY panel admina (login, wyloguj, zapytania, formularze ogloszen, ImageUploader)
- [x] **Zgoda marketingowa** - checkbox w /kontakt (widoczny, nie pre-checked), kolumna
  marketing_consent w bazie, zapis dziala. TODO: badge w /admin/zapytania, Polityka Prywatnosci
- [x] Wgrane na Vercel -> fidens.pl

### Do zrobienia (priorytety)

1. **Dokonczenie zgody marketingowej** (male, szybkie)
   - Badge/znacznik marketing_consent w /admin/zapytania
   - Dopisac sekcje do Polityki Prywatnosci

2. **Rozszerzenie kategorii pojazdow** - dodac "dostawcze" i "naczepy" do vehicle_type

3. **Nowa architektura: kategorie poza pojazdami** (osobna sesja)
   - "Maszyny przemyslowe" (Gantech), "Import" - kazda jako osobna zakladka w Navbarze
   - Pawilony juz maja wzorzec (statyczne strony, bez bazy) - mozna go powielic dla kolejnych
     kategorii JESLI tez maja pozostac male; jesli "Maszyny przemyslowe" urosna do wielu
     pozycji, rozwazyc przejscie na baze + panel admina (podobnie jak /ogloszenia)

4. **Regulamin i polityka prywatnosci** - uzupelnic dane spolki z o.o., konsultacja prawnicza

5. **Kolejne realizacje pawilonow** - Piotr ma wiecej zdjec/projektow do dodania w przyszlosci,
   powielic wzorzec z domek-caloroczny-35m2-z-antresola

6. **SEO i optymalizacja**
   - next/image zamiast <img>, next.config.ts remotePatterns
   - Kalibracja kalkulatora (tabela marz od klientki)
   - Favicon z logo Fidens, meta tagi (OG + description per strona)
   - FAQ, Blog (rozwazane, nie ustalone)

7. **Docelowo: mailing/newsletter** - wysylka do osob z marketing_consent=true przez Resend
   (patrz sekcja "Zgoda marketingowa" wyzej dla szczegolow)

## Konwencje pracy
- **Pisanie kodu:** komendy w terminalu (PowerShell) z Out-File -Encoding utf8
- **Test:** zawsze npm run dev na localhost:3000 + sprawdzenie mobile
- **Wgranie:** git add . && git commit -m "opis" && git push -> Vercel auto-rebuild
- **PRZED KAZDYM PUSHEM:** npm run build lokalnie
- **PRZED ZALOZENIEM CZEGOS O STANIE PROJEKTU:** sprawdzic w kodzie, nie zgadywac na podstawie
  samej dokumentacji
- **Zmiany schematu bazy Supabase robi sie RECZNIE przez SQL Editor w panelu Supabase**
  (przegladarka), NIE przez PowerShell/migracje w kodzie. PO KAZDEJ takiej zmianie trzeba
  recznie zaktualizowac lib/supabase/types.ts, inaczej build TypeScript sie wywali z bledem
  "Type X is not assignable to type never" (bo typ Insert jest budowany z Omit<> na bazie
  glownego typu, ktory nie zna nowego pola)
- **Podmiana tekstu w duzych/skomplikowanych plikach ($content.Replace) czesto zawodzi**
  przez niewidoczne roznice w bialych znakach - gdy tak sie stanie, przejsc na metode po
  numerach linii ([System.Collections.Generic.List[string]] + RemoveRange/InsertRange),
  ZAWSZE najpierw wypisac fragment zeby potwierdzic dokladne numery linii, i ZAWSZE
  zweryfikowac SZERSZY kontekst po edycji
- **Server Components NIE MOGA miec event handlerow** (onClick, onMouseEnter) w JSX -
  uzywac czystego CSS/Tailwind (hover:text-[...])
- **position: sticky dziala jako kontekst pozycjonowania** dla potomkow absolute, tak samo
  jak position:relative
- **cursor-pointer NIE jest domyslny na <button> w tym projekcie** - Tailwind/przegladarka
  czasem nie pokazuje "łapki" na natywnych <button>, trzeba dopisywac cursor-pointer
  explicite na kazdym klikalnym elemencie (i disabled:cursor-not-allowed gdy przycisk
  moze byc disabled). Latwo o tym zapomniec przy nowych komponentach - WARTO sprawdzac
  od razu przy tworzeniu nowego przycisku, zamiast doklejac to pozniej zbiorczo.
- **Gdy $content.Replace zwraca "0 wystapien" ale kod WYGLADA na juz zmieniony** - to moze
  oznaczac ze zmiana juz zaszla wczesniej (np. w poprzedniej probie), a nie ze cos jest nie
  tak - zawsze weryfikowac faktyczny stan pliku (Get-Content konkretnej linii) zamiast ufac
  samemu komunikatowi "0 wystapien" jako oznace bledu

## Znane problemy/uwagi
- **Hydration warning** od rozszerzenia Bitdefender (bis_register, bis_skin_checked) - NIE jest
  bledem kodu, tylko dev warning. Niewidoczny w produkcji.
- **PowerShell + polskie znaki w komendach:** nie dziala we FLAGACH, ale tresc plikow
  (-Encoding utf8) MOZE miec polskie znaki wpisane bezposrednio.
- **W folderach z nawiasami kwadratowymi ([slug], [id]):** uzywac -LiteralPath wszedzie.
- **Dev serwer nie pokazuje najnowszych zmian -> stare wersje w cache:** ZDARZALO SIE
  WIELOKROTNIE. Procedura: taskkill /IM node.exe /F, Remove-Item -Recurse -Force .next,
  npm run dev, twardy refresh (Ctrl+Shift+R). Upewnic sie ze test jest na localhost:3000.
  TAKZE dotyczy npm run build - jesli dev server dziala rownolegle w tle, build moze sie
  wywalic na bledzie w .next/dev/types/routes.d.ts - ta sama procedura to naprawia.
- **Klasy Tailwinda w kwadratowych nawiasach (np. text-[10px]):** czasem sypia sie w Next 16.2.4.
- **URL nie moze miec polskich znakow:** ostroznie przy Ctrl+H w VS Code.
- **Stopka duplikowana per-strona:** nie jest osobnym komponentem, wklejona recznie w kazdym
  page.tsx (w /kontakt - w KontaktForm.tsx, DWUKROTNIE dla dwoch stanow formularza). Do
  rozwazenia: wydzielenie do wspolnego komponentu Footer.tsx.
- **Niektore pliki mialy realnie zepsute kodowanie UTF-8** (nie tylko problem terminala) -
  stwierdzone i naprawione w app/kontakt/page.tsx i LeasingCalculator.tsx. Jesli znowu -
  nadpisac cala zawartosc pliku na nowo, nie probowac punktowych podmian.
