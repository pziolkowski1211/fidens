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
    - page.tsx (lista ogloszen z filtrami z URL)
  - favicon.ico
  - globals.css
  - layout.tsx
  - page.tsx (strona glowna)
- lib/
  - supabase/
    - client.ts (klient browser)
    - server.ts (klient server, cookies)
    - types.ts (typy TS dla bazy)
  - vehicles/
    - catalog.ts (statyczna lista marek/modeli)
- public/
  - jasne.png (logo na ciemne tlo)
  - ciemne.png (logo na jasne tlo)
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
- description, location_city
- search_vector (TSVECTOR + GIN index dla pelnotekstowego wyszukiwania)

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

## Decyzje produktowe (zatwierdzone z klientem)
- **Galeria zdjec:** karuzela (wiele zdjec na ogloszenie)
- **Kalkulator leasingu:** tylko frontend (nie zapisuje do bazy, tylko wysyla parametry w mailu)
- **Wyszukiwarka:** autocomplete typu Google ze statycznej listy (~50 marek + modele).
  Klik w sugestie -> /ogloszenia?marka=X&model=Y. Brak wynikow -> CTA "Zapytaj o ten pojazd" z prefilled marka/modelem.
- **Mobile nawigacja:** logo + lupa + hamburger. Drawer wysuwany z prawej.
- **Logo klikalne** (powrot na strone glowna).
- **Import z OtoMoto:** scraping po URL ogloszenia (brak oficjalnego API).
  Zdjecia uploadowane RECZNIE (osobno od OtoMoto) - inne kadry/jakosc.
  Synchronizacja: jak ogloszenie znika z OtoMoto -> znika z Fidens.

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
- [x] Wgrane na Vercel -> fidens.pl

### Do zrobienia (priorytety)
1. **Strona pojedynczego ogloszenia** /ogloszenia/[slug]
   - Karuzela zdjec
   - Pelne dane pojazdu
   - Kalkulator leasingu (suwaki: oplata wstepna 0-45%, okres 12-72 msc, wykup 1-30%)
   - CTA -> formularz kontaktowy z prefilled parametrami leasingu

2. **Pobieranie ogloszen z bazy Supabase**
   - Strona glowna: ogloszenie tygodnia + 3 najnowsze
   - Strona /ogloszenia: lista filtrowana po query params

3. **Panel admina** /admin
   - Logowanie przez Supabase Auth (tylko 1 user)
   - CRUD na ogloszeniach (tworzenie, edycja, usuwanie)
   - Upload zdjec do Supabase Storage (drag and drop, multi-file)
   - Ustawianie cover image, kolejnosci zdjec
   - Lista contact_requests z mozliwoscia oznaczania jako przeczytane + notatki

4. **Formularz kontaktowy** /kontakt
   - Pola: imie, telefon, email + parametry leasingu
   - Resend -> mail do wlasciciela z parametrami pojazdu i leasingu
   - Zapis do contact_requests

5. **Import z OtoMoto**
   - Pole "Wklej link OtoMoto" w panelu admina
   - Scraping danych pojazdu (marka, model, rok, przebieg, cena, opis...)
   - Stworzenie listingu z otomoto_url i otomoto_id
   - Zdjecia ZAWSZE wgrywane recznie (osobno)

6. **Synchronizacja z OtoMoto**
   - Cron (Vercel Cron Jobs?) raz dziennie sprawdza wszystkie listings z otomoto_url
   - Jezeli OtoMoto zwraca 404 -> ustaw status='inactive' (nie usuwa, zachowuje historie)

7. **Drobiazgi**
   - [ ] Favicon z logo Fidens (use favicon.io/favicon-converter)
   - [ ] Tytuly stron (Open Graph + meta description per strona)
   - [ ] Strony statyczne: /o-nas, /leasing, /regulamin, /polityka

## Konwencje pracy
- **Pisanie kodu:** komendy w terminalu (PowerShell) z Out-File -Encoding utf8
- **Test:** zawsze npm run dev na localhost:3000 + sprawdzenie mobile (DevTools F12 -> ikona telefonu)
- **Mobile real device:** npx next dev -H 0.0.0.0 -> wpisac IP komputera w przegladarce telefonu
- **Wgranie:** git add . && git commit -m "opis" && git push -> Vercel auto-rebuild
- **Wszystkie zmiany testujemy lokalnie ZANIM git push** (zeby fidens.pl sie nie zepsul)

## Znane problemy/uwagi
- **Hydration warning** od rozszerzenia Bitdefender (atrybuty bis_register, bis_skin_checked).
  To NIE jest blad kodu - tylko deweloperski warning w trybie dev. W produkcji niewidoczny.
- W folderach pisanych w PowerShell uwazac na nazwy (kiedys byla literowka supabase vs supabase).
