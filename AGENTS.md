# AGENTS.md - Instrukcje dla AI asystenta

## Profil uzytkownika
**Wazne:** Uzytkownik (Piotr) jest **laikiem technicznym**.
- Nie pisze kodu samodzielnie - tylko wkleja komendy do terminala
- Nie zna React, TypeScript, Git poza podstawami
- Trzeba **tlumaczyc prosto**, krok po kroku, jak komus z zewnatrz
- Komunikacja w jezyku **polskim**

## Jak pracujemy
1. **Tylko komendy w terminalu** - PowerShell w VS Code
2. Pliki tworzone komendami `@''...''@ | Out-File -FilePath "sciezka" -Encoding utf8`
3. **Jeden krok na raz** - nie wrzucaj 10 komend naraz
4. Po kazdej komendzie czekamy na potwierdzenie ("zrobione" / screenshot)
5. **Testy:** localhost:3000 (desktop) + DevTools mobile
6. **Wgranie:** dopiero gdy lokalnie dziala -> `git add .` + `git commit -m "..."` + `git push`
7. Przed pisaniem kodu zawsze powiedz **co zamierzasz zrobic** i poczekaj na potwierdzenie

## Konwencje kodu
- Next.js 16 App Router (Server Components by default, "use client" tylko gdy trzeba)
- Tailwind v4 (uzywaj klas, ale dla kolorow brand wlasciwosci `style={{}}`)
- Wszystkie nowe komponenty w `app/components/`
- Logika nie-React (helpery, klienty Supabase) w `lib/`

## Kolory brand
- Granat: `#1B2A4A`
- Zloto: `#F0A500`
- Tlo jasne: `#f8f9fb`
- Bordery: `#e8eaed`

## Czego unikac
- **NIE rob** wielkich zmian bez pokazania planu
- **NIE zakladaj** czegos co mozna sprawdzic - pytaj zanim zrobisz
- **NIE dawaj** komend ktore moga skasowac dane bez potwierdzenia
- **NIE pisz** "stworz plik X w VS Code" - uzyj terminala
- **NIE uzywaj** polskich znakow w komendach PowerShell
- **NIE uzywaj** `regex replace` na duzych plikach - lepiej nadpisz caly plik
- **NIE uzywaj** `Get-Content -Raw` bez `-Encoding UTF8`
- **NIE zapominaj** sprawdzic BOM po zapisie plikow

## Kodowanie plikow
- Odczyt: `Get-Content -Raw -Encoding UTF8 "sciezka"`
- Zapis bez BOM: `[System.IO.File]::WriteAllText("$PWD\sciezka", $content, (New-Object System.Text.UTF8Encoding $false))`
- Sprawdzenie BOM: `$bytes = [System.IO.File]::ReadAllBytes("sciezka"); "{0:X2} {1:X2} {2:X2}" -f $bytes[0],$bytes[1],$bytes[2]`

## Czego trzymac sie
- Zaczynaj nowy etap od krotkiego planu
- Po wprowadzeniu zmiany zawsze: "sprawdz na localhost i wyslij screenshot"
- Jak cos nie dziala - poproś o screenshot ZANIM zaczniesz zgadywac
- Jak uzytkownik wskaze blad - napraw
- Zawsze czytaj PROJEKT.md i AGENTS.md na poczatku sesji

## Brief startowy dla nowej sesji
1. Przeczytaj PROJEKT.md
2. Przeczytaj AGENTS.md
3. Powiedz "zapoznalem sie z projektem Fidens - jestem gotowy" i zapytaj od czego zaczynamy