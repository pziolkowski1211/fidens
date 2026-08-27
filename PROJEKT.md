# Fidens.pl - Projekt strony

## Cel projektu
Strona dla brokera/dealera leasingowego (auta osobowe, ciezarowe, maszyny budowlane).
Klienci wchodza glownie z social mediow -> mobile pierwszy priorytet.

## Stack techniczny
- **Next.js 16** (App Router, Turbopack) + TypeScript + Tailwind v4
- **Supabase** - baza danych (Postgres), Auth (panel admina), Storage (zdjecia)
- **Vercel** - hosting -> fidens.pl
- **Resend** - wysylka maili z formularzy (3000/msc free), domena fidens.pl zweryfikowana
- **sharp** - przetwarzanie zdjec (przycinanie watermarku OtoMoto przy imporcie)

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

## Poczta / domena
- Domena fidens.pl kupiona u Hostido, ale BEZ pakietu hostingowego (brak poczty).
- Admin loguje sie na razie zwyklym istniejacym mailem (nie @fidens.pl).
- W przyszlosci: dokupic hosting/Zoho Mail/Google Workspace dla ...@fidens.pl,
  wtedy podmienic email admina w Supabase Auth (Authentication -> Users).

## Identyfikacja wizualna
- **Granat (primary):** #1B2A4A
- **Pomaranczowy (accent):** #F0A500
- **Tlo jasne:** #f8f9fb
- **Bordery:** #e8eaed
- **Logo jasne (na ciemne tlo):** public/jasne.png (1536x1024 px, transparent)
- **Logo ciemne (na jasne tlo):** public/ciemne.png (1536x1024 px, transparent)
- **Favicon/app icon:** app/favicon.ico, app/icon.png, app/apple-icon.png - motyw
  litera "F" + zawijas drogi (wygenerowany graficznie, nie wycinek z jasne.png/ciemne.png)
- **Obrazek Open Graph:** public/og-image.png (1200x630) - logo na granatowym tle +
  haslo "Finansowanie dla firm: pojazdy, maszyny i sprzęt" (celowo pozycjonowane pod
  klientele B2B, zeby odsiac zapytania od osob prywatnych)

## Struktura folderow

fidens/
- app/
  - components/
    - Navbar.tsx (nawigacja desktop/mobile + hamburger)
    - SearchAutocomplete.tsx (wyszukiwarka z autocomplete)
    - Carousel.tsx (karuzela zdjec + lightbox, next/image dla glownego zdjecia i miniatur,
      zwykly <img> tylko w lightboxie - zdjecie bez ustalonych wymiarow, ladowane on-demand)
    - LeasingCalculator.tsx (kalkulator leasingu/pozyczki z suwakami)
    - ImageUploader.tsx (upload+kompresja zdjec, okladka, kolejnosc, usuwanie, next/image
      do wyswietlania miniatur - uzywany w adminie)
    - ConfirmDialog.tsx (wlasny modal potwierdzenia - uzywany przy usuwaniu ogloszenia)
  - admin/
    - layout.tsx (gorny pasek nawigacji: Ogloszenia / Zapytania / Wyloguj, ukryty na /admin/login)
    - login/
      - page.tsx (logowanie Supabase Auth email+haslo)
    - ogloszenia/
      - page.tsx (lista ogloszen w tabeli, link Edytuj, przycisk Dodaj nowe)
      - nowe/
        - page.tsx (formularz dodawania ogloszenia)
      - [id]/
        - page.tsx (formularz edycji + ImageUploader + usuwanie ogloszenia z ConfirmDialog)
      - otomoto-actions.ts (importOtomotoListing - dane; importOtomotoPhotos - zdjecia,
        z automatycznym przycinaniem watermarku przez sharp)
    - zapytania/
      - page.tsx (lista contact_requests, oznaczanie przeczytane, notatki z potwierdzeniem zapisu)
  - ogloszenia/
    - page.tsx (lista ogloszen z filtrami z URL + cover images przez next/image + generateMetadata
      z dynamicznym tytulem/opisem zaleznym od filtrow marka/model/q)
    - [slug]/
      - page.tsx (strona pojedynczego ogloszenia + karuzela + kalkulator + generateMetadata
        z tytulem/opisem/obrazkiem OG konkretnego ogloszenia, dane pobierane przez cache()
        zeby nie odpytywac bazy dwa razy dla meta tagow i dla strony)
  - kontakt/
    - page.tsx (Suspense wrapper + export const metadata statyczny)
    - KontaktForm.tsx ("use client" - formularz kontaktowy)
    - actions.ts (submitContactForm - insert do bazy + wysylka maila przez Resend)
  - favicon.ico, icon.png, apple-icon.png (favicon/app icon, patrz Identyfikacja wizualna)
  - globals.css
  - layout.tsx (metadata: title/description/keywords/openGraph/twitter dla calej strony)
  - page.tsx (strona glowna z cover images przez next/image w ogloszeniu tygodnia i najnowszych)
