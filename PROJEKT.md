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
    - Navbar.tsx (nawigacja desktop/mobile + hamburger)
    - SearchAutocomplete.tsx (wyszukiwarka z autocomplete)
    - Carousel.tsx (karuzela zdjec + lightbox z klawiszami i swipe)
    - LeasingCalculator.tsx (kalkulator leasingu/pozyczki z suwakami + wybor typu dla VAT-23)
  - admin/
    - login/ (logowanie admina przez Supabase Auth)
    - ogloszenia/ (lista + CRUD)
      - nowe/ (formularz dodawania)
      - [id]/ (edycja pojedynczego ogloszenia)
    - zapytania/ (lista contact_requests)
  - api/
    - cron/
      - otomoto-sync/route.ts (codzienna synchronizacja o 3:00 - dezaktywuje znikniete ogloszenia)
  - ogloszenia/
    - page.tsx (lista ogloszen z filtrami z URL + cover images)
    - [slug]/
      - page.tsx (strona pojedynczego ogloszenia: tytul -> karuzela -> Dane pojazdu -> Opis -> kalkulator)
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
  - globals.css (m.in. cursor:pointer na suwakach input[type=range] i ich pseudo-elementach thumb)
  - layout.tsx
  - page.tsx (strona glowna z cover images w ogloszeniu tygodnia i najnowszych)
- lib/
  - supabase/
    - client.ts (klient browser)
    - server.ts (klient server, cookies)
    - types.ts (typy TS dla bazy)
  - leasing/
    - calculator.ts (wspolny wzor raty - uzywany przez kalkulator interaktywny i karty ogloszen)
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
  - Dla VAT-marza: zawsze pozyczka leasingowa (bez wykupu) - bez wyboru, tak jak wczesniej
  - Dla VAT-23: KLIENT WYBIERA miedzy "Leasing operacyjny" (z wykupem, cena liczona od netto)
    a "Pozyczka" (bez wykupu, cena liczona od brutto) - przelacznik nad kalkulatorem
  - Wzor: annuita z balonem, APR 5,4% (najkorzystniej) do 7,3% (najmniej korzystnie)
  - Uklad "wariant A": rata jako hero (44px), cena drobno pod ratą
  - Cursor pointer na suwakach (thumb) i przyciskach wyboru typu finansowania
  - PLANOWANE: mini-link "co to znaczy?" przy typie finansowania -> /leasing
- **Wyszukiwarka:** autocomplete typu Google ze statycznej listy (~50 marek + modele).
  Klik w sugestie -> /ogloszenia?marka=X&model=Y. Brak wynikow -> CTA "Zapytaj o ten pojazd" z prefilled marka/modelem.
- **Mobile nawigacja:** logo + lupa + hamburger. Drawer wysuwany z prawej.
- **Logo klikalne** (powrot na strone glowna).
- **Import z OtoMoto:** scraping po URL ogloszenia (brak oficjalnego API).
  Zdjecia uploadowane RECZNIE (osobno od OtoMoto) - inne kadry/jakosc.
  Synchronizacja: jak ogloszenie znika z OtoMoto -> znika z Fidens.
- **Strony statyczne - marka Fidens:** nie ujawniamy rozmiaru zespolu na stronie (marka pisana
  bezosobowo/w trzeciej osobie). Fidens = nowa marka, ale wlasciciel ma wieloletnie (6+ lat)
  doswiadczenie w branzy - komunikujemy to jako "wieloletnie doswiadczenie stojace za marka",
  NIE jako "Fidens dziala od 6 lat" (to bylaby nieprawda). Nie pokazujemy log bankow (kwestia
  prawna - znaki towarowe), tylko nazwy tekstowo. Model biznesowy: Fidens promuje przedmioty
  od zewnetrznych dostawcow (salony/komisy/firmy handlowe) i zarabia na prowizji z finansowania,
  nie na marzy ze sprzedazy pojazdu.
- **Nowe kategorie produktowe (ustalone, do zaprojektowania w osobnej sesji):**
  - **"Inne"** - pawilony, fotowoltaika, pompy ciepla, magazyny energii. Rozne parametry
    techniczne niz pojazdy (bez roku/przebiegu/paliwa) - podejscie portfolio: zdjecia z
    produkcji + opis, bez sztywnych filtrow jak w /ogloszenia. Klient ma dostawcow pawilonow.
  - **Import z zagranicy** (250-300k+ PLN) - podejscie portfolio, NIE rozbudowana strona
    z detalami operacyjnymi (clo/homologacja). Kazdy przypadek indywidualny, omawiany z
    klientem osobno - strona ma tylko pokazac ze usluga istnieje + kilka zdjec.
