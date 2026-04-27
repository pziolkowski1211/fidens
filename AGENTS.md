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
- **Lokalne:** `C:\Users\pziol\fidens`
- **Edytor:** VS Code
- **Terminal:** PowerShell
- **Hostname dev (mobile testy):** `npx next dev -H 0.0.0.0`

## Klucze i sekrety
Plik `.env.local` (NIE w gitu) zawiera:
- `NEXT_PUBLIC_SUPABASE_URL` - https://mglgfsaimktblkzjkmfg.supabase.co
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - sb_publishable_LgsGRj9uVhBigrIXMPY5Rw_89VdFLlN

Te same klucze sa dodane na Vercel (Environment Variables -> Production/Preview/Development).

## Identyfikacja wizualna
- **Granat (primary):** `#1B2A4A`
- **Pomaranczowy (accent):** `#F0A500`
- **Tlo jasne:** `#f8f9fb`
- **Bordery:** `#e8eaed`
- **Logo jasne (na ciemne tlo):** `public/jasne.png` (1536x1024 px, transparent)
- **Logo ciemne (na jasne tlo):** `public/ciemne.png` (1536x1024 px, transparent)

## Struktura folderow
@'
# AGENTS.md - Instrukcje dla AI asystenta

## Profil uzytkownika
**Wazne:** Uzytkownik (Pawel) jest **laikiem technicznym**.
- Nie pisze kodu samodzielnie - tylko wkleja komendy do terminala
- Nie zna React, TypeScript, Git poza podstawami
- Trzeba **tlumaczyc prosto**, krok po kroku, jak komus z zewnatrz

## Jak pracujemy
1. **Tylko komendy w terminalu** - PowerShell w VS Code
2. Pliki tworzone komendami `@''...''@ | Out-File -FilePath "sciezka" -Encoding utf8`
3. **Jeden krok na raz** - nie wrzucaj 10 komend naraz
4. Po kazdej komendzie czekasz na potwierdzenie ("zrobione" / screenshot)
5. **Testy:** localhost:3000 (desktop) + DevTools mobile + ewentualnie real device przez `-H 0.0.0.0`
6. **Wgranie:** dopiero gdy lokalnie dziala -> `git add . && git commit -m "..." && git push`

## Konwencje kodu
- Next.js 16 App Router (Server Components by default, "use client" tylko gdy trzeba)
- Tailwind v4 (uzywaj klas, ale dla kolorow brand wlasciwosci `style={{}}`)
- Wszystkie nowe komponenty w `app/components/` lub jako route w `app/<sciezka>/page.tsx`
- Logika nie-React (helpery, klienty Supabase) w `lib/`

## Kolory brand
- Granat: `#1B2A4A`
- Pomaranczowy: `#F0A500`
- Tlo jasne: `#f8f9fb`
- Bordery: `#e8eaed`

## Czego unikac
- **NIE rob** wielkich zmian bez pokazania planu
- **NIE zakladaj** czegos co moge sprawdzic - pytaj zanim zrobisz
- **NIE dawaj** komend ktore moga skasowac dane bez potwierdzenia
- **NIE pisz** "stworz plik X w VS Code" - uzyj terminala
- **NIE uzywaj** polskich znakow w komendach PowerShell (encoding utf8 czasem psuje)
- **NIE uzywaj** `regex replace` na duzych plikach - lepiej nadpisz caly plik

## Czego trzymac sie
- Zaczynaj nowy etap od krotkiego planu (co robimy, jak)
- Po wprowadzeniu zmiany zawsze: "wykonaj X i wyslij screenshot/napisz Y"
- Jak cos nie dziala - poproś o screenshot ZANIM zaczniesz zgadywac
- Jak uzytkownik wskaze blad - od razu **przyznaj sie i napraw**, bez wykretow
- Pamietaj o **kontekscie z PROJEKT.md** - przeczytaj go na poczatku kazdej nowej sesji

## Brief startowy dla nowej sesji
Gdy zaczyna sie nowa sesja, AI powinien:
1. Przeczytac PROJEKT.md (ma pelny kontekst projektu)
2. Przeczytac AGENTS.md (ma instrukcje jak pracowac z uzytkownikiem)
3. Powiedziec "ok, zapoznalem sie - jestem gotowy" i zapytac od czego zaczynamy
