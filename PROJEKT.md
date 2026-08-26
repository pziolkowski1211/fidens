# Fidens.pl - Projekt strony

## Cel projektu
Strona dla brokera/dealera leasingowego (auta osobowe, ciezarowe, maszyny budowlane).
Klienci wchodza glownie z social mediow -> mobile pierwszy priorytet.

## Stack techniczny
- **Next.js 16** (App Router, Turbopack) + TypeScript + Tailwind v4
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

## Struktura folderow

fidens/
- app/
  - components/
    - Navbar.tsx (nawigacja desktop/mobile + hamburger)
    - SearchAutocomplete.tsx (wyszukiwarka z autocomplete)
    - Carousel.tsx (karuzela zdjec + lightbox z klawiszami i swipe)
    - LeasingCalculator.tsx (kalkulator leasingu/pozyczki z suwakami)
    - ImageUploader.tsx (upload+kompresja zdjec, okladka, kolejnosc, usuwanie - uzywany w adminie)
  - admin/
    - layout.tsx (gorny pasek nawigacji: Ogloszenia / Zapytania / Wyloguj, ukryty na /admin/login)
    - login/
      - page.tsx (logowanie Supabase Auth email+haslo)
    - ogloszenia/
      - page.tsx (lista ogloszen w tabeli, link Edytuj, przycisk Dodaj nowe)
      - nowe/
        - page.tsx (formularz dodawania ogloszenia)
      - [id]/
        - page.tsx (formularz edycji + ImageUploader + usuwanie ogloszenia)
    - zapytania/
      - page.tsx (lista contact_requests, oznaczanie przeczytane, notatki z potwierdzeniem zapisu)
  - ogloszenia/
    - page.tsx (lista ogloszen z filtrami z URL + cover images)
    - [slug]/
      - page.tsx (strona pojedynczego ogloszenia + karuzela + kalkulator)
  - favicon.ico
  - globals.css
  - layout.tsx
  - page.tsx (strona glowna z cover images w ogloszeniu tygodnia i najnowszych)
- lib/
  - supabase/
    - client.ts (klient browser)
    - server.ts (klient server, cookies, async createClient)
    - types.ts (typy TS dla bazy)
  - vehicles/
    - catalog.ts (statyczna lista marek/modeli)
- public/
  - jasne.png (logo na ciemne tlo)
  - ciemne.png (logo na jasne tlo)
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
  zawiera sekcje Zdjecia (ImageUploader) i przycisk Usun ogloszenie (z potwierdzeniem).
- **Upload zdjec** (ImageUploader.tsx, komponent uzywany w [id]/page.tsx):
  - drag&drop + zwykly input file, multi-file
  - kompresja w przegladarce (browser-image-compression: maxWidthOrHeight 1600, maxSizeMB 0.4)
  - upload do Storage bucket listing-images pod folder=slug
  - zapis rekordu do listing_images, pierwsze wgrane zdjecie automatycznie = okladka
  - przyciski: strzalki kolejnosci (podpisane "left"/"right" - unikalismy strzalek Unicode
    bo namieszaly w PowerShell heredoc), Ustaw okladke, Usun
- **Zapytania** /admin/zapytania: lista contact_requests (najnowsze first), pomaranczowa
  ramka gdy nieprzeczytane, przycisk toggle Przeczytane/Nieprzeczytane, pole notatek
  z przyciskiem Zapisz + potwierdzenie "Zapisano" (znika po 2s).

## Decyzje produktowe (zatwierdzone z klientem)
- **Galeria zdjec:** karuzela z lightbox (kliknij zdjecie zeby powiekszyc)
- **Kalkulator leasingu:** frontend only, parametry wysylane w URL do /kontakt
  - Automatycznie wybiera typ na podstawie vat_type: 'marza' = pozyczka leasingowa (bez wykupu), inaczej = leasing (z wykupem)
  - Wzor: annuita z balonem, APR 5,2% (najkorzystniej) do 6,2% (najmniej korzystnie)
  - Uklad "wariant A": rata jako hero (44px), cena drobno pod ratą
- **Wyszukiwarka:** autocomplete typu Google ze statycznej listy (~50 marek + modele).
  Klik w sugestie -> /ogloszenia?marka=X&model=Y. Brak wynikow -> CTA "Zapytaj o ten pojazd" z prefilled marka/modelem.
- **Mobile nawigacja:** logo + lupa + hamburger. Drawer wysuwany z prawej.
- **Logo klikalne** (powrot na strone glowna).
- **Panel admina:** gorny pasek nawigacji (nie sidebar) - decyzja pod kontem uzytkowania z telefonu.
- **Import z OtoMoto:** scraping po URL ogloszenia (brak oficjalnego API).
  Zdjecia uploadowane RECZNIE (osobno od OtoMoto) - inne kadry/jakosc.
  Synchronizacja: jak ogloszenie znika z OtoMoto -> znika z Fidens.

## Kalkulator leasingu - szczegoly

### Wzor (LeasingCalculator.tsx)
Klasyczna annuita z balonem:
kapital = cena - wplata
PV = kapital - wykup / (1+r)^n
rata = PV * r / (1 - (1+r)^(-n))


