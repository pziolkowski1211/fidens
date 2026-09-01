# Fidens.pl - Projekt strony

## Cel projektu
Strona dla brokera/dealera leasingowego (auta osobowe, ciezarowe, maszyny budowlane, pawilony).
Klienci wchodza glownie z social mediow -> mobile pierwszy priorytet.

## Stack techniczny
- **Next.js 16** (App Router, Turbopack) + TypeScript + Tailwind v4
- **Supabase** - baza danych (Postgres), Auth (panel admina), Storage (zdjecia)
- **Vercel** - hosting -> fidens.pl (+ Vercel Cron Jobs dla synchronizacji OtoMoto)
- **Resend** - wysylka maili DZIALA (powiadomienia o nowych zapytaniach). Docelowo: mailing
  do osob z marketing_consent=true.

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
- SUPABASE_SERVICE_ROLE_KEY - klucz z pelnym dostepem pomijajacym RLS, uzywany
  WYLACZNIE server-side (lib/supabase/service.ts -> createServiceClient()).
  Odkryty 01.09, dodany na Vercel 26.08 (prawdopodobnie do cron joba OtoMoto),
  wczesniej NIEUDOKUMENTOWANY - NIGDY nie importowac w komponentach klienckich.

Te same klucze sa dodane na Vercel (Environment Variables -> Production/Preview/Development).

## Identyfikacja wizualna
- **Granat (primary):** #1B2A4A
- **Pomaranczowy (accent):** #F0A500
- **Tlo jasne:** #f8f9fb
- **Bordery:** #e8eaed
- **Logo jasne (na ciemne tlo):** public/jasne.png
- **Logo ciemne (na jasne tlo):** public/ciemne.png

## Struktura folderow

fidens/
- app/
  - components/
    - Navbar.tsx (nawigacja desktop/mobile + hamburger, STICKY - sticky top-0 z-50)
    - SearchAutocomplete.tsx (wyszukiwarka z autocomplete)
    - Carousel.tsx (karuzela zdjec + lightbox, uzywana tez przez pawilony)
    - LeasingCalculator.tsx (kalkulator dla POJAZDOW, prop opcjonalny ctaLabel)
    - PawilonCalculator.tsx (ODDZIELNY kalkulator dla PAWILONOW - bez wykupu, leasing
      operacyjny tylko 48/60 msc)
    - ImageUploader.tsx (upload/reorder/cover/delete zdjec w panelu admina + import z OtoMoto)
    - ConfirmDialog.tsx (modal potwierdzenia - uzywany przy usuwaniu ogloszen; przycisk
      potwierdzenia ma domyslny tekst "Usun" (confirmLabel), NIE mylic z przyciskiem
      wyzwalajacym ktory bywa nazwany inaczej np. "Usun ogloszenie")
  - admin/
    - layout.tsx (naglowek z linkami Ogloszenia/Zapytania + Wyloguj - POPRAWIONA 30.08:
      brakowalo polskiego znaku "l z kreska" w slowie "Ogloszenia" w tablicy links[])
    - login/ (logowanie admina przez Supabase Auth)
    - ogloszenia/ (lista + CRUD)
      - otomoto-actions.ts (TYLKO importOtomotoListing - dane tekstowe, LEKKI, bez sharp)
      - otomoto-photos-actions.ts (TYLKO importOtomotoPhotos - import zdjec, uzywa sharp)
      - nowe/ (formularz dodawania, import OtoMoto, toolbar Bold/Lista, layout.tsx z maxDuration=30)
      - [id]/ (edycja, te same funkcje co nowe/, layout.tsx z maxDuration=30)
    - zapytania/ (lista contact_requests, oznaczanie przeczytane/notatki/usuwanie)
      - TODO: dodac widoczny znacznik marketing_consent przy kazdym zapytaniu
  - api/
    - cron/
      - otomoto-sync/route.ts (codzienna synchronizacja o 3:00 - dezaktywuje znikniete ogloszenia)
  - ogloszenia/
    - page.tsx (lista ogloszen z filtrami z URL + cover images, hover: zoom zdjecia + uniesienie karty)
    - [slug]/
      - page.tsx (strona pojedynczego ogloszenia: tytul -> karuzela -> Dane pojazdu -> Opis
        (renderowany z Markdown) -> LeasingCalculator)
  - pawilony/
    - page.tsx (lista realizacji - na sztywno w kodzie, NIE w bazie danych. Naglowek "Pawilony
      i kontenery na zamowienie", 5 realizacji + kafelek "Twoj wlasny projekt" z CTA do /kontakt.
      Karty: znaczek kategorii na zdjeciu, ikonki wymiary/powierzchnia, plakietka ceny,
      hover zoom+uniesienie)
    - domek-caloroczny-35m2-z-antresola/ (REALNE dane: cena 158 000 zl, 6 zdjec)
    - dom-modulowy-40m2-10x4m/ (PLACEHOLDER cena/opis/wyposazenie, 6 zdjec - UWAGA: pliki
      zdjec sa obecnie uszkodzone/puste, patrz sekcja "Testy regresyjne")
    - pawilon-biurowy-24m2-8x3m/ (PLACEHOLDER cena/opis/wyposazenie, 9 zdjec)
    - pawilon-gastronomiczny-18m2-6x3m/ (PLACEHOLDER cena/opis/wyposazenie, 4 zdjecia)
    - domek-modulowy-42m2-elewacja-palisandrowa/ (PLACEHOLDER cena/opis/wyposazenie, 5 zdjec)
  - o-nas/
    - page.tsx (strona "Dlaczego Fidens?" - zaufanie, benefity, CTA)
  - leasing/
    - page.tsx (strona "Leasing dla firm" - edukacyjna, VAT-23 vs VAT-marza, proces)
  - regulamin/
    - page.tsx (regulamin serwisu - szkic z placeholderami danych spolki)
  - polityka/
    - page.tsx (polityka prywatnosci - szkic z placeholderami danych spolki)
    - TODO: dopisac sekcje o zgodzie marketingowej
  - kontakt/
    - page.tsx (Suspense wrapper)
    - KontaktForm.tsx (Navbar + formularz + stopka, checkbox marketing_consent widoczny
      zolty box, NIE pre-checked, ukryte pole honeypot "website" - patrz nizej)
    - actions.ts (Server Action submitContactForm - zapisuje do Supabase + Resend,
      sprawdza honeypot jako pierwszy krok)
  - favicon.ico
  - globals.css (cursor:pointer na suwakach input[type=range])
  - layout.tsx
  - page.tsx (strona glowna, hover: zoom zdjecia + uniesienie karty na "Ogloszenie tygodnia"
    i "Najnowsze oferty")
