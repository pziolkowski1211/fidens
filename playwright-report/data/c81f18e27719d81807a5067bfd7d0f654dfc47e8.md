# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ogloszenia-list.spec.ts >> /ogloszenia - lista >> wyszukiwarka pokazuje sugestie po wpisaniu tekstu
- Location: tests\ogloszenia-list.spec.ts:26:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByPlaceholder(/Szukaj marki lub modelu/i)
    - locator resolved to <input value="" type="text" autocomplete="off" aria-expanded="false" aria-autocomplete="list" aria-label="Wyszukaj pojazd" placeholder="Szukaj marki lub modelu..." class="w-full bg-white/10 text-white placeholder:text-white/50 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:bg-white/15 focus:border-[#F0A500] transition-colors"/>
    - fill("bmw")
  - attempting fill action
    2 × waiting for element to be visible, enabled and editable
      - element is not visible
    - retrying fill action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and editable
      - element is not visible
    - retrying fill action
      - waiting 100ms
    55 × waiting for element to be visible, enabled and editable
       - element is not visible
     - retrying fill action
       - waiting 500ms

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
    - generic [ref=e14]:
      - heading "Wszystkie ogłoszenia" [level=1] [ref=e15]
      - paragraph [ref=e16]:
        - text: Znaleziono
        - strong [ref=e17]: "7"
        - text: ofert
    - generic [ref=e20]:
      - link "BMW 5 Series 530d xDrive Nowe BMW 5 Series 530d xDrive 2022 68 000 km od 2212 zł /msc netto" [ref=e21] [cursor=pointer]:
        - /url: /ogloszenia/bmw-5-series-530d-xdrive-2022
        - img "BMW 5 Series 530d xDrive" [ref=e23]
        - generic [ref=e24]:
          - generic [ref=e25]: Nowe
          - generic [ref=e26]: BMW 5 Series 530d xDrive
          - generic [ref=e27]:
            - generic [ref=e28]: "2022"
            - generic [ref=e32]: 68 000 km
          - generic [ref=e36]:
            - text: od 2212 zł
            - generic [ref=e37]: /msc netto
      - link "Volvo XC 90 B5 D AWD Geartronic Inscription Volvo XC 90 B5 D AWD Geartronic Inscription 2020 75 892 km od 1416 zł /msc netto" [ref=e38] [cursor=pointer]:
        - /url: /ogloszenia/volvo-xc-90-b5-d-awd-geartronic-inscription
        - img "Volvo XC 90 B5 D AWD Geartronic Inscription" [ref=e40]
        - generic [ref=e41]:
          - generic [ref=e42]: Volvo XC 90 B5 D AWD Geartronic Inscription
          - generic [ref=e43]:
            - generic [ref=e44]: "2020"
            - generic [ref=e48]: 75 892 km
          - generic [ref=e52]:
            - text: od 1416 zł
            - generic [ref=e53]: /msc netto
      - link "Volkswagen Arteon 2.0 TSI R-Line DSG Volkswagen Arteon 2.0 TSI R-Line DSG 2019 124 977 km od 972 zł /msc" [ref=e54] [cursor=pointer]:
        - /url: /ogloszenia/volkswagen-arteon-2-0-tsi-r-line-dsg
        - img "Volkswagen Arteon 2.0 TSI R-Line DSG" [ref=e56]
        - generic [ref=e57]:
          - generic [ref=e58]: Volkswagen Arteon 2.0 TSI R-Line DSG
          - generic [ref=e59]:
            - generic [ref=e60]: "2019"
            - generic [ref=e64]: 124 977 km
          - generic [ref=e68]: od 972 zł /msc
      - link "Porsche Panamera Turbo E-Hybrid PHEV Porsche Panamera Turbo E-Hybrid PHEV 2025 10 km od 8537 zł /msc netto" [ref=e69] [cursor=pointer]:
        - /url: /ogloszenia/porsche-panamera-turbo-e-hybrid-phev
        - img "Porsche Panamera Turbo E-Hybrid PHEV" [ref=e71]
        - generic [ref=e72]:
          - generic [ref=e73]: Porsche Panamera Turbo E-Hybrid PHEV
          - generic [ref=e74]:
            - generic [ref=e75]: "2025"
            - generic [ref=e79]: 10 km
          - generic [ref=e83]:
            - text: od 8537 zł
            - generic [ref=e84]: /msc netto
      - link "Porsche 911 GT3 RS Nowe Porsche 911 GT3 RS 2025 19 000 km od 12 385 zł /msc netto" [ref=e85] [cursor=pointer]:
        - /url: /ogloszenia/porsche-911
        - img "Porsche 911 GT3 RS" [ref=e87]
        - generic [ref=e88]:
          - generic [ref=e89]: Nowe
          - generic [ref=e90]: Porsche 911 GT3 RS
          - generic [ref=e91]:
            - generic [ref=e92]: "2025"
            - generic [ref=e96]: 19 000 km
          - generic [ref=e100]:
            - text: od 12 385 zł
            - generic [ref=e101]: /msc netto
      - link "Caterpillar 320 D2 Caterpillar 320 D2 2019 od 3848 zł /msc" [ref=e102] [cursor=pointer]:
        - /url: /ogloszenia/caterpillar-320-d2-2019
        - img "Caterpillar 320 D2" [ref=e104]
        - generic [ref=e105]:
          - generic [ref=e106]: Caterpillar 320 D2
          - generic [ref=e107]: "2019"
          - generic [ref=e112]: od 3848 zł /msc
      - link "Mercedes-Benz Sprinter 519 CDI Promocja Mercedes-Benz Sprinter 519 CDI 2021 145 000 km od 1460 zł /msc netto" [ref=e113] [cursor=pointer]:
        - /url: /ogloszenia/mercedes-sprinter-519-cdi-2021
        - img "Mercedes-Benz Sprinter 519 CDI" [ref=e115]
        - generic [ref=e116]:
          - generic [ref=e117]: Promocja
          - generic [ref=e118]: Mercedes-Benz Sprinter 519 CDI
          - generic [ref=e119]:
            - generic [ref=e120]: "2021"
            - generic [ref=e124]: 145 000 km
          - generic [ref=e128]:
            - text: od 1460 zł
            - generic [ref=e129]: /msc netto
    - generic [ref=e131]:
      - generic [ref=e132]: FIDENS
      - generic [ref=e133]:
        - link "Poznaj Fidens" [ref=e134] [cursor=pointer]:
          - /url: /o-nas
        - link "Leasing" [ref=e135] [cursor=pointer]:
          - /url: /leasing
        - link "Kontakt" [ref=e136] [cursor=pointer]:
          - /url: /kontakt
        - link "Regulamin" [ref=e137] [cursor=pointer]:
          - /url: /regulamin
        - link "Polityka prywatności" [ref=e138] [cursor=pointer]:
          - /url: /polityka
      - generic [ref=e139]: (c) 2026 Fidens. Wszelkie prawa zastrzeżone.
  - button "Open Next.js Dev Tools" [ref=e145] [cursor=pointer]
  - alert [ref=e149]
