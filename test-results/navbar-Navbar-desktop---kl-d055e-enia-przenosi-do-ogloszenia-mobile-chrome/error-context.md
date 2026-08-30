# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navbar.spec.ts >> Navbar >> desktop - kliknięcie w Ogłoszenia przenosi do /ogloszenia
- Location: tests\navbar.spec.ts:13:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: 'Ogłoszenia', exact: true })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - navigation [ref=e3]:
      - link [ref=e4] [cursor=pointer]:
        - /url: /
        - img "Fidens" [ref=e5]
      - generic [ref=e6]:
        - button "Wyszukiwarka" [ref=e7]
        - button "Menu" [ref=e10]
    - generic [ref=e13]:
      - heading "Finansowanie pojazdów i maszyn budowlanych" [level=1] [ref=e14]
      - paragraph [ref=e15]: Leasing, kredyt, wynajem — szybka decyzja kredytowa. Ty wybierasz pojazd, my zajmujemy się resztą.
    - generic [ref=e17]:
      - generic [ref=e18]:
        - heading "Ogłoszenie tygodnia" [level=2] [ref=e19]
        - generic [ref=e20]: Wyróżnione
      - link "BMW 5 Series 530d xDrive Ogłoszenie tygodnia BMW 5 Series 530d xDrive 2022 · 68 000 km · Diesel · Automatyczna od 2212 zł /miesiąc netto Sprawdź ofertę →" [ref=e21] [cursor=pointer]:
        - /url: /ogloszenia/bmw-5-series-530d-xdrive-2022
        - img "BMW 5 Series 530d xDrive" [ref=e23]
        - generic [ref=e24]:
          - generic [ref=e25]: Ogłoszenie tygodnia
          - heading "BMW 5 Series 530d xDrive" [level=3] [ref=e26]
          - paragraph [ref=e27]: 2022 · 68 000 km · Diesel · Automatyczna
          - generic [ref=e28]:
            - text: od 2212 zł
            - generic [ref=e29]: /miesiąc netto
          - generic [ref=e30]: Sprawdź ofertę →
    - generic [ref=e32]:
      - generic [ref=e33]:
        - heading "Najnowsze oferty" [level=2] [ref=e34]
        - link "Zobacz wszystkie →" [ref=e35] [cursor=pointer]:
          - /url: /ogloszenia
      - generic [ref=e36]:
        - link "Volvo XC 90 B5 D AWD Geartronic Inscription Volvo XC 90 B5 D AWD Geartronic Inscription 2020 75 892 km od 1416 zł /msc netto" [ref=e37] [cursor=pointer]:
          - /url: /ogloszenia/volvo-xc-90-b5-d-awd-geartronic-inscription
          - img "Volvo XC 90 B5 D AWD Geartronic Inscription" [ref=e39]
          - generic [ref=e40]:
            - generic [ref=e41]: Volvo XC 90 B5 D AWD Geartronic Inscription
            - generic [ref=e42]:
              - generic [ref=e43]: "2020"
              - generic [ref=e47]: 75 892 km
            - generic [ref=e51]:
              - text: od 1416 zł
              - generic [ref=e52]: /msc netto
        - link "Volkswagen Arteon 2.0 TSI R-Line DSG Volkswagen Arteon 2.0 TSI R-Line DSG 2019 124 977 km od 972 zł /msc" [ref=e53] [cursor=pointer]:
          - /url: /ogloszenia/volkswagen-arteon-2-0-tsi-r-line-dsg
          - img "Volkswagen Arteon 2.0 TSI R-Line DSG" [ref=e55]
          - generic [ref=e56]:
            - generic [ref=e57]: Volkswagen Arteon 2.0 TSI R-Line DSG
            - generic [ref=e58]:
              - generic [ref=e59]: "2019"
              - generic [ref=e63]: 124 977 km
            - generic [ref=e67]: od 972 zł /msc
        - link "Porsche Panamera Turbo E-Hybrid PHEV Porsche Panamera Turbo E-Hybrid PHEV 2025 10 km od 8537 zł /msc netto" [ref=e68] [cursor=pointer]:
          - /url: /ogloszenia/porsche-panamera-turbo-e-hybrid-phev
          - img "Porsche Panamera Turbo E-Hybrid PHEV" [ref=e70]
          - generic [ref=e71]:
            - generic [ref=e72]: Porsche Panamera Turbo E-Hybrid PHEV
            - generic [ref=e73]:
              - generic [ref=e74]: "2025"
              - generic [ref=e78]: 10 km
            - generic [ref=e82]:
              - text: od 8537 zł
              - generic [ref=e83]: /msc netto
    - generic [ref=e85]:
      - heading "Jak to działa?" [level=2] [ref=e86]
      - generic [ref=e87]:
        - generic [ref=e88]:
          - generic [ref=e89]: "1"
          - generic [ref=e90]: Złóż zapytanie online
        - generic [ref=e91]:
          - generic [ref=e92]: "2"
          - generic [ref=e93]: Decyzja w 60 minut
        - generic [ref=e94]:
          - generic [ref=e95]: "3"
          - generic [ref=e96]: Podpisz umowę
        - generic [ref=e97]:
          - generic [ref=e98]: "4"
          - generic [ref=e99]: Wpłać opłatę wstępną
        - generic [ref=e100]:
          - generic [ref=e101]: "5"
          - generic [ref=e102]: Rejestrujemy i ubezpieczamy
        - generic [ref=e103]:
          - generic [ref=e104]: "6"
          - generic [ref=e105]: Pojazd gotowy do drogi
    - generic [ref=e107]:
      - heading "Opinie klientów" [level=2] [ref=e108]
      - generic [ref=e109]:
        - generic [ref=e110]:
          - generic [ref=e111]: ★★★★★
          - paragraph [ref=e112]: "\"Ekspresowa decyzja, zero stresu. Polecam każdemu przedsiębiorcy.\""
          - generic [ref=e113]: Marek K., Warszawa
        - generic [ref=e114]:
          - generic [ref=e115]: ★★★★★
          - paragraph [ref=e116]: "\"Wszystko załatwione w jeden dzień. Auto stało pod domem następnego dnia.\""
          - generic [ref=e117]: Tomasz W., Kraków
        - generic [ref=e118]:
          - generic [ref=e119]: ★★★★★
          - paragraph [ref=e120]: "\"Profesjonalne podejście, najlepsza oferta leasingu jaką znalazłem.\""
          - generic [ref=e121]: Anna P., Wrocław
    - generic [ref=e123]:
      - generic [ref=e124]: FIDENS
      - generic [ref=e125]:
        - link "Poznaj Fidens" [ref=e126] [cursor=pointer]:
          - /url: /o-nas
        - link "Leasing" [ref=e127] [cursor=pointer]:
          - /url: /leasing
        - link "Kontakt" [ref=e128] [cursor=pointer]:
          - /url: /kontakt
        - link "Regulamin" [ref=e129] [cursor=pointer]:
          - /url: /regulamin
        - link "Polityka prywatności" [ref=e130] [cursor=pointer]:
          - /url: /polityka
      - generic [ref=e131]: (c) 2026 Fidens. Wszelkie prawa zastrzeżone.
  - button "Open Next.js Dev Tools" [ref=e137] [cursor=pointer]
  - alert [ref=e141]
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
> 15 |     await page.getByRole("link", { name: "Ogłoszenia", exact: true }).click();
     |                                                                       ^ Error: locator.click: Test timeout of 30000ms exceeded.
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
  45 |     await expect(page.getByRole("link", { name: "Poznaj Fidens", exact: true })).toBeVisible();
  46 |     await expect(page.getByRole("link", { name: "Kontakt", exact: true })).toBeVisible();
  47 |   });
  48 | });
  49 | 
```