- lib/
  - supabase/
    - client.ts, server.ts
    - service.ts (createServiceClient() - klient z SUPABASE_SERVICE_ROLE_KEY, pomija RLS,
      TYLKO server-side, np. cron OtoMoto)
    - types.ts (typy TS dla bazy - AKTUALIZOWAC przy KAZDEJ zmianie schematu w Supabase!)
  - kontakt/
    - validate.ts (walidacja serwerowa formularza kontaktowego - imie, telefon PL,
      email, suma kontrolna NIP, dlugosc wiadomosci; zwraca ktore pole zawiodlo)
  - leasing/
    - calculator.ts (wspolny wzor raty - LeasingCalculator, PawilonCalculator, karty ogloszen)
  - otomoto/
    - scraper.ts (import danych z OtoMoto)
  - vehicles/
    - catalog.ts (statyczna lista marek/modeli)
- public/
  - jasne.png, ciemne.png
  - pawilony/ (5 podfolderow ze zdjeciami statycznymi, NIE Supabase Storage)
- tests/
  - helpers.ts (funkcja loginAsAdmin())
  - navbar.spec.ts, homepage.spec.ts, ogloszenia-list.spec.ts, ogloszenie-detail.spec.ts,
    kontakt.spec.ts, admin-login.spec.ts, admin-crud.spec.ts, pawilony.spec.ts,
    static-pages.spec.ts
  - playwright.config.ts (w katalogu glownym, nie w tests/)
- .env.local, .env.test (oba POZA GITEM), vercel.json, playwright.config.ts,
  next.config.ts (ma serverExternalPackages: ["sharp"])
- PROJEKT.md, AGENTS.md, CLAUDE.md

## Schemat bazy Supabase
WAZNE: kazda zmiana schematu (SQL Editor w Supabase) MUSI byc odzwierciedlona w
lib/supabase/types.ts, inaczej build TypeScript sie wywali.

### listings (ogloszenia)
id, title, slug, vehicle_type ('osobowe'|'ciezarowe'|'maszyna'), status, brand, model, variant,
year, mileage_km, mileage_hours, fuel, transmission, power_hp, engine_cc, color, country_origin,
price_pln, leasing_rate_pln, leasing_initial_pct, leasing_months, leasing_residual_pct,
is_featured, badge, otomoto_url, otomoto_id, description, location_city, vat_type, search_vector

### listing_images
id, listing_id (FK), storage_path, url, position, is_cover

### contact_requests
id, listing_id (FK, nullable), name, phone, email, leasing_initial_pct, leasing_months,
leasing_residual_pct, marketing_consent (boolean, DODANE), is_read, notes,
ip_address (text, DODANE 01.09 - rate-limit po IP, max 3 zgloszenia / 10 min)

### Storage bucket
listing-images - publiczny odczyt, upload tylko admin. UWAGA: zdjecia PAWILONOW sa statyczne
w public/pawilony/, NIE w tym bucketcie.

### RLS policies
Public: SELECT na active listings + images, INSERT na contact_requests.
Authenticated (admin): pelny dostep.

ZWERYFIKOWANE 31.08 (audyt bezpieczenstwa): rowsecurity=true na wszystkich 3 tabelach.
Test w oknie incognito na /rest/v1/contact_requests?select=*&apikey=ANON_KEY zwraca
pusta tablice [] - anon NIE ma dostepu do danych klientow. Polityki "Admin full access"
maja warunek auth.role() = authenticated (mimo ze w kolumnie roles widnieje {public},
faktyczny dostep jest ograniczony przez warunek USING). Wszystko poprawnie skonfigurowane,
brak wycieku danych.

## Decyzje produktowe (zatwierdzone z klientem)

### Kalkulator leasingu (pojazdy)
- VAT-marza: zawsze pozyczka (bez wykupu)
- VAT-23: wybor Leasing operacyjny (wykup, cena netto) / Pozyczka (bez wykupu, cena brutto)
- APR 5,4%-7,3%, wplata 0-45%, okres 24-72 msc, prop ctaLabel opcjonalny na przycisku

### PAWILONY - kompletna sekcja (ZROBIONA)
Osobna zakladka w Navbarze. Male realizacje na sztywno w kodzie (NIE baza, NIE panel admina -
klient chcial prostote, rzadko zmienia). Kazda realizacja to osobny statyczny route.