- lib/
  - supabase/
    - client.ts (klient browser)
    - server.ts (klient server, cookies, async createClient)
    - service.ts (klient service-role, pomija RLS - uzywany w cron jobie synchronizacji)
    - types.ts (typy TS dla bazy)
  - vehicles/
    - catalog.ts (statyczna lista marek/modeli)
  - leasing/
    - calculator.ts (calculateRata, getWykupLimits, getNettoPrice, calculateShowcaseRate)
  - otomoto/
    - scraper.ts (fetchOtomotoListing, extractOtomotoImageUrls)
- public/
  - jasne.png (logo na ciemne tlo)
  - ciemne.png (logo na jasne tlo)
  - og-image.png (obrazek Open Graph, patrz Identyfikacja wizualna)
- next.config.ts (images.remotePatterns dla Supabase Storage - wymagane dla next/image)
- proxy.ts (dawniej middleware.ts - patrz Konwencje pracy; chroni /admin/*, redirect do /admin/login)
- .env.local (klucze, poza git)
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
- description, location_city (NIEUZYWANE w formularzach admina - zawsze wysylane jako null)
- vat_type ('marza' lub 'vat23' - UWAGA: nie '23', tylko 'vat23'! decyduje typ kalkulatora)
- search_vector (TSVECTOR + GIN index dla pelnotekstowego wyszukiwania)

### listing_images (galeria zdjec)
- id, listing_id (FK), storage_path, url, position, is_cover
- Partial unique index: max 1 cover per listing (WHERE is_cover=true)

### contact_requests (zapytania z formularza)
- id, listing_id (FK, nullable), name, phone, email, nip, message
- leasing_initial_pct, leasing_months, leasing_residual_pct
- is_read, notes (admin)
- UWAGA: typ TS ContactRequestUpdate (Partial<ContactRequestInsert>) NIE zawiera
  is_read ani notes bo ContactRequestInsert je pomija. Update tych 2 pol wymaga
  rzutowania "as never" w .update(). Nie jest to blad kodu, tylko ograniczenie typow.

### Storage bucket
- listing-images - publiczny odczyt, upload tylko zalogowany admin
- Folder per ogloszenie (nazwa = slug), np. bmw-5-series-530d-xdrive-2022/bmw-1.jpg

### RLS policies
- Public: SELECT na active listings + ich images, INSERT na contact_requests
- Authenticated (admin): pelny dostep do wszystkich tabel

## Panel admina /admin (ZROBIONE - sesja z 26.08.2026)
- **Auth:** proxy.ts (Next.js 16 - middleware.ts jest deprecated, patrz Konwencje pracy)
  sprawdza sesje Supabase przy kazdym /admin/*, redirect do /admin/login jesli brak sesji,
  redirect do /admin/ogloszenia jesli zalogowany wejdzie na /admin/login.
- **Logowanie:** /admin/login - email+haslo, Supabase Auth signInWithPassword.
  Admin zalozony recznie w Supabase Dashboard (Authentication -> Users -> Add user,
  Auto Confirm User). Na razie zwykly istniejacy mail, nie @fidens.pl (patrz sekcja Poczta).
- **Layout:** gorny pasek (nie sidebar - lepszy na mobile), granatowy, linki
  Ogloszenia/Zapytania podswietlane pomaranczowo gdy aktywne, przycisk Wyloguj.
- **Lista ogloszen** /admin/ogloszenia: tabela tytul/marka-model/cena/status (kolorowe
  badge: aktywne=zielony/nieaktywne=szary/sprzedane=czerwony), link Edytuj, przycisk Dodaj nowe.
- **Dodawanie** /admin/ogloszenia/nowe: formularz z sekcjami (Podstawowe, Techniczne,
  Cena i leasing, Dodatkowe). Auto-slug z tytulu (edytowalny recznie). Po zapisie redirect
  do /admin/ogloszenia/[id] (tam dopiero mozna dodac zdjecia, bo trzeba miec listing_id).
- **Edycja** /admin/ogloszenia/[id]: ten sam uklad co "nowe", wczytuje dane z bazy,
  zawiera sekcje Zdjecia (ImageUploader) i przycisk Usun ogloszenie (z ConfirmDialog -
  wlasny modal potwierdzenia, nie natywny confirm()).
- **Upload zdjec** (ImageUploader.tsx, komponent uzywany w [id]/page.tsx):
  - drag&drop + zwykly input file, multi-file
  - kompresja w przegladarce (browser-image-compression: maxWidthOrHeight 1600, maxSizeMB 0.4)
  - upload do Storage bucket listing-images pod folder=slug
  - zapis rekordu do listing_images, pierwsze wgrane zdjecie automatycznie = okladka
  - miniatury wyswietlane przez next/image
  - przyciski: strzalki kolejnosci (ikony SVG w kwadratowych przyciskach), przycisk
    tekstowy "Okladka" (pomaranczowy, nieaktywny gdy zdjecie juz jest okladka),
    Usun (bez potwierdzenia - swiadoma decyzja, usuwanie zdjecia jest odwracalne
    przez ponowny upload, w przeciwienstwie do usuwania calego ogloszenia)
- **Zapytania** /admin/zapytania: lista contact_requests (najnowsze first), pomaranczowa
  ramka gdy nieprzeczytane, przycisk toggle Przeczytane/Nieprzeczytane, pole notatek
  z przyciskiem Zapisz + potwierdzenie "Zapisano" (znika po 2s), przycisk Usun.

## Decyzje produktowe (zatwierdzone z klientem)
- **Galeria zdjec:** karuzela z lightbox (kliknij zdjecie zeby powiekszyc)
- **Kalkulator leasingu:** frontend only, parametry wysylane w URL do /kontakt
  - Automatycznie wybiera typ na podstawie vat_type: 'marza' = pozyczka leasingowa (bez wykupu), inaczej = leasing (z wykupem)
  - Wzor: annuita z balonem, APR 5,4% (najkorzystniej) do 7,3% (najmniej korzystnie)
  - Uklad "wariant A": rata jako hero (44px), cena brutto/netto drobno pod rata
  - Kalibracja zaakceptowana przez klienta jako finalna (prosty model zalezny od parametrow,
    Opcja C - tabela marz z realnego banku - NIE jest potrzebna)
- **Wyszukiwarka:** autocomplete typu Google ze statycznej listy (~50 marek + modele).
  Klik w sugestie -> /ogloszenia?marka=X&model=Y. Brak wynikow -> CTA "Zapytaj o ten pojazd" z prefilled marka/modelem.
- **Mobile nawigacja:** logo + lupa + hamburger. Drawer wysuwany z prawej.
- **Logo klikalne** (powrot na strone glowna).
- **Panel admina:** gorny pasek nawigacji (nie sidebar) - decyzja pod kontem uzytkowania z telefonu.
- **Import z OtoMoto:** scraping po URL ogloszenia (brak oficjalnego API).
  Zdjecia uploadowane RECZNIE (osobno od OtoMoto) - inne kadry/jakosc. Zdjecia sa
  automatycznie przycinane o 6% wysokosci od dolu przy imporcie (usuwa watermark "otomoto"
  wypalony w pliku, patrz OTOMOTO_WATERMARK_CROP_RATIO w otomoto-actions.ts).
  Synchronizacja: jak ogloszenie znika z OtoMoto -> znika z Fidens.
- **Pozycjonowanie marki:** komunikacja (haslo strony, obrazek OG) celowo kierowana
  do firm/przedsiebiorcow, nie klientow indywidualnych - odsiewa niechciane zapytania
  juz na etapie podgladu linku w social mediach.

## Kalkulator leasingu - szczegoly

### Wzor (LeasingCalculator.tsx)
Klasyczna annuita z balonem:
kapital = cena - wplata
PV = kapital - wykup / (1+r)^n
rata = PV * r / (1 - (1+r)^(-n))

### Netto vs brutto (WAZNE)
- price_pln w bazie to zawsze cena BRUTTO (tak jak importowana z OtoMoto - bez zadnej konwersji).
- Dla VAT-23 (leasing, hasWykup=true): rata liczona jest od ceny NETTO (getNettoPrice() w calculator.ts,
  dzieli przez 1.23). W kalkulatorze (LeasingCalculator.tsx) wyswietlane sa OBiE raty (netto - glowna,
  duza liczba + netto obok; brutto - mala linijka pod spodem) oraz obie ceny (Cena brutto: X zl.
  Cena netto: Y zl). Kwoty przy suwakach Wplata/Wykup licza sie od ceny BRUTTO (realne pieniadze ktore
  klient wplaca), mimo ze sama rata liczona jest od netto - to swiadoma decyzja produktowa (klient mysli
  w realnych zlotowkach, nie w abstrakcyjnym procencie netto).
- Dla VAT marza (pozyczka, hasWykup=false): brak podzialu netto/brutto - liczymy zawsze od pelnej ceny,
  etykieta to po prostu Cena brutto: X zl. VAT marza.
- Na kartach ogloszen (strona glowna + /ogloszenia): calculateShowcaseRate() tez liczy od netto dla
  VAT-23, i przy racie dopisywane jest slowo netto (warunek: !is_marza).

### APR zalezne od parametrow (5,4% - 7,3%)
Score liczony ze srednich 3 parametrow (2 dla pozyczki - bez wykupu):
- wplata_score = 1 - wplata/45 (max wplata = najkorzystniej)
- okres_score = (okres-24)/48 (krotszy okres = najkorzystniej)
- wykup_score = (wykup - wykupMin) / (wykupMax - wykupMin) (min wykup = najkorzystniej)
- APR = 5,4 + score * 1,9

### Limity suwakow
- Wplata: 0-45%, default 20%
- Okres: 24-72 msc (krok 12), default 48
- Wykup: dynamiczny min/max zalezny od okresu:
  - 24 msc: 16-55%
  - 36 msc: 1-45%
  - 48 msc: 1-40%
  - 60 msc: 1-35%
  - 72 msc: 1-30%
- Default wykupu: 10% (auto-podnoszony jesli minimum wyzsze)

### Link "Zapytaj o ten pojazd"
Prowadzi do /kontakt z parametrami w URL: marka, model, slug, typ (leasing/pozyczka), wstepna, msc, wykup, rata

## SEO i meta tagi (ZROBIONE - sesja z 27.08.2026)
- **app/layout.tsx:** title, description, keywords, openGraph (z obrazkiem 1200x630),
  twitter card (summary_large_image) - dane globalne dla calej strony, tekst pozycjonowany
  pod klientele B2B ("Finansowanie dla firm: pojazdy, maszyny i sprzęt")
- **app/ogloszenia/[slug]/page.tsx:** generateMetadata dynamiczny per ogloszenie - tytul
  z nazwa pojazdu, opis z description ogloszenia (albo wygenerowany z marki/modelu/roku/ceny
  jesli description puste), obrazek OG = zdjecie okladkowe tego ogloszenia. Dane pobierane
  raz przez funkcje owinieta w cache() z React, wspoldzielone miedzy generateMetadata
  a samym komponentem strony (bez podwojnego zapytania do bazy).
- **app/ogloszenia/page.tsx:** generateMetadata reagujacy na filtry z URL (marka/model/q) -
  np. "Oferty: BMW — Fidens" zamiast ogolnego tytulu.
- **app/kontakt/page.tsx:** statyczny export const metadata (KontaktForm.tsx jest "use client"
  wiec metadata musi byc w tym wrapperze, nie w komponencie klienckim).
- **Favicon/app icon:** wygenerowany graficznie (litera F + zawijas drogi), pliki
  app/favicon.ico, app/icon.png (512x512), app/apple-icon.png (180x180, biale tlo bo
  Apple wymaga opaque). Zrodlowy plik PNG (logo_biale.png) NIE jest w repo - zapisany
  lokalnie u Piotra poza projektem, do ew. przyszlych zmian faviconu.
- **Obrazek Open Graph:** public/og-image.png (1200x630), logo na granatowym tle + haslo.

## next/image (ZROBIONE - sesja z 27.08.2026)
Wszystkie kluczowe miejsca przeszly z <img> na next/image (wymaga next.config.ts
z images.remotePatterns dla domeny Supabase Storage):
- Carousel.tsx - glowne zdjecie i miniatury (fill + sizes). WYJATEK: zdjecie w lightboxie
  zostalo jako zwykly <img> (celowo) - ladowane on-demand dopiero po kliknieciu, kontener
  bez ustalonych wymiarow (dopasowuje sie do proporcji kazdego zdjecia), next/image
  wymagalby fill+rodzic o stalym rozmiarze co niepotrzebnie skomplikowaloby kod.
- app/ogloszenia/page.tsx - karty ogloszen na liscie (fill + sizes responsywne)
- app/page.tsx - ogloszenie tygodnia (fill + priority, laduje sie pierwsze) i najnowsze
  oferty (fill + sizes)
- ImageUploader.tsx - miniatury wgranych zdjec w panelu admina (fill + sizes)

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
- [x] Kalkulator leasingu/pozyczki (Opcja A - zalezne APR 5,4-7,3%, podzial netto/brutto).
      Zaakceptowane przez klienta jako finalne rozwiazanie - Opcja C (tabela marz z banku)
      nie jest potrzebna.
- [x] Formularz kontaktowy /kontakt (Supabase insert do contact_requests). Redesign:
      Navbar + stopka + biala karta na jasnym tle (spojnie z reszta strony), wszystkie
      etykiety/inputy z jawnym kolorem tekstu (text-gray-900), ekran "Dziekujemy" z
      zielonym kolkiem + bialy haczyk (SVG, nie emoji) zamiast surowego domyslnego stylu.
- [x] Wgrane na Vercel -> fidens.pl
- [x] **Synchronizacja z OtoMoto** - Vercel Cron Job (/api/cron/otomoto-sync),
      raz dziennie o 3:00 UTC (godzinne okno na planie Hobby). Sprawdza wszystkie
      ogloszenia ze statusem active/inactive (pomija sold) ktore maja otomoto_url.
      Jesli zniknelo z OtoMoto (HTTP 404/410 lub tekst o wygasnieciu) -> status=inactive
      (RLS automatycznie chowa je ze strony). Jesli wrocilo -> status=active z powrotem.
      Klient service-role (lib/supabase/service.ts, pomija RLS) + sekret CRON_SECRET
      (Vercel dodaje naglowek Authorization automatycznie). Nowe zmienne srodowiskowe:
      SUPABASE_SERVICE_ROLE_KEY, CRON_SECRET (dodane w .env.local i na Vercelu).
- [x] **Panel admina /admin - KOMPLETNY** (auth, logowanie, layout, CRUD ogloszen,
      upload zdjec z kompresja/okladka/kolejnoscia, usuwanie, lista zapytan z notatkami)
- [x] **Resend - wysylka maili z /kontakt** - nadawca zmieniony z sandboxowego
      onboarding@resend.dev na kontakt@fidens.pl (domena zweryfikowana w Resend).
      Odbiorca powiadomien na razie prywatny mail wlasciciela (patrz sekcja Poczta).
- [x] Wskazowka w formularzu "nowe ogloszenie" ze zdjecia dodaje sie dopiero po zapisaniu
- [x] **"Od X zl" na kartach ogloszen** - dynamiczne liczenie (lib/leasing/calculator.ts,
      calculateShowcaseRate) wariantem B (wplata 20%, okres 60 msc, wykup max dla okresu),
      podpiete na stronie glownej i liscie /ogloszenia. Zatwierdzone z klientem.
- [x] **Import z OtoMoto** (lib/otomoto/scraper.ts + app/admin/ogloszenia/otomoto-actions.ts):
  - Pole "Link OtoMoto" + przycisk "Importuj dane" w formularzu nowego ogloszenia
  - Parsuje __NEXT_DATA__ ze strony OtoMoto (marker "financingAdCarDetailsWidget", fallback
    "financingSimulatorWidget") -> tytul, cena, marka, model, rok, przebieg, paliwo
  - Dodatkowo z "cepikWidget" (gdy ogloszenie ma zweryfikowane dane CEPIK): kolor, skrzynia
    biegow, moc (KM), pojemnosc silnika (cm3), kraj pochodzenia
  - Wariant (wersja wyposazenia) NIE jest wyciagany - uzupelnia sie recznie
  - Import zdjec: osobny przycisk "Importuj zdjecia z OtoMoto" w ImageUploader.tsx (widoczny
    tylko gdy ogloszenie ma link OtoMoto) - wyciaga adresy zdjec z CDN OtoMoto
    (ireland.apollo.olxcdn.com), pobiera w rozmiarze 1600px, PRZYCINA 6% wysokosci od dolu
    (usuwa watermark "otomoto" wypalony w pliku, sharp), wgrywa do Supabase Storage
  - Parser jest best-effort: jesli OtoMoto zmieni strukture strony, zwraca puste pola +
    warnings zamiast bledu - trzeba wtedy uzupelnic dane recznie
  - Uwaga: pole otomoto_id NIE jest jeszcze automatycznie ustawiane przy imporcie (zawsze null)
- [x] **Naprawa polskich znakow (ogonkow)** w panelu admina (wszystkie strony), formularzu
      kontaktowym, kalkulatorze leasingu i Carousel.tsx - brakowalo ich w wielu miejscach
      (efekt pisania komend PowerShell bez polskich znakow bez pozniejszego przywrocenia,
      patrz Konwencje pracy). Poprawiono tez literowke "zl" -> "zł" (kilka wystapien:
      LeasingCalculator, karty ogloszen na /ogloszenia i stronie glownej) oraz zdublowany
      link w komponencie BrakOfert (app/ogloszenia/page.tsx).
- [x] **UI usuwania zdjec i ogloszen w panelu admina**:
  - ConfirmDialog.tsx - wlasny modal potwierdzenia (zamiast natywnego confirm()), uzywany
    tylko przy usuwaniu calego ogloszenia (nieodwracalne)
  - Usuwanie zdjecia w ImageUploader - bez potwierdzenia (swiadoma decyzja, szybkie
    i odwracalne przez ponowny upload)
  - Przyciski kolejnosci/okladki/usuwania zdjecia - spojny, ladniejszy wyglad (ikony SVG
    dla strzalek, tekstowy przycisk "Okladka" w kolorze marki)
- [x] **Favicon i app icon** - wygenerowany graficznie (litera F + zawijas drogi na bialym
      tle), pliki app/favicon.ico, app/icon.png, app/apple-icon.png
- [x] **Meta tagi + Open Graph + Twitter Card** - patrz sekcja "SEO i meta tagi" wyzej.
      Przetestowane w Facebook Sharing Debugger - dziala poprawnie (ostrzezenie o
      brakujacym fb:app_id jest nieistotne, nie wplywa na wyglad podgladu linku).
- [x] **next/image wdrozony wszedzie** - patrz sekcja "next/image" wyzej.

### Do zrobienia (priorytety)

1. **Strony statyczne** <-- NASTEPNY KROK
   - /o-nas, /leasing, /regulamin, /polityka
   - Tresc do ustalenia z Piotrem (co dokladnie ma sie znalezc na kazdej)

2. **Drobna poprawka do zrobienia przy okazji**
   - Stopka na stronie glownej: link "O mnie" prowadzi do /o-nas, ale to strona firmowa
     (nie osobista) - prawdopodobnie powinno byc "O nas". Nie zmienione, czeka na decyzje.

3. **Drobne dopiecia panelu admina**
   - Rozwazyc email admina docelowo na ...@fidens.pl (patrz sekcja Poczta)

4. **Import z OtoMoto - do rozbudowy**
   - Sprawdzic dlaczego niektore pola (skrzynia, moc, pojemnosc, kolor, kraj pochodzenia)
     czasem nie importuja sie mimo dostepnych danych na OtoMoto - do zbadania z realnymi
     przykladami (zglaszane przez Piotra przy okazji dodawania Mercedes-Benz Klasa B)

## Konwencje pracy
- **Pisanie kodu:** komendy w terminalu (PowerShell) z Out-File -Encoding utf8
- **Test:** zawsze npm run dev na localhost:3000 + sprawdzenie mobile (DevTools F12 -> ikona telefonu)
- **Mobile real device:** npx next dev -H 0.0.0.0 -> wpisac IP komputera w przegladarce telefonu
- **Wgranie:** git add . && git commit -m "opis" && git push -> Vercel auto-rebuild
- **Wszystkie zmiany testujemy lokalnie ZANIM git push** (zeby fidens.pl sie nie zepsul)
- **PRZED KAZDYM PUSHEM:** npm run build lokalnie (Vercel wywala deployment na warningach TypeScript/ESLint)
- **Next.js 16: middleware.ts jest DEPRECATED, uzywamy proxy.ts** (funkcja musi nazywac sie
  "proxy" nie "middleware"). Plik w repo to juz proxy.ts, nie tworzyc ponownie middleware.ts.
- **Male, punktowe poprawki (1-2 miejsca w pliku):** uzywac find-replace zamiast nadpisywania
  calego pliku - szybsze, mniej do wklejania, mniejsze ryzyko literowki:
  $content = Get-Content -Raw -Encoding UTF8 "sciezka\do\pliku"
  $content = $content -replace [regex]::Escape("STARY TEKST"), "NOWY TEKST"
  [System.IO.File]::WriteAllText("$PWD\sciezka\do\pliku", $content, (New-Object System.Text.UTF8Encoding $false))
  Po wykonaniu ZAWSZE sprawdzic czy zamiana faktycznie zaszla (np. Select-String -Path ... -Pattern ...) -
  build moze przejsc czysto nawet jesli -replace nic nie znalazl i plik zostal bez zmian.
- **Duze zmiany (wiele miejsc w pliku, nowy plik, przebudowa struktury):** nadpisywanie
  calego pliku przez heredoc @'...'@ + WriteAllText nadal ma sens - szybsze niz wiele
  osobnych find-replace.
- **Zapis plikow z polskimi znakami przez PowerShell:** heredoc @'...'@ w terminalu VS Code
  potrafi sie urwac przy wklejaniu (PowerShell interpretuje poczatek nastepnej komendy jako
  czesc stringa) - jesli build rzuci blad parsowania w miejscu, gdzie nie bylo edycji, to
  najpewniej to. Naprawa: git checkout -- "sciezka/pliku" i wkleic komende ponownie, jednym
  ruchem (zaznacz caly blok az do konca WriteAllText, wklej, jeden Enter, nie klikac w srodku).
- **UWAGA - wypadek z 27.08.2026:** PROJEKT.md i AGENTS.md zostaly przypadkowo nadpisane/
  zmieszane (prawdopodobnie przez pomylke przy kopiowaniu tresci miedzy plikami lokalnie,
  potem zapushowane do gita). Odzyskane i zaktualizowane recznie tego samego dnia. Wniosek:
  po kazdej zmianie w PROJEKT.md/AGENTS.md warto zrobic szybkie Get-Content i sprawdzic czy
  tresc sie zgadza, ZANIM sie zrobi commit + push.

## Znane problemy/uwagi
- **Hydration warning** od rozszerzenia Bitdefender (atrybuty bis_register, bis_skin_checked).
  To NIE jest blad kodu - tylko deweloperski warning w trybie dev (widoczny tez jako
  czerwony badge "1 Issue" w rogu ekranu w dev mode). W produkcji niewidoczny. Ignorowac.
- **PowerShell + polskie znaki w komendach:** nie dziala (encoding sie rozjezdza).
  Uzywamy komend BEZ polskich znakow (np. "Wplata wstepna"), potem w VS Code przez Ctrl+H
  przywracamy ogonki. Zawartosc plikow z -Encoding utf8 dziala OK.
- **W folderach z nawiasami kwadratowymi ([slug], [id]):** uzywac Set-Content -LiteralPath
  (nie Out-File -FilePath, bo interpretuje nawiasy jako wildcard i wywala blad
  "did not resolve to a file"). Metoda [System.IO.File]::WriteAllText nie ma tego problemu
  (nie jest cmdletem PowerShell, nawiasy w sciezce nie sa interpretowane jako wildcard).
- **Znaki specjalne (strzalki Unicode itp.) w duzych blokach @'...'@ w PowerShell:**
  potrafia namieszac przy wklejaniu i urwac string. Bezpieczniej uzywac zwyklych
  slow/ASCII (np. "left"/"right" zamiast strzalek) w kodzie generowanym przez heredoc.
- **VS Code + literka M na zakladce:** to normalne "modified vs commit", nie "buforowany".
  Widok Git Local Changes (Working Tree) pokazuje dokladnie roznice.
- **Dev serwer nie chodzi po push -> stare wersje w cache:** ubijac procesy przez taskkill /IM node.exe /F
  i czyscic .next przez Remove-Item -Recurse -Force .next
- **Klasy Tailwinda w kwadratowych nawiasach (np. text-[10px]):** czasem sypia sie w Next 16.2.4.
  Uzywac standardowych klas Tailwinda (text-xs, text-sm) gdzie mozna.
- **URL nie moze miec polskich znakow:** przy Ctrl+H uwaga zeby nie zmienic href="/ogloszenia"
  na href="/Ogloszenia" ani "/ogłoszenia". Klikac pojedynczo Replace, nie Replace All.
  Widok Git Local Changes (Working Tree) w VS Code = szybki sprawdzian co poszlo nie tak.
- **Supabase generuje scisle typy dla pol enumowych** (np. vehicle_type, status, fuel,
  transmission) - zwykly string trzeba rzutowac "as ...typ..." przy insert/update.
- **vat_type w bazie to 'marza' lub 'vat23'** (NIE '23' - constraint listings_vat_type_check
  odrzuci cokolwiek innego).
- **ContactRequestUpdate (typy generowane) nie zawiera is_read/notes** - update tych pol
  wymaga rzutowania "as never" w .update({...} as never). Dziala poprawnie mimo warningu typow.
- **Domena fidens.pl kupiona, ale BRAK pakietu hostingowego** - wiec brak mozliwosci
  zalozenia ...@fidens.pl bez dodatkowego zakupu (hosting Hostido / Zoho Mail / Google Workspace).
  Admin loguje sie na razie zwyklym istniejacym mailem.
- **Ogloszenie tygodnia** (is_featured=true) nie ma automatycznego zastepstwa: jesli
  cron ustawi mu status=inactive (bo zniknelo z OtoMoto), sekcja "Ogloszenie tygodnia"
  po prostu znika ze strony glownej (.maybeSingle() zwraca null, reszta strony dziala
  normalnie) - system NIE wybiera automatycznie innego ogloszenia. Trzeba recznie
  ustawic is_featured=true na innym w panelu admina.
- **next/image wymaga next.config.ts z images.remotePatterns** dla hosta Supabase Storage
  (mglgfsaimktblkzjkmfg.supabase.co) - jesli kiedys zmieni sie projekt Supabase (nowy URL),
  trzeba zaktualizowac remotePatterns, inaczej obrazki przestana sie ladowac z bledem
  "Invalid src prop, hostname not configured".
- **Zdjecie w lightboxie (Carousel.tsx) to celowo zwykly <img>, nie next/image** - patrz
  sekcja "next/image" wyzej po wyjasnienie.