```

# Test source

```ts
  1  | ﻿import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("/ogloszenia - lista", () => {
  4  |   test("strona się ładuje i pokazuje nagłówek", async ({ page }) => {
  5  |     await page.goto("/ogloszenia");
  6  |     await expect(page.getByRole("heading", { name: "Wszystkie ogłoszenia" })).toBeVisible();
  7  |   });
  8  | 
  9  |   test("pokazuje karty ogłoszeń albo komunikat braku ofert", async ({ page }) => {
  10 |     await page.goto("/ogloszenia");
  11 |     const cards = page.locator('a[href^="/ogloszenia/"]');
  12 |     const brakOfert = page.getByText(/Brak ofert/i);
  13 |     const cardsCount = await cards.count();
  14 |     if (cardsCount === 0) {
  15 |       await expect(brakOfert).toBeVisible();
  16 |     } else {
  17 |       await expect(cards.first()).toBeVisible();
  18 |     }
  19 |   });
  20 | 
  21 |   test("filtr marki z URL działa (query params)", async ({ page }) => {
  22 |     await page.goto("/ogloszenia?marka=bmw");
  23 |     await expect(page).toHaveURL(/marka=bmw/);
  24 |   });
  25 | 
  26 |   test("wyszukiwarka pokazuje sugestie po wpisaniu tekstu", async ({ page }) => {
  27 |     await page.goto("/ogloszenia");
  28 |     const search = page.getByPlaceholder(/Szukaj marki lub modelu/i);
> 29 |     await search.fill("bmw");
     |                  ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  30 |     await page.waitForTimeout(500);
  31 |   });
  32 | 
  33 |   test("hover na karcie nie powoduje błędu konsoli", async ({ page }) => {
  34 |     const errors: string[] = [];
  35 |     page.on("console", (msg) => {
  36 |       if (msg.type() === "error") errors.push(msg.text());
  37 |     });
  38 |     await page.goto("/ogloszenia");
  39 |     const firstCard = page.locator('a[href^="/ogloszenia/"]').first();
  40 |     if (await firstCard.count() > 0) {
  41 |       await firstCard.hover();
  42 |       await page.waitForTimeout(300);
  43 |     }
  44 |     expect(errors).toEqual([]);
  45 |   });
  46 | });
  47 | 
```