**Finansowanie pawilonow (INNE niz pojazdy!):**
- Leasing operacyjny: TYLKO 48 lub 60 miesiecy (przyciski, nie suwak), NIGDY bez wykupu w sensie
  odwrotnym - a raczej: leasing operacyjny pawilonow ZAWSZE bez wykupu (w przeciwienstwie do
  pojazdow, gdzie leasing operacyjny ZAWSZE ma wykup). Cena mimo to liczona od NETTO.
- Pozyczka: bez zmian (24-72 msc suwak, cena brutto, bez wykupu)
- "Leasing finansowy" ROZWAZANY i ODRZUCONY - matematycznie identyczny z pozyczka, zbedny

**5 realizacji (stan na dzisiaj):**
1. Domek caloroczny 35m2 z antresola (10x3,5m) - REALNE dane, cena 158 000 zl brutto, 6 zdjec
2. Dom modulowy 40m2 (10x4m) - PLACEHOLDER, 6 zdjec (zdjecia obecnie uszkodzone, patrz TODO)
3. Pawilon biurowy 24m2 (8x3m) - PLACEHOLDER, 9 zdjec
4. Pawilon gastronomiczny 18m2 (6x3m) - PLACEHOLDER, 4 zdjecia
5. Domek modulowy 42m2 z elewacja palisandrowa (7x6m) - PLACEHOLDER, 5 zdjec

**WAZNE - strona /pawilony NIE JEST jeszcze promowana/znana klientom** (potwierdzone przez
klienta), dlatego placeholdery cen sa akceptowalne tymczasowo - ale PRZED promowaniem strony
TRZEBA uzupelnic wszystkie 4 nowe realizacje: realna cena, opis, lista wyposazenia,
zastosowania. Kazdy placeholder oznaczony zoltym tlem (#FFF3B0) i tekstem
"[DO UZUPELNIENIA...]" - latwo znalezc przez wyszukanie "DO UZUPEŁNIENIA" lub "placeholder"
w folderze app/pawilony.

**Design kart na liscie /pawilony (i powielony na /ogloszenia + strona glowna):**
- Znaczek kategorii (granatowa plakietka) w lewym gornym rogu zdjecia
- Ikonki (linijka/kwadrat) przy wymiary/powierzchnia zamiast suchego tekstu
- Cena jako wyrozniona "plakietka" z tlem (zolte dla placeholder, jasnozolte dla realnej)
- Hover: cala karta "grupa" (className="group"), zdjecie sie powieksza
  (group-hover:scale-110 transition-transform duration-500), karta sie unosi
  (hover:-translate-y-1 transition-all duration-300) + cien (hover:shadow-lg)
- TEN SAM wzorzec hover zastosowany tez na kartach /ogloszenia i stronie glownej
  (Ogloszenie tygodnia + Najnowsze oferty) dla spojnosci wizualnej calego serwisu

### Formatowanie opisu ogloszen (Markdown)
Wlasny, lekki parser (bez biblioteki). Obslugiwane: naglowki # ## ###, **pogrubienie**,
listy "- "/"* ", linia poziona --- lub ***, calkowicie pogrubiona linia z dwukropkiem
tez jako naglowek. Funkcje renderDescription + parseInlineBold w app/ogloszenia/[slug]/page.tsx.
Przyciski "B"/"Lista" w panelu admina (oba formularze).

### Zgoda marketingowa
Checkbox w /kontakt (wyrazny, zolte tlo, NIE pre-checked - wymog RODO art. 7 ust. 4 +
Prawo telekomunikacyjne art. 172). Kolumna marketing_consent w bazie. Zapis dziala.
TODO: badge w /admin/zapytania, sekcja w Polityce Prywatnosci.

### Podmiot prawny
Regulamin/Polityka na spolke z o.o. (jeszcze niezalozona), nie na obecna JDG.

### Audyt bezpieczenstwa (31.08) - co zrobione, co odlozone
Otrzymany raport audytu kodu (53 pliki) wskazal szereg problemow. Piotr zdecydowal
ktore naprawiac teraz, a ktore przy przejsciu na "live z reklama":

ODLOZONE na pozniej (swiadoma decyzja Piotra, 31.08):
- Fikcyjne opinie klientow na stronie glownej (app/page.tsx) - do usuniecia/zastapienia
  prawdziwymi
- Dane administratora/spolki w regulaminie i polityce prywatnosci - placeholdery
  zostana przed przejsciem live
- Zdjecia 4 z 5 pawilonow (brakujace pliki) - zostana dodane pozniej
- SSRF w walidacji URL OtoMoto (url.includes("otomoto.pl") zamiast parsowania URL)
- Reszta listy z audytu: patrz RAPORT-AUDYT-FIDENS.md (przeslany 31.08) sekcja 7

ZROBIONE 01.09 (sesja naprawcza po audycie):
- Sharp: potwierdzono ze blad ERR_DLOPEN_FAILED w sharp 0.35.x na Vercel/Turbopack
  NADAL jest otwarty i niezalatany (github.com/lovell/sharp/issues/4567, brak
  odpowiedzi maintainera). Podatnosci HIGH (GHSA-f88m-g3jw-g9cj) nie maja patcha
  na galezi 0.34.x - jedyny oficjalny fix to upgrade do 0.35.0+. ROZWIAZANIE:
  zostajemy na sharp@0.34.5 (dziala stabilnie), dodano sharp.block({ operation:
  ["VipsForeignLoadNsgif", "VipsForeignLoadTiff", "VipsForeignLoadVips"] }) w
  otomoto-photos-actions.ts - blokuje dekodery formatow (GIF/TIFF/VIPS) ktorych
  i tak nie uzywamy (obrabiamy tylko JPEG z OtoMoto), co eliminuje wektor ataku
  bez zmiany wersji i bez ryzyka zlamania importu zdjec. NIE probowac ponownie
  upgrade'u sharp bez sprawdzenia najpierw statusu issue #4567.
- Walidacja serwerowa formularza kontaktowego: nowy plik lib/kontakt/validate.ts
  (walidacja imienia, telefonu PL, email, sumy kontrolnej NIP, dlugosci wiadomosci
  max 2000 znakow). Zwraca tez ktore pole zawiodlo (field), formularz podswietla
  je na czerwono.
- Rate-limit po IP: nowa kolumna contact_requests.ip_address (+ indeks
  ip_address+created_at), max 3 zgloszenia / 10 minut z jednego IP. IP odczytywane
  z naglowka x-forwarded-for (dziala na Vercel).
- Double opt-in dla Resend: ZAIMPLEMENTOWANY, a nastepnie SWIADOMIE WYCOFANY tego
  samego dnia (decyzja biznesowa Piotra) - token+mail potwierdzajacy tworzyl zbyt
  duze tarcie (klient musial klikac zgode dwa razy - raz checkbox, raz link w mailu).
  ZAMIAST TEGO: zostaje pojedyncza zgoda (checkbox -> od razu resend.contacts.create),
  a wypisanie sie z listy obslugiwane przez wbudowany w Resend Broadcasts link
  "unsubscribed" (automatycznie ustawia unsubscribed=true po kliknieciu przez
  odbiorce, nie wymaga wlasnego kodu). NIE wracac do pomyslu double opt-in bez
  ponownej rozmowy z Piotrem - to swiadoma, przemyslana decyzja, nie zapomniany TODO.
- Odkryto NIEUDOKUMENTOWANY plik lib/supabase/service.ts (createServiceClient(),
  klient z pelnym dostepem pomijajacym RLS) i zmienna SUPABASE_SERVICE_ROLE_KEY w
  Vercel (dodane 26.08, prawdopodobnie do cron joba OtoMoto) - NIE bylo o tym
  wzmianki w PROJEKT.md. Doszly do glosu przy probie double opt-in. Klucz sluzy
  wylacznie do kodu server-side bez sesji uzytkownika, NIGDY nie importowac w
  komponentach klienckich.
- UX formularza kontaktowego: 3 poprawki naraz -
  1) Pola formularza NIE czysciy sie juz po bledzie walidacji (przejscie z
     niekontrolowanych inputow na useState per pole)
  2) Pole z bledem podswietla sie na czerwono (borderStyle() w KontaktForm.tsx
     na podstawie field zwroconego z walidacji)
  3) NAPRAWIONY subtelny bug Reacta 19: <form action={...}> automatycznie
     resetuje formularz na poziomie przegladarki po kazdym submicie (nawet przy
     bledzie), co czasem "gubilo" stan checkboxa mimo ze byl kontrolowany -
     React nie odswiezal go z powrotem bo prop "checked" nie zmienil sie miedzy
     renderami mimo ze DOM zostal zresetowany pod spodem. Naprawa: zamieniono
     <form action={handleSubmit}> na <form onSubmit={onFormSubmit}> z recznym
     budowaniem FormData (new FormData(e.currentTarget)) - to omija automatyczny
     reset Reacta calkowicie.

