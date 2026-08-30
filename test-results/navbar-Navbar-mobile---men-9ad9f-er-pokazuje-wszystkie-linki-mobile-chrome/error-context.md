# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navbar.spec.ts >> Navbar >> mobile - menu hamburger pokazuje wszystkie linki
- Location: tests\navbar.spec.ts:39:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('link', { name: 'Poznaj Fidens', exact: true })
Expected: visible
Error: strict mode violation: getByRole('link', { name: 'Poznaj Fidens', exact: true }) resolved to 2 elements:
    1) <a href="/o-nas" class="text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-4 py-3 text-base transition-colors">Poznaj Fidens</a> aka getByRole('dialog').getByRole('link', { name: 'Poznaj Fidens' })
    2) <a href="/o-nas" class="text-[13px]">Poznaj Fidens</a> aka locator('footer').getByRole('link', { name: 'Poznaj Fidens' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('link', { name: 'Poznaj Fidens', exact: true })

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - main [ref=e2]:
    - navigation [ref=e3]:
      - link [ref=e4] [cursor=pointer]:
        - /url: /
        - img "Fidens" [ref=e5]
      - generic [ref=e6]:
        - button "Wyszukiwarka" [ref=e7]
        - button "Menu" [active] [ref=e10]
    - dialog "Menu" [ref=e14]:
      - generic [ref=e15]:
        - generic [ref=e16]: Menu
        - button "Zamknij menu" [ref=e17]
      - navigation [ref=e20]:
        - link "Strona główna" [ref=e21] [cursor=pointer]:
          - /url: /
        - link "Ogłoszenia" [ref=e22] [cursor=pointer]:
          - /url: /ogloszenia
        - link "Pawilony" [ref=e23] [cursor=pointer]:
          - /url: /pawilony
        - link "Poznaj Fidens" [ref=e24] [cursor=pointer]:
          - /url: /o-nas
        - link "Kontakt" [ref=e25] [cursor=pointer]:
          - /url: /kontakt
      - link "Zamów bezpłatną kalkulację" [ref=e27] [cursor=pointer]:
        - /url: /kontakt
    - generic [ref=e28]:
      - heading "Finansowanie pojazdów i maszyn budowlanych" [level=1] [ref=e29]
      - paragraph [ref=e30]: Leasing, kredyt, wynajem — szybka decyzja kredytowa. Ty wybierasz pojazd, my zajmujemy się resztą.
    - generic [ref=e32]:
      - generic [ref=e33]:
        - heading "Ogłoszenie tygodnia" [level=2] [ref=e34]
        - generic [ref=e35]: Wyróżnione
      - link "BMW 5 Series 530d xDrive Ogłoszenie tygodnia BMW 5 Series 530d xDrive 2022 · 68 000 km · Diesel · Automatyczna od 2212 zł /miesiąc netto Sprawdź ofertę →" [ref=e36] [cursor=pointer]:
        - /url: /ogloszenia/bmw-5-series-530d-xdrive-2022
        - img "BMW 5 Series 530d xDrive" [ref=e38]
        - generic [ref=e39]:
          - generic [ref=e40]: Ogłoszenie tygodnia
          - heading "BMW 5 Series 530d xDrive" [level=3] [ref=e41]
          - paragraph [ref=e42]: 2022 · 68 000 km · Diesel · Automatyczna
          - generic [ref=e43]:
            - text: od 2212 zł
            - generic [ref=e44]: /miesiąc netto
          - generic [ref=e45]: Sprawdź ofertę →
    - generic [ref=e47]:
      - generic [ref=e48]:
        - heading "Najnowsze oferty" [level=2] [ref=e49]
        - link "Zobacz wszystkie →" [ref=e50] [cursor=pointer]:
          - /url: /ogloszenia
      - generic [ref=e51]:
        - link "Volvo XC 90 B5 D AWD Geartronic Inscription Volvo XC 90 B5 D AWD Geartronic Inscription 2020 75 892 km od 1416 zł /msc netto" [ref=e52] [cursor=pointer]:
          - /url: /ogloszenia/volvo-xc-90-b5-d-awd-geartronic-inscription
          - img "Volvo XC 90 B5 D AWD Geartronic Inscription" [ref=e54]
          - generic [ref=e55]:
            - generic [ref=e56]: Volvo XC 90 B5 D AWD Geartronic Inscription
            - generic [ref=e57]:
              - generic [ref=e58]: "2020"
              - generic [ref=e62]: 75 892 km
            - generic [ref=e66]:
              - text: od 1416 zł
              - generic [ref=e67]: /msc netto
        - link "Volkswagen Arteon 2.0 TSI R-Line DSG Volkswagen Arteon 2.0 TSI R-Line DSG 2019 124 977 km od 972 zł /msc" [ref=e68] [cursor=pointer]:
          - /url: /ogloszenia/volkswagen-arteon-2-0-tsi-r-line-dsg
          - img "Volkswagen Arteon 2.0 TSI R-Line DSG" [ref=e70]
          - generic [ref=e71]:
            - generic [ref=e72]: Volkswagen Arteon 2.0 TSI R-Line DSG
            - generic [ref=e73]:
              - generic [ref=e74]: "2019"
              - generic [ref=e78]: 124 977 km
            - generic [ref=e82]: od 972 zł /msc
        - link "Porsche Panamera Turbo E-Hybrid PHEV Porsche Panamera Turbo E-Hybrid PHEV 2025 10 km od 8537 zł /msc netto" [ref=e83] [cursor=pointer]:
          - /url: /ogloszenia/porsche-panamera-turbo-e-hybrid-phev
          - img "Porsche Panamera Turbo E-Hybrid PHEV" [ref=e85]
          - generic [ref=e86]:
            - generic [ref=e87]: Porsche Panamera Turbo E-Hybrid PHEV
            - generic [ref=e88]:
              - generic [ref=e89]: "2025"
              - generic [ref=e93]: 10 km
            - generic [ref=e97]:
              - text: od 8537 zł
              - generic [ref=e98]: /msc netto
    - generic [ref=e100]:
      - heading "Jak to działa?" [level=2] [ref=e101]
      - generic [ref=e102]:
        - generic [ref=e103]:
          - generic [ref=e104]: "1"
          - generic [ref=e105]: Złóż zapytanie online
        - generic [ref=e106]:
          - generic [ref=e107]: "2"
          - generic [ref=e108]: Decyzja w 60 minut
        - generic [ref=e109]:
          - generic [ref=e110]: "3"
          - generic [ref=e111]: Podpisz umowę
        - generic [ref=e112]:
          - generic [ref=e113]: "4"
          - generic [ref=e114]: Wpłać opłatę wstępną
        - generic [ref=e115]:
          - generic [ref=e116]: "5"
          - generic [ref=e117]: Rejestrujemy i ubezpieczamy
        - generic [ref=e118]:
          - generic [ref=e119]: "6"
          - generic [ref=e120]: Pojazd gotowy do drogi
    - generic [ref=e122]:
      - heading "Opinie klientów" [level=2] [ref=e123]
      - generic [ref=e124]:
        - generic [ref=e125]:
          - generic [ref=e126]: ★★★★★
          - paragraph [ref=e127]: "\"Ekspresowa decyzja, zero stresu. Polecam każdemu przedsiębiorcy.\""
          - generic [ref=e128]: Marek K., Warszawa
        - generic [ref=e129]:
          - generic [ref=e130]: ★★★★★
          - paragraph [ref=e131]: "\"Wszystko załatwione w jeden dzień. Auto stało pod domem następnego dnia.\""
          - generic [ref=e132]: Tomasz W., Kraków
        - generic [ref=e133]:
          - generic [ref=e134]: ★★★★★
          - paragraph [ref=e135]: "\"Profesjonalne podejście, najlepsza oferta leasingu jaką znalazłem.\""
          - generic [ref=e136]: Anna P., Wrocław
    - generic [ref=e138]:
      - generic [ref=e139]: FIDENS
      - generic [ref=e140]:
        - link "Poznaj Fidens" [ref=e141] [cursor=pointer]:
          - /url: /o-nas
        - link "Leasing" [ref=e142] [cursor=pointer]:
          - /url: /leasing
        - link "Kontakt" [ref=e143] [cursor=pointer]:
          - /url: /kontakt
        - link "Regulamin" [ref=e144] [cursor=pointer]:
          - /url: /regulamin
        - link "Polityka prywatności" [ref=e145] [cursor=pointer]:
          - /url: /polityka
      - generic [ref=e146]: (c) 2026 Fidens. Wszelkie prawa zastrzeżone.
  - button "Open Next.js Dev Tools" [ref=e152] [cursor=pointer]
  - alert [ref=e156]
```

# Test source

```ts
  1  | ﻿import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Navbar", () => {
  4  |   test("desktop - widoczne wszystkie linki i CTA", async ({ page }) => {
  5  |     await page.goto("/");
  6  |     await expect(page.getByRole("link", { name: "Ogłoszenia", exact: true })).toBeVisible();
  7  |     await expect(page.getByRole("link", { name: "Pawilony", exact: true })).toBeVisible();
  8  |     await expect(page.getByRole("link", { name: "Poznaj Fidens", exact: true })).toBeVisible();
  9  |     await expect(page.getByRole("link", { name: "Kontakt", exact: true }).first()).toBeVisible();
  10 |     await expect(page.getByRole("link", { name: "Zamów bezpłatną kalkulację" })).toBeVisible();
  11 |   });
  12 | 
  13 |   test("desktop - kliknięcie w Ogłoszenia przenosi do /ogloszenia", async ({ page }) => {
  14 |     await page.goto("/");
  15 |     await page.getByRole("link", { name: "Ogłoszenia", exact: true }).click();
  16 |     await expect(page).toHaveURL(/\/ogloszenia/);
  17 |   });
  18 | 
  19 |   test("desktop - kliknięcie w Pawilony przenosi do /pawilony", async ({ page }) => {
  20 |     await page.goto("/");
  21 |     await page.getByRole("link", { name: "Pawilony", exact: true }).click();
  22 |     await expect(page).toHaveURL(/\/pawilony/);
  23 |   });
  24 | 
  25 |   test("desktop - logo przenosi na stronę główną", async ({ page }) => {
  26 |     await page.goto("/ogloszenia");
  27 |     await page.getByRole("link").filter({ has: page.locator("img[alt*='FIDENS' i], img[alt*='Fidens' i]") }).first().click();
  28 |     await expect(page).toHaveURL("/");
  29 |   });
  30 | 
  31 |   test("navbar zostaje przyklejony po scrollowaniu", async ({ page }) => {
  32 |     await page.goto("/ogloszenia");
  33 |     const navbar = page.locator("nav").first();
  34 |     await expect(navbar).toBeVisible();
  35 |     await page.mouse.wheel(0, 1500);
  36 |     await expect(navbar).toBeInViewport();
  37 |   });
  38 | 
  39 |   test("mobile - menu hamburger pokazuje wszystkie linki", async ({ page }) => {
  40 |     await page.goto("/");
  41 |     await page.getByRole("button", { name: /menu/i }).click();
  42 |     await expect(page.getByRole("link", { name: "Strona główna", exact: true })).toBeVisible();
  43 |     await expect(page.getByRole("link", { name: "Ogłoszenia", exact: true })).toBeVisible();
  44 |     await expect(page.getByRole("link", { name: "Pawilony", exact: true })).toBeVisible();
> 45 |     await expect(page.getByRole("link", { name: "Poznaj Fidens", exact: true })).toBeVisible();
     |                                                                                  ^ Error: expect(locator).toBeVisible() failed
  46 |     await expect(page.getByRole("link", { name: "Kontakt", exact: true })).toBeVisible();
  47 |   });
  48 | });
  49 | 
```