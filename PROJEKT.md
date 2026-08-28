# Fidens.pl - Projekt strony

## Cel projektu
Strona dla brokera/dealera leasingowego (auta osobowe, ciezarowe, maszyny budowlane).
Klienci wchodza glownie z social mediow -> mobile pierwszy priorytet.

## Stack techniczny
- **Next.js 16** (App Router, Turbopack) + TypeScript + Tailwind v4
- **Supabase** - baza danych (Postgres), Auth (panel admina), Storage (zdjecia)
- **Vercel** - hosting -> fidens.pl (+ Vercel Cron Jobs dla synchronizacji OtoMoto)
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
    - Navbar.tsx (nawigacja desktop/mobile + hamburger, STICKY - sticky top-0 z-50)
    - SearchAutocomplete.tsx (wyszukiwarka z autocomplete)
    - Carousel.tsx (karuzela zdjec + lightbox z klawiszami i swipe)
    - LeasingCalculator.tsx (kalkulator leasingu/pozyczki z suwakami + wybor typu dla VAT-23)
  - admin/
    - login/ (logowanie admina przez Supabase Auth)
    - ogloszenia/ (lista + CRUD)
      - nowe/ (formularz dodawania, import OtoMoto, toolbar Bold/Lista dla opisu)
      - [id]/ (edycja pojedynczego ogloszenia, te same funkcje co nowe/)
    - zapytania/ (lista contact_requests)
  - api/
    - cron/
      - otomoto-sync/route.ts (codzienna synchronizacja o 3:00 - dezaktywuje znikniete ogloszenia)
  - ogloszenia/
    - page.tsx (lista ogloszen z filtrami z URL + cover images)
    - [slug]/
      - page.tsx (strona pojedynczego ogloszenia: tytul -> karuzela -> Dane pojazdu -> Opis
        (renderowany z Markdown: naglowki #/##/###, pogrubienie, listy, ---) -> kalkulator)
  - o-nas/
    - page.tsx (strona "Dlaczego Fidens?" - zaufanie, benefity, CTA)
  - leasing/
    - page.tsx (strona "Leasing dla firm" - edukacyjna, VAT-23 vs VAT-marza, proces)
  - regulamin/
    - page.tsx (regulamin serwisu - szkic z placeholderami danych spolki)
  - polityka/
    - page.tsx (polityka prywatnosci - szkic z placeholderami danych spolki)
  - kontakt/
    - page.tsx (Suspense wrapper)
    - KontaktForm.tsx (Navbar + formularz + stopka, wlasciwy komponent)
  - favicon.ico
  - globals.css (cursor:pointer na suwakach input[type=range] i pseudo-elementach thumb)
  - layout.tsx
  - page.tsx (strona glowna z cover images w ogloszeniu tygodnia i najnowszych)
- lib/
  - supabase/
    - client.ts (klient browser)
    - server.ts (klient server, cookies)
    - types.ts (typy TS dla bazy)
  - leasing/
    - calculator.ts (wspolny wzor raty - uzywany przez kalkulator interaktywny i karty ogloszen)
  - otomoto/
    - scraper.ts (import danych z OtoMoto - patrz sekcja "Import z OtoMoto" ponizej)
  - vehicles/
    - catalog.ts (statyczna lista marek/modeli)
- public/
  - jasne.png (logo na ciemne tlo)
  - ciemne.png (logo na jasne tlo)
- .env.local (klucze, poza git)
- vercel.json (konfiguracja crona)
- PROJEKT.md (ten plik)
- AGENTS.md (instrukcje dla AI)
- CLAUDE.md (jak wyzej)

## Schemat bazy Supabase
Tabele utworzone (RLS wlaczone):

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
- is_read, notes (admin)

### Storage bucket
- listing-images - publiczny odczyt, upload tylko zalogowany admin
- Folder per ogloszenie (nazwa = slug), np. bmw-5-series-530d-xdrive-2022/bmw-1.jpg

### RLS policies
- Public: SELECT na active listings + ich images, INSERT na contact_requests
- Authenticated (admin): pelny dostep do wszystkich tabel

## Decyzje produktowe (zatwierdzone z klientem)
- **Galeria zdjec:** karuzela z lightbox (kliknij zdjecie zeby powiekszyc)
- **Kalkulator leasingu:** frontend only, parametry wysylane w URL do /kontakt
  - Dla VAT-marza: zawsze pozyczka leasingowa (bez wykupu) - bez wyboru
  - Dla VAT-23: KLIENT WYBIERA miedzy "Leasing operacyjny" (z wykupem, cena liczona od netto)
    a "Pozyczka" (bez wykupu, cena liczona od brutto) - przelacznik nad kalkulatorem
  - Wzor: annuita z balonem, APR 5,4% (najkorzystniej) do 7,3% (najmniej korzystnie)
  - Uklad "wariant A": rata jako hero (44px), cena drobno pod ratą
  - Cursor pointer na suwakach (thumb) i przyciskach wyboru typu finansowania
  - Mini-link "co to znaczy?" w kalkulatorze - ODRZUCONE, klient zdecydowal ze niepotrzebne
- **Wyszukiwarka:** autocomplete typu Google ze statycznej listy (~50 marek + modele).
  Klik w sugestie -> /ogloszenia?marka=X&model=Y. Brak wynikow -> CTA "Zapytaj o ten pojazd" z prefilled marka/modelem.
- **Mobile nawigacja:** logo + lupa + hamburger. Drawer wysuwany z prawej.
- **Logo klikalne** (powrot na strone glowna).
- **Navbar sticky** - zostaje przyklejony na gorze podczas scrollowania (position: sticky,
  nie fixed - dzieki temu content pod nim nie "skacze"). Dziala tez jako kontekst
  pozycjonowania dla wyszukiwarki desktop (absolute, wycentrowana).
- **Import z OtoMoto:** scraping po URL ogloszenia (brak oficjalnego API). Szczegoly nizej.
- **Formatowanie opisu ogloszen:** wlasny, lekki parser Markdown (bez zewnetrznej biblioteki).
  Obslugiwane: naglowki # ## ### (rozne rozmiary), **pogrubienie**, listy zaczynajace sie
  od "- " lub "* ", linia poziona --- lub ***, calkowicie pogrubiona linia konczaca sie
  dwukropkiem (**Tekst:**) tez traktowana jak naglowek. Funkcje renderDescription +
  parseInlineBold w app/ogloszenia/[slug]/page.tsx. W panelu admina (oba formularze:
  nowe/ i [id]/) przyciski "B" (pogrubienie) i "* Lista" nad polem Opis, dzialaja przez
  manipulacje textarea (selectionStart/End + useRef), nie przez contentEditable/WYSIWYG.
- **Strony statyczne - marka Fidens:** nie ujawniamy rozmiaru zespolu na stronie (marka pisana
  bezosobowo/w trzeciej osobie). Fidens = nowa marka, ale wlasciciel ma wieloletnie (6+ lat)
  doswiadczenie w branzy - komunikujemy to jako "wieloletnie doswiadczenie stojace za marka",
  NIE jako "Fidens dziala od 6 lat" (to bylaby nieprawda). Nie pokazujemy log bankow (kwestia
  prawna - znaki towarowe), tylko nazwy tekstowo. Model biznesowy: Fidens promuje przedmioty
  od zewnetrznych dostawcow (salony/komisy/firmy handlowe) i zarabia na prowizji z finansowania,
  nie na marzy ze sprzedazy pojazdu.
- **Podmiot prawny:** klient zdecydowal - dokumenty prawne (Regulamin/Polityka) robimy na
  spolke z o.o. (jeszcze niezalozona/w trakcie), nie na obecna JDG.
- **Nowe kategorie produktowe poza pojazdami (ustalone biznesowo, NIE zakodowane -
  patrz "Do zrobienia"):**
  - **Pojazdy/sprzet na kolach** (rozszerzenie istniejacego vehicle_type): dodac "dostawcze"
    i "naczepy" do istniejacych osobowe/ciezarowe/maszyna. Zostaja w /ogloszenia, wspolny model danych.
  - **"Maszyny przemyslowe"** (osobna kategoria/zakladka w Navbarze) - maszyny stolarskie
    od wspolnika (firma Gantech, gantech-maszyny.pl - strugarki, piły panelowe, wielopily,
    rebaki, frezarki CNC). NIE MYLIC z "maszynami budowlanymi" w /ogloszenia (koparki itp,
    inne parametry: waga/wymiary/moc w kW zamiast motogodzin/mocy w KM). Mala skala na start
    (kilka-kilkanascie pozycji) - elastyczne parametry (JSON), nie sztywne kolumny.
  - **"Pawilony"** (osobna zakladka) - dostawcy klienta, ma zdjecia z produkcji. Podejscie
    portfolio (male, bez pelnych filtrow jak /ogloszenia).
  - **"Import"** (osobna zakladka, inna nazwa niz "Import" zeby klient wiedzial ze Fidens
    sprowadza maszyne/pojazd dla niego - nazwa do ustalenia) - przedmioty 250-300k+ PLN
    z zagranicy. Podejscie portfolio + kilka zdjec, KAZDY PRZYPADEK OMAWIANY INDYWIDUALNIE
    z klientem (nie probowac zrobic ogolnej strony z detalami operacyjnymi clo/homologacja -
    to bylo pierwotne zalozenie, klient je odrzucil na rzecz prostszego podejscia).
  - Fotowoltaika/pompy ciepla/magazyny energii - NA RAZIE NIE ROBIMY (odrzucone przez klienta
    w tej sesji, byla to wczesniejsza koncepcja w ramach "Inne").
  - Architektura techniczna (do zaprojektowania w kolejnej sesji): prawdopodobnie nowa
    tabela other_listings z elastycznymi specs (JSON key-value) zamiast sztywnych kolumn,
    osobne strony per kategoria lub wspolna z filtrem kategorii, osobny/rozszerzony panel admina.

## Strony statyczne

### /o-nas - "Dlaczego Fidens?"
Zrobione. Krotka strona budujaca zaufanie: benefity (sprawdzeni dostawcy, finansowanie
dopasowane, wspolpraca z bankami, kompleksowa obsluga od A do Z - ubezpieczenie/GAP/rejestracja,
osobisty kontakt) + CTA do /ogloszenia i /kontakt. Link w Navbar i stopce: "Poznaj Fidens".

### /leasing - "Leasing dla firm"
Zrobione. Strona edukacyjno-sprzedazowa dla klientow B2B: sekcja "Dlaczego leasing przez
Fidens" (dobor finansowania, kompleksowa obsluga w jednym miejscu), tabela leasing operacyjny
(VAT-23) vs pozyczka leasingowa (VAT-marza), proces krok po kroku (wybor przedmiotu -> parametry
w kalkulatorze -> zapytanie -> podpisanie umowy).
WAZNE: usunieta z gownego Navbara (desktop i mobile) - zostaje TYLKO w stopce (cel: SEO,
strona nie zachecala do klikniecia jako pozycja menu).

### /regulamin i /polityka
Zrobione (szkic). Tresc oparta na standardowych praktykach dla posrednictwa finansowego,
NIE zweryfikowana prawniczo. Placeholdery danych spolki oznaczone zoltym tlem na stronie
(latwo zauwazalne): [NAZWA SPOLKI], [MIASTO], [ADRES], [NIP], [REGON], [KRS], [DATA].

WAZNE PRZED PUBLIKACJA NA PRODUKCJI:
- Uzupelnic dane spolki z o.o. po jej zalozeniu/rejestracji
- Skonsultowac oba dokumenty z prawnikiem/kancelaria
- Fidens zbiera WYLACZNIE: imie, nazwisko, NIP, telefon, e-mail (formularz kontaktowy).
  Dane wrazliwe (PESEL, dowod, finanse, wspolmalzonek) zbiera bank/leasingodawca
  bezposrednio, NIE Fidens
- Sekcja cookies opisuje stan faktyczny: brak GA/Meta Pixel. Klient chce je wdrozyc
  w przyszlosci - GDY to nastapi, TRZEBA zaktualizowac Polityke + dodac banner zgody
  na cookies PRZED zaladowaniem tych narzedzi (wymog RODO/ePrivacy)

## Navbar - struktura (zaktualizowana)

### Desktop (top menu)
Ogloszenia -> Poznaj Fidens -> Kontakt -> CTA "Zamow bezplatna kalkulacje"
STICKY - przyklejony do gory ekranu przy scrollowaniu (sticky top-0 z-50).

### Mobile (drawer)
Strona glowna -> Ogloszenia -> Poznaj Fidens -> Kontakt -> CTA
(ujednolicone z desktop)

### Stopka (kopiowana per-strona, patrz "Znane problemy")
Poznaj Fidens, Leasing, Kontakt, Regulamin, Polityka prywatnosci
Ujednolicona na WSZYSTKICH stronach: glowna, /ogloszenia, /ogloszenia/[slug], /kontakt,
/o-nas, /leasing, /regulamin, /polityka.

## Strona pojedynczego ogloszenia /ogloszenia/[slug] - uklad
Kolejnosc:
1. Okruszki (breadcrumb) - stylizowane: strzalka "rsaquo" zamiast ">", hover pomaranczowy
   (CSS hover:text-[#F0A500], NIE onMouseEnter/onMouseLeave - to Server Component)
2. Tytul ogloszenia (h1) + badge ("Nowe"/"Promocja")
3. Karuzela zdjec
4. Dane pojazdu (tabela parametrow)
5. Opis (renderowany z Markdown - patrz "Formatowanie opisu ogloszen" wyzej)
6. Kalkulator leasingu (w bocznym sidebarze, sticky)

## Import z OtoMoto - szczegoly (lib/otomoto/scraper.ts)

### Jak dziala
Strona OtoMoto (Next.js) osadza dane w bloku __NEXT_DATA__. Scraper wyciaga dwa obiekty
przez dopasowanie nawiasow klamrowych (funkcja extractJsonObject, marker + brace-matching,
NIE regex na cala tresc):
- **widget.props.advert** (marker: financingAdCarDetailsWidget lub financingSimulatorWidget)
  -> podstawowe dane: id, title, rawPrice, make, model, year, mileage, fuelType
- **fullAdvert** (marker: '"advert":{"id":"' - LAPIE PIERWSZE wystapienie w dokumencie,
  czyli glowny obiekt advert, nie mniejsze wersje w widgetach) -> fullAdvert.details to
  tablica {key, label, value, group} ZE WSZYSTKIMI polami technicznymi (fuel_type,
  engine_capacity, engine_power, body_type, gearbox, transmission, country_origin, color...)
  NIEZALEZNIE od tego czy ogloszenie ma zweryfikowane dane CEPIK. To glowne, niezawodne
  zrodlo - budowane w detailsMap (Record<string,string> po d.key).
- cepikWidget - dodatkowe zrodlo (fallback), CZESTO NIEDOSTEPNE (status!=0) bo wymaga
  zweryfikowanych danych CEPIK. Kolor/skrzynia/moc/pojemnosc/kraj brane najpierw z
  detailsMap, dopiero potem z cepikDetails jako fallback.

### Niezawodnosc
- fetch() ma teraz timeout 15s (AbortController) - jesli OtoMoto nie odpowie, rzuca
  czytelny blad zamiast wisiec w nieskonczonosc
- handleImportOtomoto w formularzu ma try/catch/finally - setImporting(false) ZAWSZE
  sie wykona, nawet przy nieoczekiwanym bledzie (przycisk nigdy nie zawiesza sie na
  "Importowanie..." bez konca)
- Warianty (wersje wyposazenia) NIE sa jeszcze wyciagane automatycznie - zawsze warning

## Kalkulator leasingu - szczegoly

### Wzor (LeasingCalculator.tsx)
Klasyczna annuita z balonem:
kapital = cena - wplata
PV = kapital - wykup / (1+r)^n
rata = PV * r / (1 - (1+r)^(-n))


### APR zalezne od parametrow (5,4% - 7,3%)
Score liczony ze srednich 3 parametrow (2 dla pozyczki - bez wykupu):
- wplata_score = 1 - wplata/45 (max wplata = najkorzystniej)
- okres_score = (okres-24)/48 (krotszy okres = najkorzystniej)
- wykup_score = (wykup - wykupMin) / (wykupMax - wykupMin) (min wykup = najkorzystniej)
- APR = APR_MIN + score * (APR_MAX - APR_MIN)

### Wybor typu finansowania
- VAT-marza: zawsze pozyczka (bez wykupu) - bez wyboru
- VAT-23: przelacznik "Leasing operacyjny" / "Pozyczka" nad kalkulatorem
  - Leasing operacyjny: hasWykup=true, cena liczona od netto (getNettoPrice)
  - Pozyczka: hasWykup=false, cena liczona od brutto
  - Domyslnie: "Leasing operacyjny" zaznaczony

### Limity suwakow
- Wplata: 0-45%, default 20%
- Okres: 24-72 msc (krok 12), default 60
- Wykup: dynamiczny min/max zalezny od okresu:
  - 24 msc: 16-55%
  - 36 msc: 1-45%
  - 48 msc: 1-40%
  - 60 msc: 1-35%
  - 72 msc: 1-30%

### Link "Zapytaj o ten pojazd"
Prowadzi do /kontakt z parametrami w URL: marka, model, slug, typ (leasing/pozyczka), wstepna, msc, wykup, rata

### Rata "od X zl" na kartach ogloszen (ZROBIONE)
Funkcja calculateShowcaseRate() w lib/leasing/calculator.ts, uzywana w app/page.tsx
(ogloszenie tygodnia + najnowsze) i app/ogloszenia/page.tsx (cala lista).
Wariant B (realistyczny): wplata 20%, okres 60 msc, wykup MAX dla okresu.

## Stan prac

### Zrobione
- [x] Konto Supabase + projekt "Fidens", schemat bazy, klucze, klienty, typy TS
- [x] Statyczny katalog marek/modeli, wyszukiwarka autocomplete (desktop + mobile)
- [x] Strona glowna, strona /ogloszenia z filtrami, logo klikalne, responsywnosc
- [x] Strona pojedynczego ogloszenia z pelnymi danymi, karuzela + lightbox
- [x] Cover images (strona glowna + lista), zdjecia w Storage dla 3 testowych ogloszen
- [x] Kalkulator leasingu/pozyczki z wyborem typu finansowania dla VAT-23, cursor pointer
- [x] Formularz kontaktowy /kontakt
- [x] Strony /o-nas, /leasing, /regulamin, /polityka (te dwie ostatnie - szkic, patrz uwagi)
- [x] Panel admina /admin (login, CRUD ogloszen, lista zapytan)
- [x] Import z OtoMoto (dziala niezawodnie - timeout + try/catch + detailsMap zamiast
  tylko cepikWidget - patrz sekcja szczegolowa wyzej)
- [x] Synchronizacja z OtoMoto - Vercel Cron, codziennie o 3:00
- [x] Reorganizacja Navbara: "Ogloszenia" w menu, "Leasing" tylko w stopce (SEO)
- [x] Navbar sticky - przyklejony do gory podczas scrollowania
- [x] Ujednolicone stopki (z pelnym zestawem linkow) na WSZYSTKICH stronach
- [x] Naprawione kodowanie polskich znakow (app/kontakt, LeasingCalculator, app/kontakt/page.tsx)
- [x] Tekst "zloz wniosek" -> "zloz zapytanie" na stronie glownej
- [x] Strona ogloszenia: tytul nad karuzela, "Dane pojazdu" przed "Opisem", ladne okruszki
- [x] Dynamiczna rata "od X zl" na kartach ogloszen
- [x] Formatowanie opisu ogloszen (Markdown: naglowki, pogrubienie, listy, linia pozioma)
  + przyciski Bold/Lista w panelu admina
- [x] Wgrane na Vercel -> fidens.pl

### Do zrobienia (priorytety)

1. **Rozszerzenie kategorii pojazdow** - dodac "dostawcze" i "naczepy" do vehicle_type
   (proste, wspolny model danych z istniejacymi osobowe/ciezarowe/maszyna)

2. **Nowa architektura: kategorie poza pojazdami** (do zaprojektowania w osobnej sesji)
   - "Maszyny przemyslowe" (Gantech), "Pawilony", "Import" - kazda jako osobna
     zakladka w Navbarze, podejscie portfolio (male, elastyczne, nie pelne filtry)
   - Prawdopodobnie nowa tabela other_listings z elastycznymi specs (JSON)
   - Szczegoly ustalen w sekcji "Decyzje produktowe" wyzej

3. **Regulamin i polityka prywatnosci** - uzupelnic dane spolki z o.o. po rejestracji,
   konsultacja prawnicza PRZED publikacja na produkcji (patrz sekcja "Strony statyczne")

4. **SEO i optymalizacja**
   - Przejsc z <img> na <next/image> - next.config.ts z remotePatterns dla Supabase
   - Kalibracja kalkulatora (Opcja C) - tabela marz od klientki
   - Favicon z logo Fidens
   - Meta tagi (Open Graph + description per strona)
   - FAQ / Najczestsze pytania (rozwazane, nie ustalone)
   - Blog/Aktualnosci (rozwazane, nie ustalone)

## Konwencje pracy
- **Pisanie kodu:** komendy w terminalu (PowerShell) z Out-File -Encoding utf8
- **Test:** zawsze npm run dev na localhost:3000 + sprawdzenie mobile (DevTools F12 -> ikona telefonu)
- **Mobile real device:** npx next dev -H 0.0.0.0 -> wpisac IP komputera w przegladarce telefonu
- **Wgranie:** git add . && git commit -m "opis" && git push -> Vercel auto-rebuild
- **Wszystkie zmiany testujemy lokalnie ZANIM git push** (zeby fidens.pl sie nie zepsul)
- **PRZED KAZDYM PUSHEM:** npm run build lokalnie (Vercel wywala deployment na warningach TypeScript/ESLint)
- **PRZED ZALOZENIEM CZEGOS O STANIE PROJEKTU:** sprawdzic w kodzie (Get-ChildItem/Get-Content),
  nie zgadywac na podstawie samej dokumentacji - PROJEKT.md moze byc nieaktualny
- **Podmiana tekstu w duzych/skomplikowanych plikach ($content.Replace) czesto zawodzi**
  przez niewidoczne roznice w bialych znakach/kodowaniu - gdy tak sie stanie, przejsc na
  metode po numerach linii ([System.Collections.Generic.List[string]] + RemoveRange/InsertRange),
  ZAWSZE najpierw wypisac fragment (Get-Content + petla Write-Host) zeby potwierdzic dokladne
  numery linii przed usunieciem/wstawieniem, i ZAWSZE zweryfikowac SZERSZY kontekst po
  edycji (nie tylko zmieniony fragment) - RemoveRange o zlej dlugosci moze po cichu
  skasowac sasiedni naglowek/dodac nadmiarowy zamykajacy tag
- **Server Components (strony pobierajace dane bezposrednio z Supabase, bez "use client")
  NIE MOGA miec event handlerow (onClick, onMouseEnter itp.) w JSX** - blad "Event handlers
  cannot be passed to Client Component props". Hover/interaktywnosc na Server Components
  robic czystym CSS/Tailwind (hover:text-[...], hover:bg-[...]), nie JS
- **position: sticky dziala jako kontekst pozycjonowania** dla potomkow z position:absolute,
  tak samo jak position:relative - bezpiecznie zamienic relative na sticky bez psucia
  wycentrowanych/absolutnie pozycjonowanych elementow w srodku

## Znane problemy/uwagi
- **Hydration warning** od rozszerzenia Bitdefender (atrybuty bis_register, bis_skin_checked).
  To NIE jest blad kodu - tylko deweloperski warning w trybie dev. W produkcji niewidoczny.
- **PowerShell + polskie znaki w komendach:** nie dziala (encoding sie rozjezdza).
  Uzywamy komend BEZ polskich znakow w FLAGACH/parametrach, ale tresc plikow (Out-File
  -Encoding utf8) MOZE miec polskie znaki bezposrednio wpisane w komendzie - to dziala OK.
- **W folderach z nawiasami kwadratowymi ([slug], [id]):** uzywac -LiteralPath zamiast
  -Path/-FilePath we WSZYSTKICH komendach (Get-Content, Select-String, Set-Content).
- **VS Code + literka M na zakladce:** to normalne "modified vs commit", nie "buforowany".
- **Dev serwer nie pokazuje najnowszych zmian -> stare wersje w cache:** ZDARZALO SIE
  WIELOKROTNIE w tej sesji. Procedura: taskkill /IM node.exe /F, potem
  Remove-Item -Recurse -Force .next, potem npm run dev, potem twardy refresh w przegladarce
  (Ctrl+Shift+R). Upewnic sie tez ze test jest na localhost:3000, NIE na fidens.pl (produkcja
  nie ma jeszcze niewypchnietych zmian).
- **Klasy Tailwinda w kwadratowych nawiasach (np. text-[10px]):** czasem sypia sie w Next 16.2.4.
  Uzywac standardowych klas Tailwinda (text-xs, text-sm) gdzie mozna.
- **URL nie moze miec polskich znakow:** przy Ctrl+H uwaga zeby nie zmienic href="/ogloszenia"
  na href="/Ogloszenia" ani "/ogłoszenia". Klikac pojedynczo Replace, nie Replace All.
- **Stopka duplikowana per-strona:** stopka (footer) nie jest osobnym komponentem, jest
  wklejona recznie w kazdym page.tsx (a w przypadku /kontakt - w KontaktForm.tsx, ktory ma
  ja NAWET DWUKROTNIE dla dwoch stanow formularza). Przy zmianie linkow w stopce trzeba
  pamietac o aktualizacji wszedzie. Do rozwazenia w przyszlosci: wydzielenie do wspolnego
  komponentu Footer.tsx.
- **Niektore pliki mialy realnie zepsute kodowanie UTF-8** (nie tylko problem wyswietlania
  w terminalu): stwierdzone w app/kontakt/page.tsx i LeasingCalculator.tsx. Naprawione.
  Jesli pojawi sie podobny problem w innym pliku - nadpisac cala zawartosc pliku na nowo
  z poprawnym -Encoding utf8, nie probowac punktowych podmian (zawodza przy zepsutym
  kodowaniu wejsciowym).