ZROBIONE teraz (31.08):
- Weryfikacja RLS w Supabase - rowsecurity=true na wszystkich tabelach, test w
  incognito potwierdza brak publicznego dostepu do danych klientow (szczegoly w
  sekcji "RLS policies" wyzej)
- Honeypot w formularzu kontaktowym - ukryte pole "website" (poza ekranem, aria-hidden,
  tabIndex=-1), jesli wypelnione (bot) - submitContactForm cicho zwraca sukces bez
  zapisu do bazy/Resend/maila. Pierwsza linia obrony przed prostymi botami spamowymi

NAPRAWIONY (01.09): podwojne kilkniecie "Wyslij zapytanie" moglo wyslac formularz
dwa razy (brak natychmiastowej blokady przycisku). Naprawa: isSubmittingRef (useRef)
w KontaktForm.tsx - synchroniczna blokada w handleSubmit ustawiana natychmiast,
niezaleznie od re-renderu (setStatus jest asynchroniczny, wiec disabled na przycisku
samo w sobie nie wystarczalo). Wdrozone i wypchniete na produkcje.

### Zgoda marketingowa - integracja z Resend (30.08, ZROBIONE)
Kontakty z marketing_consent=true sa TERAZ automatycznie dodawane do dedykowanego
segmentu w Resend, zeby Piotr mogl wysylac zbiorowe maile (np. zyczenia) przez
Resend Broadcasts bez budowania wlasnego systemu mailingowego.

- Segment Resend: "Fidens - Zgoda marketingowa", ID: 36608761-95f3-431e-bb2c-000684e745b4
- Kod: app/kontakt/actions.ts, blok "if (marketingConsent && email)" PRZED wysylka
  maila powiadomienia - wywoluje resend.contacts.create({ email, firstName, lastName,
  unsubscribed: false, audienceId: "..." }). Imie/nazwisko dzielone z pola "name" po
  pierwszej spacji (dla placeholderow {{{FIRST_NAME}}} w przyszlych broadcastach)
- Blad zlapany przez try/catch, loguje do konsoli serwera, NIE blokuje zapisu
  glownego zapytania do bazy ani maila powiadomienia jesli Resend zawiedzie