### APR zalezne od parametrow (5,2% - 6,2%)
Score liczony ze srednich 3 parametrow (2 dla pozyczki - bez wykupu):
- wplata_score = 1 - wplata/45 (max wplata = najkorzystniej)
- okres_score = (okres-24)/48 (krotszy okres = najkorzystniej)
- wykup_score = (wykup - wykupMin) / (wykupMax - wykupMin) (min wykup = najkorzystniej)
- APR = 5,2 + score * 1,0

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
- [x] Kalkulator leasingu/pozyczki (Opcja A - proste zalezne APR 5,2-6,2%)
- [x] Formularz kontaktowy /kontakt (Supabase insert do contact_requests)
- [x] Wgrane na Vercel -> fidens.pl
- [x] **Panel admina /admin - KOMPLETNY** (auth, logowanie, layout, CRUD ogloszen,
      upload zdjec z kompresja/okladka/kolejnoscia, usuwanie, lista zapytan z notatkami)

### Do zrobienia (priorytety)

1. **Resend - wysylka maili z formularza /kontakt** <-- NASTEPNY KROK
   - DNS verification dla fidens.pl przez Hostido bylo w toku, sprawdzic status
   - Mail do wlasciciela z parametrami pojazdu i leasingu przy nowym contact_request

2. **Drobne dopiecia panelu admina**
   - Formularz "nowe" ogloszenie: dodac widoczna wskazowke ze zdjecia dodaje sie
     dopiero po zapisaniu (bo ImageUploader wymaga listing_id)
   - Rozwazyc email admina docelowo na ...@fidens.pl (patrz sekcja Poczta)

3. **"Od X zl" na kartach ogloszen** (obecnie pokazuje leasing_rate_pln z bazy)
   - Zamiast statycznej raty z bazy - liczyc dynamicznie "najatrakcyjniejsza" rate
   - Wariant B (realistyczny): wplata 20%, okres 60 msc, wykup MAX dla okresu (35% dla 60)
   - Wariant A (skrajny): max wplata 45%, max okres 72 msc, max wykup 30% - agresywne "od X"
   - Decyzja klienta: wariant B jesli chcemy uczciwie sprzedawac, A jesli agresywnie
   - Alternatywnie: pole showcase_rate w bazie, klientka wpisuje recznie per pojazd

4. **Import z OtoMoto**
   - Pole "Wklej link OtoMoto" w panelu admina
   - Scraping danych pojazdu (marka, model, rok, przebieg, cena, opis...)
   - Stworzenie listingu z otomoto_url i otomoto_id
   - Zdjecia ZAWSZE wgrywane recznie (osobno)

5. **Synchronizacja z OtoMoto**
   - Cron (Vercel Cron Jobs?) raz dziennie sprawdza wszystkie listings z otomoto_url
   - Jezeli OtoMoto zwraca 404 -> ustaw status='inactive' (nie usuwa, zachowuje historie)

6. **SEO i optymalizacja**
   - Przejsc z <img> na <next/image> (karuzela, karta ogloszen, cover images, ImageUploader
     w panelu admina) - wymaga next.config.ts z remotePatterns dla Supabase
   - Kalibracja kalkulatora (Opcja C) - tabela marz od klientki, wtedy odchylenia od prawdziwego systemu banku znikna (obecnie 4-5%)
   - Favicon z logo Fidens (favicon.io/favicon-converter)
   - Meta tagi (Open Graph + description per strona)
   - Strony statyczne: /o-nas, /leasing, /regulamin, /polityka

## Konwencje pracy
- **Pisanie kodu:** komendy w terminalu (PowerShell) z Out-File -Encoding utf8
- **Test:** zawsze npm run dev na localhost:3000 + sprawdzenie mobile (DevTools F12 -> ikona telefonu)
- **Mobile real device:** npx next dev -H 0.0.0.0 -> wpisac IP komputera w przegladarce telefonu
- **Wgranie:** git add . && git commit -m "opis" && git push -> Vercel auto-rebuild
- **Wszystkie zmiany testujemy lokalnie ZANIM git push** (zeby fidens.pl sie nie zepsul)
- **PRZED KAZDYM PUSHEM:** npm run build lokalnie (Vercel wywala deployment na warningach TypeScript/ESLint)
- **Next.js 16: middleware.ts jest DEPRECATED, uzywamy proxy.ts** (funkcja musi nazywac sie
  "proxy" nie "middleware"). Plik w repo to juz proxy.ts, nie tworzyc ponownie middleware.ts.

## Znane problemy/uwagi
- **Hydration warning** od rozszerzenia Bitdefender (atrybuty bis_register, bis_skin_checked).
  To NIE jest blad kodu - tylko deweloperski warning w trybie dev (widoczny tez jako
  czerwony badge "1 Issue" w rogu ekranu w dev mode). W produkcji niewidoczny. Ignorowac.
- **PowerShell + polskie znaki w komendach:** nie dziala (encoding sie rozjezdza).
  Uzywamy komend BEZ polskich znakow (np. "Wplata wstepna"), potem w VS Code przez Ctrl+H
  przywracamy ogonki. Zawartosc plikow z -Encoding utf8 dziala OK.
- **W folderach z nawiasami kwadratowymi ([slug], [id]):** uzywac Set-Content -LiteralPath
  (nie Out-File -FilePath, bo interpretuje nawiasy jako wildcard i wywala blad
  "did not resolve to a file").
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
