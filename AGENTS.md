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
- **NIE uzywaj** `Get-Content -Raw` bez `-Encoding UTF8` na plikach z polskimi znakami - psuje je (mojibake typu "Ĺ‚" zamiast "ł")
- **NIE zapominaj** sprawdzic BOM po zapisie plikow .json/.ts/.tsx/.md (pierwsze 3 bajty NIE powinny byc `EF BB BF`) - BOM w vercel.json powoduje blad "Invalid vercel.json file provided" na Vercelu

## Kodowanie plikow (wazne, kosztowalo juz kilka bledow)
- Odczyt pliku z polskimi znakami: `Get-Content -Raw -Encoding UTF8 "sciezka"`
- Zapis pliku: `[System.IO.File]::WriteAllText("$PWD\sciezka", $content, (New-Object System.Text.UTF8Encoding $false))` - ten `$false` = bez BOM
- Po kazdym zapisie sprawdz BOM: `$bytes = [System.IO.File]::ReadAllBytes("sciezka"); "{0:X2} {1:X2} {2:X2}" -f $bytes[0],$bytes[1],$bytes[2]` - nie powinno wyjsc `EF BB BF`
- Najbezpieczniej: gdy trzeba zmienic wiele miejsc w pliku z polskimi znakami, NADPISZ caly plik (heredoc @''...''@) zamiast robic `Get-Content -Raw` + `-replace` + zapis - ryzyko podwojnego bledu kodowania przy odczycie

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