- WAZNE: RESEND_API_KEY zostal wymieniony na klucz z uprawnieniem "Full access"
  (poprzedni mial tylko "Sending access" i nie mogl zarzadzac kontaktami/segmentami -
  blad 401 "restricted_api_key" w logach). Zaktualizowany w .env.local ORAZ w
  Vercel Environment Variables (Production) - PRZY ROTACJI KLUCZA pamietac o OBU
  miejscach + redeploy na Vercelu
- Panel /admin/zapytania: zielony badge "Zgoda marketingowa" obok imienia, widoczny
  tylko gdy marketing_consent === true (typ ContactRequest zaktualizowany o to pole)
- Wysylka properly do WSZYSTKICH: Resend Broadcasts nie ma opcji "wszyscy kontakci",
  wymaga segmentu - dlatego segment "Fidens - Zgoda marketingowa" jest wlasnie tym
  celem (nie mylic z istniejacym segmentem "General" o nieznanym Piotrowi przeznaczeniu)
- TODO: sekcja o zgodzie marketingowej w /polityka (opis ze dane trafiaja tez do
  systemu mailingowego Resend)

### NOWE kategorie produktowe (ustalone biznesowo, JESZCZE NIE zakodowane)
- Rozszerzyc vehicle_type o "dostawcze" i "naczepy"
- "Maszyny przemyslowe" (Gantech) - osobna zakladka, mala skala
- "Import" (nazwa do ustalenia) - portfolio, 250-300k+ PLN, indywidualne wyceny
- Fotowoltaika/pompy ciepla/magazyny energii - NIE ROBIMY (odrzucone)

## Strony statyczne

### /o-nas, /leasing
Zrobione. /leasing usunieta z Navbara, zostaje tylko w stopce (SEO).

### /pawilony
Zrobione (5 realizacji). Patrz sekcja "Decyzje produktowe" wyzej.

### /regulamin, /polityka
Zrobione (szkic). NIE zweryfikowane prawniczo. Placeholdery danych spolki (zolte tlo):
[NAZWA SPOLKI], [MIASTO], [ADRES], [NIP], [REGON], [KRS], [DATA].
PRZED PUBLIKACJA: dane spolki, konsultacja prawnicza, sekcja o zgodzie marketingowej.

## Import z OtoMoto - szczegoly

### Jak dziala
extractJsonObject (marker + brace-matching) wyciaga: widget.props.advert (podstawowe dane)
i fullAdvert.details (WSZYSTKIE pola techniczne, niezalezne od CEPIK - glowne zrodlo).
cepikWidget jako fallback (czesto niedostepny).

### Struktura plikow (WAZNE - dwa osobne pliki!)
- otomoto-actions.ts - TYLKO importOtomotoListing, bez sharp, LEKKI
- otomoto-photos-actions.ts - TYLKO importOtomotoPhotos, z sharp, CIEZKI
- POWOD (incydent 29.08): oba w jednym pliku z sharp na gorze psuly WSZYSTKO (nawet import
  danych tekstowych) gdy sharp nie mogl zaladowac natywnej biblioteki na Vercel
  (ERR_DLOPEN_FAILED: libvips-cpp.so). Rozdzielenie naprawilo import danych natychmiast.
- next.config.ts ma serverExternalPackages: ["sharp"] (dobra praktyka, ale sama NIE wystarczyla)
- nowe/layout.tsx i [id]/layout.tsx maja maxDuration=30 (Server Component wrapper, bo
  page.tsx sa "use client" i nie moga eksportowac route segment config)
- WNIOSEK: ciezkie/natywne zaleznosci (sharp) NIE powinny byc w tym samym module co lekkie
  funkcje wywolywane w innych kontekstach - nawet nieuzywany import wplywa na caly modul

### Blad sharp w Server Action importu ZDJEC (30.08) - NAPRAWIONY
Po naprawie z 29.08 (rozdzielenie plikow) import DANYCH tekstowych dzialal, ale import
ZDJEC (otomoto-photos-actions.ts, ktory bezposrednio importuje "sharp") nigdy nie zostal
przetestowany na produkcji i failowal identycznym bledem ERR_DLOPEN_FAILED:
libvips-cpp.so - mimo serverExternalPackages: ["sharp"] w next.config.ts.
Redeploy bez cache NIE pomogl - to nie byl problem cache'u.

PRZYCZYNA: znany, potwierdzony bug w sharp 0.35.x uzywanym w Server Actions pod
Turbopackiem (domyslny bundler w Next.js 16, rowniez dla next build, nie tylko dev) na
Vercelu. Zgloszenie: github.com/lovell/sharp/issues/4567. Build przechodzi bez bledu,
funkcja failuje dopiero PRZY WYKONANIU.

NAPRAWA: downgrade sharp z ^0.35.4 do 0.34.5 (dokladnie ta wersja, ktorej i tak juz
uzywa wewnetrznie sam Next.js dla next/image - widac to w package-lock.json).
npm install sharp@0.34.5 --save-exact
Zero zmian w kodzie, dziala od razu po downgrade + rebuild.

## Kalkulator leasingu (pojazdy) - wzor
Klasyczna annuita z balonem: kapital = cena - wplata; PV = kapital - wykup/(1+r)^n;
rata = PV*r/(1-(1+r)^(-n)). APR = APR_MIN + score*(APR_MAX-APR_MIN), score ze srednich
wplata/okres/(wykup jesli hasWykup). Rata "od X zl" na kartach: calculateShowcaseRate()
(wariant B: wplata 20%, okres 60, wykup MAX).