- **Podmiot prawny:** klient zdecydowal - dokumenty prawne (Regulamin/Polityka) robimy na
  spolke z o.o. (jeszcze niezalozona/w trakcie), nie na obecna JDG.

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
strona nie zachecala do klikniecia jako pozycja menu). Do rozwazenia: mini-link "co to
znaczy?" w kalkulatorze prowadzacy tutaj.

### /regulamin i /polityka
Zrobione (szkic). Tresc oparta na standardowych praktykach dla posrednictwa finansowego,
NIE zweryfikowana prawniczo. Placeholdery danych spolki oznaczone zoltym tlem na stronie
(latwo zauwazalne): [NAZWA SPOLKI], [MIASTO], [ADRES], [NIP], [REGON], [KRS], [DATA].

WAZNE PRZED PUBLIKACJA NA PRODUKCJI:
- Uzupelnic dane spolki z o.o. (klient zdecydowal - robimy na spolke, nie JDG) po jej
  zalozeniu/rejestracji
- Skonsultowac oba dokumenty z prawnikiem/kancelaria - szczegolnie par.5 Odpowiedzialnosc
  (Regulamin) i par.3-4 Cel/odbiorcy danych (Polityka)
- Fidens zbiera WYLACZNIE: imie, nazwisko, NIP, telefon, e-mail (formularz kontaktowy).
  Dane wrazliwe (PESEL, dowod, finanse, wspolmalzonek) zbiera bank/leasingodawca
  bezposrednio, NIE Fidens - Polityka to odzwierciedla
- Sekcja cookies (par.7 Polityki) opisuje stan faktyczny: brak GA/Meta Pixel. Klient chce
  je wdrozyc w przyszlosci - GDY to nastapi, TRZEBA zaktualizowac Polityke + dodac
  banner zgody na cookies PRZED zaladowaniem tych narzedzi (wymog RODO/ePrivacy)

## Navbar - struktura (zaktualizowana)

### Desktop (top menu)
Ogloszenia -> Poznaj Fidens -> Kontakt -> CTA "Zamow bezplatna kalkulacje"

### Mobile (drawer)
Strona glowna -> Ogloszenia -> Poznaj Fidens -> Kontakt -> CTA
(ujednolicone z desktop)

### Stopka (kopiowana per-strona, patrz "Znane problemy")
Poznaj Fidens, Leasing, Kontakt, Regulamin, Polityka prywatnosci
Ujednolicona na WSZYSTKICH stronach: glowna, /ogloszenia, /ogloszenia/[slug], /kontakt,
/o-nas, /leasing, /regulamin, /polityka.

