# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navbar.spec.ts >> Navbar >> desktop - widoczne wszystkie linki i CTA
- Location: tests\navbar.spec.ts:4:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('link', { name: 'Ogłoszenia', exact: true })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('link', { name: 'Ogłoszenia', exact: true })

```

```yaml
- main:
  - navigation:
    - link "Fidens":
      - /url: /
      - img "Fidens"
    - button "Wyszukiwarka":
      - img
    - button "Menu":
      - img
  - heading "Finansowanie pojazdów i maszyn budowlanych" [level=1]
  - paragraph: Leasing, kredyt, wynajem — szybka decyzja kredytowa. Ty wybierasz pojazd, my zajmujemy się resztą.
  - heading "Ogłoszenie tygodnia" [level=2]
  - text: Wyróżnione
  - link "BMW 5 Series 530d xDrive Ogłoszenie tygodnia BMW 5 Series 530d xDrive 2022 · 68 000 km · Diesel · Automatyczna od 2212 zł /miesiąc netto Sprawdź ofertę →":
    - /url: /ogloszenia/bmw-5-series-530d-xdrive-2022
    - img "BMW 5 Series 530d xDrive"
    - text: Ogłoszenie tygodnia
    - heading "BMW 5 Series 530d xDrive" [level=3]
    - paragraph: 2022 · 68 000 km · Diesel · Automatyczna
    - text: od 2212 zł /miesiąc netto Sprawdź ofertę →
  - heading "Najnowsze oferty" [level=2]
  - link "Zobacz wszystkie →":
    - /url: /ogloszenia
  - link "Volvo XC 90 B5 D AWD Geartronic Inscription Volvo XC 90 B5 D AWD Geartronic Inscription 2020 75 892 km od 1416 zł /msc netto":
    - /url: /ogloszenia/volvo-xc-90-b5-d-awd-geartronic-inscription
    - img "Volvo XC 90 B5 D AWD Geartronic Inscription"
    - text: Volvo XC 90 B5 D AWD Geartronic Inscription
    - img
    - text: "2020"
    - img
    - text: 75 892 km od 1416 zł /msc netto
  - link "Volkswagen Arteon 2.0 TSI R-Line DSG Volkswagen Arteon 2.0 TSI R-Line DSG 2019 124 977 km od 972 zł /msc":
    - /url: /ogloszenia/volkswagen-arteon-2-0-tsi-r-line-dsg
    - img "Volkswagen Arteon 2.0 TSI R-Line DSG"
    - text: Volkswagen Arteon 2.0 TSI R-Line DSG
    - img
    - text: "2019"
    - img
    - text: 124 977 km od 972 zł /msc
  - link "Porsche Panamera Turbo E-Hybrid PHEV Porsche Panamera Turbo E-Hybrid PHEV 2025 10 km od 8537 zł /msc netto":
    - /url: /ogloszenia/porsche-panamera-turbo-e-hybrid-phev
    - img "Porsche Panamera Turbo E-Hybrid PHEV"
    - text: Porsche Panamera Turbo E-Hybrid PHEV
    - img
    - text: "2025"
    - img
    - text: 10 km od 8537 zł /msc netto
  - heading "Jak to działa?" [level=2]
  - text: 1 Złóż zapytanie online 2 Decyzja w 60 minut 3 Podpisz umowę 4 Wpłać opłatę wstępną 5 Rejestrujemy i ubezpieczamy 6 Pojazd gotowy do drogi
  - heading "Opinie klientów" [level=2]
  - text: ★★★★★
  - paragraph: "\"Ekspresowa decyzja, zero stresu. Polecam każdemu przedsiębiorcy.\""
  - text: Marek K., Warszawa ★★★★★
  - paragraph: "\"Wszystko załatwione w jeden dzień. Auto stało pod domem następnego dnia.\""
  - text: Tomasz W., Kraków ★★★★★
  - paragraph: "\"Profesjonalne podejście, najlepsza oferta leasingu jaką znalazłem.\""
  - text: Anna P., Wrocław FIDENS
  - link "Poznaj Fidens":
    - /url: /o-nas
  - link "Leasing":
    - /url: /leasing
  - link "Kontakt":
    - /url: /kontakt
  - link "Regulamin":
    - /url: /regulamin
  - link "Polityka prywatności":
    - /url: /polityka
  - text: (c) 2026 Fidens. Wszelkie prawa zastrzeżone.
- alert
```

# Test source

```ts
  1  | ﻿import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Navbar", () => {
  4  |   test("desktop - widoczne wszystkie linki i CTA", async ({ page }) => {
  5  |     await page.goto("/");
> 6  |     await expect(page.getByRole("link", { name: "Ogłoszenia", exact: true })).toBeVisible();
     |                                                                               ^ Error: expect(locator).toBeVisible() failed
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
  45 |     await expect(page.getByRole("link", { name: "Poznaj Fidens", exact: true })).toBeVisible();
  46 |     await expect(page.getByRole("link", { name: "Kontakt", exact: true })).toBeVisible();
  47 |   });
  48 | });
  49 | 
```