## Stan prac

### Zrobione
- [x] Baza, klucze, klienty, typy TS, katalog marek/modeli, wyszukiwarka
- [x] Strona glowna, /ogloszenia z filtrami, strona pojedynczego ogloszenia, karuzela+lightbox
- [x] LeasingCalculator z wyborem finansowania, formularz kontaktowy + Resend
- [x] /o-nas, /leasing, /regulamin, /polityka (dwie ostatnie - szkic)
- [x] Panel admina, import z OtoMoto (niezawodny), synchronizacja Cron
- [x] Navbar: Ogloszenia + Pawilony w menu, Leasing w stopce, sticky
- [x] Formatowanie opisu (Markdown), dynamiczna rata "od X zl"
- [x] Cursor pointer wszedzie (kalkulatory, formularz, CALY panel admina)
- [x] Zgoda marketingowa (checkbox + baza, TODO: badge admin + Polityka)
- [x] **Naprawa bledu sharp/OtoMoto na Vercel** (rozdzielenie plikow, maxDuration,
  serverExternalPackages)
- [x] **Pawilony - pelna sekcja**: 5 realizacji, PawilonCalculator, naglowek strony,
  kafelek "Twoj wlasny projekt", design kart ze znaczkiem/ikonkami/plakietka ceny
- [x] **Hover efekty na kartach ogloszen** (zoom zdjecia + uniesienie karty) - /pawilony,
  /ogloszenia, strona glowna (Ogloszenie tygodnia + Najnowsze oferty)
- [x] **Testy regresyjne Playwright - kompletny setup + WSZYSTKIE testy przechodza**
  (72 testy, 67 aktywnych + 5 skip celowych, 0 failed). Szczegoly w sekcji nizej.
- [x] **Integracja zgody marketingowej z Resend** - automatyczny zapis kontaktow do segmentu, badge w panelu admina (30.08)
- [x] Wgrane na Vercel -> fidens.pl

### Do zrobienia (priorytety)

1. **PRZED PROMOWANIEM /pawilony:** uzupelnic zolte placeholdery (cena/opis/wyposazenie/
   zastosowania) dla 4 nowych realizacji (dom modulowy 40m2, pawilon biurowy 24m2,
   pawilon gastronomiczny 18m2, domek modulowy 42m2) ORAZ podmienic uszkodzone zdjecia
   dla dom-modulowy-40m2-10x4m (obecne pliki .jpg zwracaja blad "isn't a valid image")

2. **Dokonczenie zgody marketingowej** - badge w /admin/zapytania JUZ ZROBIONY (30.08),
   zostaje TYLKO sekcja w Polityce Prywatnosci. Zgoda jest POJEDYNCZA (nie double
   opt-in - swiadoma decyzja 01.09, patrz sekcja "Audyt bezpieczenstwa")

3. **Rozszerzenie kategorii pojazdow** - dostawcze, naczepy w vehicle_type

4. **Nowa architektura: Maszyny przemyslowe (Gantech), Import** - osobna sesja projektowa

5. **Regulamin i polityka prywatnosci** - dane spolki z o.o., konsultacja prawnicza

6. **SEO i optymalizacja** - next/image wszedzie (w tym dodanie loading="eager" dla
   zdjec karuzeli powyzej fold, zeby uciszyc ostrzezenie LCP w konsoli), kalibracja
   kalkulatora, favicon, meta tagi, FAQ/Blog (nieustalone)

7. **Docelowo: mailing/newsletter** do osob z marketing_consent=true przez Resend

8. **Playwright w konwencji "przed pushem"** - rozwazyc czy npx playwright test ma byc
   obowiazkowym krokiem przed kazdym push, czy uruchamiane osobno co jakis czas
   (trwa ok. 1-1.5 min, dluzej niz sam npm run build)

## Konwencje pracy
- Komendy w PowerShell z Out-File -Encoding utf8, test na localhost:3000 przed pushem
- git add . && git commit -m "opis" && git push -> Vercel auto-rebuild
- **PRZED KAZDYM PUSHEM:** npm run build lokalnie
- **PO POTWIERDZENIU ZE COS DZIALA LOKALNIE:** od razu zrobic git add+commit+push,
  ZANIM zacznie sie testowanie na produkcji - inaczej latwo przetestowac fidens.pl
  na starym kodzie i pomyslec ze naprawa nie zadziala (incydent 30.08: zmiany w
  kontakt/actions.ts i admin/zapytania/page.tsx dzialaly lokalnie ale nie byly
  wypchniete, testy na fidens.pl mylnie sugerowaly ze integracja z Resend nie dziala)
- **PRZED ZALOZENIEM CZEGOS O STANIE PROJEKTU:** sprawdzic w kodzie, nie zgadywac
- **Zmiany schematu bazy Supabase RECZNIE przez SQL Editor**, PO KAZDEJ takiej zmianie
  zaktualizowac lib/supabase/types.ts (inaczej blad "Type X is not assignable to type never")
- **Podmiana tekstu ($content.Replace) czesto zawodzi** przez niewidoczne roznice w bialych
  znakach - przejsc na metode po numerach linii, ZAWSZE wypisac fragment przed edycja,
  ZAWSZE zweryfikowac SZERSZY kontekst po edycji (latwo przypadkiem usunac/zostawic
  osierocona linie otwierajaca/zamykajaca np. {tablica.map(() => ( ... )) })