## Strona pojedynczego ogloszenia /ogloszenia/[slug] - uklad
Kolejnosc (zaktualizowana):
1. Okruszki (breadcrumb) - stylizowane: strzalka "rsaquo" zamiast ">", hover pomaranczowy
   (CSS hover:text-[#F0A500], NIE onMouseEnter/onMouseLeave - to Server Component,
   event handlery nie sa dozwolone w propsach)
2. Tytul ogloszenia (h1) + badge ("Nowe"/"Promocja")
3. Karuzela zdjec
4. Dane pojazdu (tabela parametrow)
5. Opis
6. Kalkulator leasingu (w bocznym sidebarze, sticky)

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

### Wybor typu finansowania (NOWE)
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

### Rata "od X zl" na kartach ogloszen (ZROBIONE, potwierdzone w kodzie 28.08)
Funkcja calculateShowcaseRate() w lib/leasing/calculator.ts, uzywana w app/page.tsx
(ogloszenie tygodnia + najnowsze) i app/ogloszenia/page.tsx (cala lista).
Wariant B (realistyczny): wplata 20%, okres 60 msc, wykup MAX dla okresu.

## Stan prac

### Zrobione
- [x] Konto Supabase + projekt "Fidens"
- [x] Schemat bazy (3 tabele + storage bucket + RLS)
- [x] Klucze Supabase w .env.local i na Vercel
- [x] Klienty Supabase (browser + server)
- [x] Typy TypeScript dla bazy
- [x] Statyczny katalog marek/modeli
- [x] Wyszukiwarka autocomplete (desktop + mobile)
- [x] Strona glowna z sekcjami: hero, ogloszenie tygodnia, najnowsze oferty, jak to dziala, opinie, stopka
- [x] Strona /ogloszenia z obsluga query params + komunikat "Brak ofert" + CTA
- [x] Logo (klikalne) w nawigacji i stopce
- [x] Wyszukiwarka wycentrowana na desktop
- [x] Responsywnosc: hamburger menu z drawerem, lupa rozwijajaca pole szukaj, sekcje 1/2/3 kolumny
- [x] Strona pojedynczego ogloszenia /ogloszenia/[slug] z pelnymi danymi pojazdu
- [x] Karuzela zdjec + lightbox (strzalki, klawisze, swipe na mobile, klik zamyka poza zdjeciem)
- [x] Cover images na stronie glownej (ogloszenie tygodnia + 3 najnowsze) i liscie /ogloszenia
- [x] Zdjecia w Storage dla 3 testowych ogloszen (BMW, Mercedes, Caterpillar)
- [x] Kalkulator leasingu/pozyczki z wyborem typu finansowania dla VAT-23
  - Rata jako hero (44px), cena drobno pod ratą
  - Suwaki z dynamicznymi limitami wykupu, cursor pointer
  - Przelacznik "Leasing operacyjny" / "Pozyczka" (tylko VAT-23)
  - Link do /kontakt z parametrami w URL
- [x] Formularz kontaktowy /kontakt (Supabase + rozpoczete DNS pod Resend)
- [x] Strona /o-nas ("Dlaczego Fidens?")
- [x] Strona /leasing ("Leasing dla firm")
- [x] Strony /regulamin i /polityka (szkic z placeholderami - patrz sekcja wyzej)
- [x] Panel admina /admin (login, CRUD ogloszen w /admin/ogloszenia + /nowe + /[id],
  lista zapytan w /admin/zapytania)
- [x] Import z OtoMoto (mechanizm istnieje, powiazany z otomoto_url/otomoto_id w bazie)
- [x] Synchronizacja z OtoMoto - Vercel Cron (app/api/cron/otomoto-sync/route.ts),
  harmonogram w vercel.json: codziennie o 3:00
- [x] Reorganizacja Navbara: dodano "Ogloszenia", usunieto "Leasing" z gownego menu
  (zostaje w stopce - cel SEO), ujednolicono desktop/mobile
- [x] Ujednolicone stopki (z pelnym zestawem linkow) na WSZYSTKICH stronach
- [x] Naprawione kodowanie polskich znakow w app/kontakt/page.tsx i LeasingCalculator.tsx
- [x] Tekst "zloz wniosek" -> "zloz zapytanie" na stronie glownej
- [x] Strona ogloszenia: tytul przeniesiony nad karuzele, "Dane pojazdu" przed "Opisem"
- [x] Ladniejsze okruszki (breadcrumb) na stronie ogloszenia
- [x] Dynamiczna rata "od X zl" na kartach ogloszen (calculateShowcaseRate, wariant B)
- [x] Wgrane na Vercel -> fidens.pl

### Do zrobienia (priorytety)

1. **Mini-link "co to znaczy?" w kalkulatorze** (jedyna pozostala "drobna poprawka")
   - W LeasingCalculator.tsx przy etykiecie typu finansowania (VAT-23) - maly, dyskretny
     link tekstowy prowadzacy do /leasing, NIE osobny przycisk CTA (kalkulator ma zostac prosty)

2. **Nowa kategoria "Inne"** (pawilony, fotowoltaika, pompy ciepla, magazyny energii)
   - Podejscie portfolio (zdjecia z produkcji + opis), nie pelna struktura /ogloszenia
     z filtrami - te produkty nie maja roku/przebiegu/paliwa
   - Do zaprojektowania: struktura danych (elastyczne pola zamiast sztywnych kolumn),
     wyglad karty, gdzie w Navbarze/menu

3. **Import z zagranicy - strona portfolio** (250-300k+ PLN)
   - Podejscie portfolio: zdjecia + krotki opis "zajmujemy sie tym od A do Z",
     bez szczegolow operacyjnych (clo/homologacja) - kazdy przypadek indywidualny
   - Prostsze niz pierwotnie zakladano - NIE wymaga sesji planistycznej o formalnosciach

4. **SEO i optymalizacja**
   - Przejsc z <img> na <next/image> (karuzela, karta ogloszen, cover images) - wymaga next.config.ts z remotePatterns dla Supabase
   - Kalibracja kalkulatora (Opcja C) - tabela marz od klientki, wtedy odchylenia od prawdziwego systemu banku znikna
   - Favicon z logo Fidens (favicon.io/favicon-converter)
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
  numery linii przed usunieciem/wstawieniem - liczenie "na oko" latwo pomylic o 1 linie
  i zepsuc skladnie/tresc. PO KAZDEJ takiej edycji zweryfikowac cala okolice zmiany
  (nie tylko sama zmieniona fraze), bo RemoveRange o niewlasciwej dlugosci moze po cichu
  skasowac sasiedni naglowek/sekcje (patrz: incydent 28.08 - zniknal caly punkt "SEO i
  optymalizacja" oraz naglowek "Konwencje pracy" przy okazji drobnej zmiany numeracji)
- **Server Components (strony pobierajace dane bezposrednio z Supabase, bez "use client")
  NIE MOGA miec event handlerow (onClick, onMouseEnter itp.) w JSX** - blad "Event handlers
  cannot be passed to Client Component props". Hover/interaktywnosc na Server Components
  robic czystym CSS/Tailwind (hover:text-[...], hover:bg-[...]), nie JS

## Znane problemy/uwagi
- **Hydration warning** od rozszerzenia Bitdefender (atrybuty bis_register, bis_skin_checked).
  To NIE jest blad kodu - tylko deweloperski warning w trybie dev. W produkcji niewidoczny.
- **PowerShell + polskie znaki w komendach:** nie dziala (encoding sie rozjezdza).
  Uzywamy komend BEZ polskich znakow (np. "Wplata wstepna"), potem w VS Code przez Ctrl+H
  przywracamy ogonki. Zawartosc plikow z -Encoding utf8 dziala OK.
- **W folderach z nawiasami kwadratowymi ([slug]):** uzywac -LiteralPath zamiast -Path/-FilePath
  we WSZYSTKICH komendach (Get-Content, Select-String, Set-Content), nie tylko Out-File.
- **VS Code + literka M na zakladce:** to normalne "modified vs commit", nie "buforowany".
  Widok Git Local Changes (Working Tree) pokazuje dokladnie roznice.
- **Dev serwer nie chodzi po push -> stare wersje w cache:** ubijac procesy przez taskkill /IM node.exe /F
  i czyscic .next przez Remove-Item -Recurse -Force .next
- **Klasy Tailwinda w kwadratowych nawiasach (np. text-[10px]):** czasem sypia sie w Next 16.2.4.
  Uzywac standardowych klas Tailwinda (text-xs, text-sm) gdzie mozna.
- **URL nie moze miec polskich znakow:** przy Ctrl+H uwaga zeby nie zmienic href="/ogloszenia"
  na href="/Ogloszenia" ani "/ogłoszenia". Klikac pojedynczo Replace, nie Replace All.
  Widok Git Local Changes (Working Tree) w VS Code = szybki sprawdzian co poszlo nie tak.
- **Stopka duplikowana per-strona:** stopka (footer) nie jest osobnym komponentem, jest
  wklejona recznie w kazdym page.tsx (a w przypadku /kontakt - w KontaktForm.tsx, ktory ma
  ja NAWET DWUKROTNIE dla dwoch stanow formularza). Przy zmianie linkow w stopce trzeba
  pamietac o aktualizacji wszedzie. Do rozwazenia w przyszlosci: wydzielenie do wspolnego
  komponentu Footer.tsx - oszczedzi to duzo czasu przy przyszlych zmianach.
- **Niektore pliki maja realnie zepsute kodowanie UTF-8 (nie tylko problem wyswietlania
  w terminalu):** stwierdzone w app/kontakt/page.tsx i LeasingCalculator.tsx (objawy: znaki
  typu "â€”", "Ĺadowanie", "poĹĽyczki" zamiast prawidlowych polskich liter). Naprawione
  27-28.08. Jesli pojawi sie podobny problem w innym pliku - nadpisac cala zawartosc pliku
  na nowo z poprawnym -Encoding utf8, nie probowac punktowych podmian (zawodza przy
  zepsutym kodowaniu wejsciowym).