- **[regex]::Escape() + reczne "odwracanie" escapowania na calym $content jest NIEBEZPIECZNE**
  (incydent 30.08: probem uzycia -replace '\\(.)','$1' na calym pliku zamiast tylko na nowym
  fragmencie usunal pojedyncze backslashe WSZEDZIE w dokumencie, w tym w sciezkach
  C:\Users\pziol\fidens) - przy wiekszych podmianach zawsze pelny rewrite pliku metoda
  WriteAllText z heredoc, NIGDY regex operujacy na calej tresci pliku
- **Server Components NIE MOGA miec event handlerow** w JSX - czysty CSS/Tailwind zamiast
- **position: sticky dziala jako kontekst pozycjonowania** jak position:relative
- **cursor-pointer NIE jest domyslny na <button>** w tym projekcie - dopisywac explicite
- **Ciezkie/natywne zaleznosci (sharp) izolowac w osobnych plikach** od lekkich funkcji
- **Hover efekty na kartach - wzorzec ustalony:** className="group ... transition-all
  duration-300 hover:-translate-y-1 hover:shadow-lg" na linku/karcie, a na obrazku
  wewnatrz "transition-transform duration-500 group-hover:scale-110"

## Znane problemy/uwagi
- Hydration warning od Bitdefendera (bis_register, bis_skin_checked) - NIE jest bledem kodu
- PowerShell + polskie znaki: nie dziala we FLAGACH, ale tresc plikow (-Encoding utf8) OK
- Foldery z nawiasami ([slug], [id]): uzywac -LiteralPath wszedzie (zwykly Get-Content
  interpretuje [id] jako wzorzec wildcard i rzuca blad "parameter cannot be found")
- Dev serwer/build z bledami cache: taskkill /IM node.exe /F, Remove-Item -Recurse -Force .next,
  npm run dev, twardy refresh (Ctrl+Shift+R)
- Klasy Tailwinda w nawiasach kwadratowych czasem sypia sie w Next 16.2.4
- URL bez polskich znakow - ostroznie przy Ctrl+H w VS Code
- Stopka duplikowana per-strona (nie komponent) - do rozwazenia: wspolny Footer.tsx
- Niektore pliki mialy zepsute kodowanie UTF-8 (naprawione) - jesli znowu, nadpisac cala
  zawartosc na nowo, nie punktowe podmiany
- **Zdjecia dom-modulowy-40m2-10x4m uszkodzone** (blad "isn't a valid image" w konsoli) -
  do podmiany razem z uzupelnieniem realnych danych tej realizacji
- **INCYDENT 01.09:** przy recznej edycji .env.local w Notatniku (dodawanie
  SUPABASE_SERVICE_ROLE_KEY) przypadkiem nadpisano wartosc NEXT_PUBLIC_SUPABASE_ANON_KEY
  kluczem sb_secret_... zamiast sb_publishable_..., co spowodowalo blad w przegladarce
  "Forbidden use of secret API key in browser" przy zapisie ogloszenia w panelu admina.
  Naprawione poprawnym wklejeniem klucza publishable z Supabase (Settings -> API Keys).
  LEKCJA: przy edycji .env.local w Notatniku ZAWSZE sprawdzic KTORA linia sie edytuje
  (klucze sb_publishable_ i sb_secret_ latwo pomylic, oba dlugie i losowe) - dobra
  praktyka: uzyc Ctrl+F w Notatniku zeby najpierw namierzyc dokladna linie zamiast
  edytowac "na oko" po przewinieciu.

## Testy regresyjne (Playwright) - stan na dzisiaj (30.08)

### WSZYSTKIE TESTY PRZECHODZA
72 testy razem, 2 projekty (chromium-desktop + mobile-chrome): 67 aktywnych (passed),
5 skip celowych (testy oznaczone jako desktop-only lub mobile-only poprawnie pomijaja
sie na drugim projekcie), 0 failed.

### Setup (zrobiony)
- @playwright/test zainstalowany (npm install -D), przegladarki pobrane (npx playwright install)
- playwright.config.ts (w katalogu glownym) - testDir ./tests, projekty: chromium-desktop
  + mobile-chrome (Pixel 5), auto-start npm run dev jesli nie dziala
  (reuseExistingServer: true)
- .env.test (POZA GITEM) - ADMIN_EMAIL, ADMIN_PASSWORD, BASE_URL. Wczytywane w
  playwright.config.ts przez process.loadEnvFile(".env.test")
- tests/helpers.ts - funkcja loginAsAdmin() do wielokrotnego uzytku

### Pliki testowe (10 plikow, pokrycie calej strony modul po module)
navbar.spec.ts, homepage.spec.ts, ogloszenia-list.spec.ts, ogloszenie-detail.spec.ts,
kontakt.spec.ts, admin-login.spec.ts, admin-crud.spec.ts, pawilony.spec.ts, static-pages.spec.ts

### Uruchamianie
npx playwright test  (jedna komenda, odpala wszystko na desktop + mobile, generuje raport
HTML na localhost:9323, trwa ok. 1-1.5 min)

### WAZNE decyzje dot. danych testowych (ustalone z klientem)
- Test admin-crud.spec.ts tworzy testowe ogloszenie ("PLAYWRIGHT TEST ...") i SAM je kasuje
  w tym samym tescie
- Test kontakt.spec.ts faktycznie WYSYLA formularz -> PRAWDZIWY MAIL przez Resend za kazdym
  uruchomieniem (klient zaakceptowal to swiadomie) + loguje sie do admina i kasuje testowe
  zapytanie z /admin/zapytania po tescie (samo wyslanie maila nie da sie cofnac, ale wpis
  w bazie contact_requests jest sprzatany)

### Pierwsze uruchomienie (29.08) - wynik: 45 passed / 27 failed
Wiekszosc porazek (24 z 27) to bledy W SAMYCH TESTACH, nie na stronie - selektory
lapiace 2 elementy naraz, brak rozdzielenia desktop/mobile, wyszukiwarka na mobile
ukryta pod lupa. Szczegoly napraw ponizej.

### ZNALEZIONY REALNY BUG (nie blad testu!) - NAPRAWIONY (29.08)
Wyszukiwarka w Navbarze byla wycentrowana przez position:absolute (left-1/2 -translate-x-1/2),
co IGNOROWALO ile miejsca zajmuje menu obok. Po dodaniu "Pawilony" do menu, przy typowej
szerokosci ekranu laptopa (~1280px) wyszukiwarka FIZYCZNIE NACHODZILA na linki "Ogloszenia"
i "Pawilony" - realny problem UX, ktory playwright wylapal jako "element intercepts pointer
events" przy probie kliknieca. NAPRAWIONE: zamieniono absolute positioning na flex layout
(search w div z flex-1 + wrapper max-w-md).

### Sesja naprawcza selektorow (30.08) - wynik koncowy: 0 failed
**navbar.spec.ts:**
- Scope do page.locator("nav").first() we wszystkich testach desktopowych - omija
  duplikat linku "Poznaj Fidens" w stopce strony glownej
- test.skip(testInfo.project.name !== "chromium-desktop"/"mobile-chrome", ...) na
  testach oznaczonych jako desktop-/mobile-only
- Test menu mobilnego scope'owany przez getByRole("dialog", { name: "Menu" }) - drawer
  ma jawnie role="dialog" + aria-label="Menu", jednoznacznie odroznia linki w drawerze
  od reszty strony

**ogloszenie-detail.spec.ts i pawilony.spec.ts:**
- Breadcrumb "Ogloszenia"/"Pawilony" na stronach szczegolowych duplikowal identyczny
  link w Navbarze -> scope przez page.locator("div.text-sm", { hasText: "Strona glowna" })
- pawilony.spec.ts: getByText("24")/("72") bez exact:true ryzykownie dopasowywal
  podciagi wiekszych liczb (np. "2400") -> dodano { exact: true }

**ogloszenia-list.spec.ts:**
- Pole wyszukiwania na mobile nie istnieje w DOM dopoki nie klikniesz ikony lupy
  (aria-label="Wyszukiwarka") -> dodano warunkowy klik dla testInfo.project.name
  === "mobile-chrome"
- Po otwarciu w DOM sa DWA inputy z tym samym placeholderem (desktopowy ukryty przez
  hidden lg:flex, ale nadal obecny w drzewie) -> selektor zawezony przez
  input[placeholder="..."]:visible

**admin-login.spec.ts + admin-crud.spec.ts + kontakt.spec.ts (12 falszywych bledow
na raz) - REALNY BUG W DANYCH TESTOWYCH, nie w kodzie:**
.env.test mial bledny ADMIN_EMAIL (literowka "twoj-" sklejona z prawdziwym adresem
z szablonu przy tworzeniu pliku, np. "twoj-imie.nazwisko@gmail.com" zamiast czystego
adresu) - Supabase Auth odrzucal login, strona logowania pokazywala "Nieprawidlowy
email lub haslo", loginAsAdmin() w helpers.ts wpadal w timeout na waitForURL.
Dotyczylo to WSZYSTKICH testow zaleznych od loginAsAdmin (bo kontakt.spec.ts tez
loguje sie do admina, zeby posprzatac testowe zapytanie). Naprawione recznym
poprawieniem maila w VS Code, zweryfikowano brak BOM po zapisie (odczyt pierwszych
3 bajtow pliku).

**admin-crud.spec.ts - dodatkowe poprawki po naprawie logowania:**
- Test nie wypelnial wymaganego pola "Cena (PLN) *" (atrybut required w formularzu) ->
  natywna walidacja HTML5 blokowala wyslanie formularza, submit nigdy sie nie odpalal ->
  dodano fillByLabel("Cena", "150000")
- Klik w tytul ogloszenia na liscie nie dzialal (tytul to zwykly tekst w <td>, nie link;
  link do edycji to osobna kolumna "Edytuj") -> zamieniono na klik w
  row.getByRole("link", { name: "Edytuj" }) gdzie row = page.locator("tr", { hasText })
- Przycisk potwierdzenia usuniecia w ConfirmDialog.tsx ma tekst dokladnie "Usun"
  (confirmLabel domyslny), NIE "Usun ogloszenie" jak przycisk wyzwalajacy. ConfirmDialog
  renderuje sie w JSX PRZED przyciskiem wyzwalajacym, wiec w DOM .last() z regexem
  /usun|potwierdz|tak/i lapal z powrotem przycisk pod nakladka (overlay intercepts
  pointer events) -> zamieniono na getByRole("button", { name: "Usun", exact: true })

### Do zrobienia (kolejna sesja)
- Uzupelnic realne zdjecia dla dom-modulowy-40m2-10x4m (obecne pliki .jpg sa
  uszkodzone/puste - blad "isn't a valid image" w konsoli podczas testow, i tak
  trzeba to zrobic przed promowaniem /pawilony)
- Rozwazyc dodanie npx playwright test jako krok w konwencji "przed pushem"
  (albo uruchamiac osobno, co jakis czas - nie kazdorazowo, bo trwa ok. 1-1.5 min)
