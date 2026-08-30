# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: pawilony.spec.ts >> /pawilony/[slug] - strona szczegółowa + PawilonCalculator >> kalkulator: Pożyczka pokazuje suwak okresu 24-72 msc
- Location: tests\pawilony.spec.ts:45:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('24')
Expected: visible
Error: strict mode violation: getByText('24') resolved to 2 elements:
    1) <div class="font-bold leading-none mb-1">…</div> aka getByText('zł/msc')
    2) <span>24</span> aka getByText('24', { exact: true })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('24')

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - main [ref=e2]:
    - navigation [ref=e3]:
      - link [ref=e4] [cursor=pointer]:
        - /url: /
        - img "Fidens" [ref=e5]
      - textbox "Wyszukaj pojazd" [ref=e9]:
        - /placeholder: Szukaj marki lub modelu...
      - generic [ref=e10]:
        - link "Ogłoszenia" [ref=e11] [cursor=pointer]:
          - /url: /ogloszenia
        - link "Pawilony" [ref=e12] [cursor=pointer]:
          - /url: /pawilony
        - link "Poznaj Fidens" [ref=e13] [cursor=pointer]:
          - /url: /o-nas
        - link "Kontakt" [ref=e14] [cursor=pointer]:
          - /url: /kontakt
        - link "Zamów bezpłatną kalkulację" [ref=e15] [cursor=pointer]:
          - /url: /kontakt
    - generic [ref=e17]:
      - link "Strona główna" [ref=e18] [cursor=pointer]:
        - /url: /
      - generic [ref=e19]: ›
      - link "Pawilony" [ref=e20] [cursor=pointer]:
        - /url: /pawilony
      - generic [ref=e21]: ›
      - generic [ref=e22]: Domek całoroczny 35m² z antresolą
    - generic [ref=e24]:
      - generic [ref=e25]:
        - heading "Domek całoroczny 35m² z antresolą" [level=1] [ref=e26]
        - generic [ref=e27]:
          - generic [ref=e28] [cursor=pointer]:
            - img "Domek całoroczny 35m² z antresolą - zdjęcie 1" [ref=e29]
            - button "Poprzednie zdjecie" [ref=e30]
            - button "Nastepne zdjecie" [ref=e33]
            - generic [ref=e36]: 1 / 6
          - generic [ref=e37]:
            - button "Pokaz zdjecie 1" [ref=e38] [cursor=pointer]
            - button "Pokaz zdjecie 2" [ref=e39] [cursor=pointer]
            - button "Pokaz zdjecie 3" [ref=e40] [cursor=pointer]
            - button "Pokaz zdjecie 4" [ref=e41] [cursor=pointer]
            - button "Pokaz zdjecie 5" [ref=e42] [cursor=pointer]
            - button "Pokaz zdjecie 6" [ref=e43] [cursor=pointer]
        - generic [ref=e44]:
          - heading "Dane obiektu" [level=2] [ref=e45]
          - generic [ref=e46]:
            - generic [ref=e47]:
              - term [ref=e48]: Wymiary
              - definition [ref=e49]: 10m × 3,5m
            - generic [ref=e50]:
              - term [ref=e51]: Powierzchnia
              - definition [ref=e52]: 35 m²
        - generic [ref=e53]:
          - heading "Wyposażenie" [level=2] [ref=e54]
          - list [ref=e55]:
            - listitem [ref=e56]: Antresola
            - listitem [ref=e57]: Przestronny salon z gotowym aneksem kuchennym
            - listitem [ref=e58]: W pełni wykończona łazienka
            - listitem [ref=e59]: Dwie komfortowe sypialnie
            - listitem [ref=e60]: Klimatyzacja
            - listitem [ref=e61]: Taras
            - listitem [ref=e62]: Nowoczesna elewacja
        - generic [ref=e63]:
          - heading "Sprawdza się jako" [level=2] [ref=e64]
          - list [ref=e65]:
            - listitem [ref=e66]: Dom całoroczny
            - listitem [ref=e67]: Domek rekreacyjny
            - listitem [ref=e68]: Inwestycja pod wynajem
            - listitem [ref=e69]: Biuro lub obiekt usługowy
          - paragraph [ref=e70]: Każdy projekt wyceniamy indywidualnie i dopasowujemy do oczekiwań klienta. Podana cena ma charakter orientacyjny.
      - complementary [ref=e71]:
        - generic [ref=e73]:
          - generic [ref=e74]: Kalkulator pożyczki
          - generic [ref=e75]:
            - button "Leasing operacyjny" [ref=e76] [cursor=pointer]
            - button "Pożyczka" [active] [ref=e77] [cursor=pointer]
          - generic [ref=e78]: Rata miesięczna
          - generic [ref=e79]: 2481 zł/msc
          - generic [ref=e80]: "Cena brutto: 158 000 zł"
          - generic [ref=e81]:
            - generic [ref=e82]:
              - generic [ref=e83]:
                - generic [ref=e84]: Wpłata wstępna
                - generic [ref=e85]:
                  - text: 20%
                  - generic [ref=e86]: (31 600 zł brutto)
              - slider [ref=e87] [cursor=pointer]: "20"
              - generic [ref=e88]:
                - generic [ref=e89]: 0%
                - generic [ref=e90]: 45%
            - generic [ref=e91]:
              - generic [ref=e92]:
                - generic [ref=e93]: Okres
                - generic [ref=e94]: 60 miesięcy
              - slider [ref=e95] [cursor=pointer]: "60"
              - generic [ref=e96]:
                - generic [ref=e97]: "24"
                - generic [ref=e98]: "36"
                - generic [ref=e99]: "48"
                - generic [ref=e100]: "60"
                - generic [ref=e101]: "72"
          - link "Zapytaj o ten obiekt" [ref=e102] [cursor=pointer]:
            - /url: /kontakt?marka=Pawilon&model=Domek+ca%C5%82oroczny+35m%C2%B2+z+antresol%C4%85&slug=domek-caloroczny-35m2-z-antresola&typ=pozyczka&wstepna=20&msc=60&rata=2481
          - paragraph [ref=e103]: Kalkulacja orientacyjna. Ostateczna rata zależy od oferty banku.
    - generic [ref=e105]:
      - generic [ref=e106]: FIDENS
      - generic [ref=e107]:
        - link "Poznaj Fidens" [ref=e108] [cursor=pointer]:
          - /url: /o-nas
        - link "Leasing" [ref=e109] [cursor=pointer]:
          - /url: /leasing
        - link "Kontakt" [ref=e110] [cursor=pointer]:
          - /url: /kontakt
        - link "Regulamin" [ref=e111] [cursor=pointer]:
          - /url: /regulamin
        - link "Polityka prywatności" [ref=e112] [cursor=pointer]:
          - /url: /polityka
      - generic [ref=e113]: (c) 2026 Fidens. Wszelkie prawa zastrzeżone.
  - button "Open Next.js Dev Tools" [ref=e119] [cursor=pointer]
  - alert [ref=e123]
```

# Test source

```ts
  1  | ﻿import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("/pawilony - lista", () => {
  4  |   test("strona się ładuje z nagłówkiem i 5 realizacjami + kafelek własnego projektu", async ({ page }) => {
  5  |     await page.goto("/pawilony");
  6  |     await expect(page.getByRole("heading", { name: "Pawilony i kontenery na zamówienie" })).toBeVisible();
  7  |     await expect(page.getByText("Domek całoroczny 35m² z antresolą")).toBeVisible();
  8  |     await expect(page.getByText("Dom modułowy 40m²")).toBeVisible();
  9  |     await expect(page.getByText("Pawilon biurowy 24m²")).toBeVisible();
  10 |     await expect(page.getByText("Pawilon gastronomiczny 18m²")).toBeVisible();
  11 |     await expect(page.getByText("Domek modułowy 42m² z elewacją palisandrową")).toBeVisible();
  12 |     await expect(page.getByText("Twój własny projekt")).toBeVisible();
  13 |   });
  14 | 
  15 |   test("kafelek Twój własny projekt prowadzi do /kontakt", async ({ page }) => {
  16 |     await page.goto("/pawilony");
  17 |     await page.getByRole("link", { name: "Zapytaj o wycenę" }).click();
  18 |     await expect(page).toHaveURL(/\/kontakt/);
  19 |   });
  20 | 
  21 |   test("kliknięcie w realizację przenosi do strony szczegółowej", async ({ page }) => {
  22 |     await page.goto("/pawilony");
  23 |     await page.getByText("Domek całoroczny 35m² z antresolą").click();
  24 |     await expect(page).toHaveURL(/\/pawilony\/domek-caloroczny-35m2-z-antresola/);
  25 |   });
  26 | });
  27 | 
  28 | test.describe("/pawilony/[slug] - strona szczegółowa + PawilonCalculator", () => {
  29 |   test("realizacja z realną ceną - okruszki, karuzela, dane obiektu, wyposażenie", async ({ page }) => {
  30 |     await page.goto("/pawilony/domek-caloroczny-35m2-z-antresola");
  31 |     await expect(page.getByText("Strona główna")).toBeVisible();
  32 |     await expect(page.getByText("Pawilony", { exact: true })).toBeVisible();
  33 |     await expect(page.locator("h1")).toContainText("Domek całoroczny");
  34 |     await expect(page.getByRole("heading", { name: "Dane obiektu" })).toBeVisible();
  35 |     await expect(page.getByRole("heading", { name: "Wyposażenie" })).toBeVisible();
  36 |   });
  37 | 
  38 |   test("kalkulator: Leasing operacyjny pokazuje TYLKO 48/60 msc, bez suwaka wykupu", async ({ page }) => {
  39 |     await page.goto("/pawilony/domek-caloroczny-35m2-z-antresola");
  40 |     await expect(page.getByRole("button", { name: "48 miesięcy" })).toBeVisible();
  41 |     await expect(page.getByRole("button", { name: "60 miesięcy" })).toBeVisible();
  42 |     await expect(page.getByText(/Wykup/i)).not.toBeVisible();
  43 |   });
  44 | 
  45 |   test("kalkulator: Pożyczka pokazuje suwak okresu 24-72 msc", async ({ page }) => {
  46 |     await page.goto("/pawilony/domek-caloroczny-35m2-z-antresola");
  47 |     await page.getByRole("button", { name: "Pożyczka" }).click();
> 48 |     await expect(page.getByText("24")).toBeVisible();
     |                                        ^ Error: expect(locator).toBeVisible() failed
  49 |     await expect(page.getByText("72")).toBeVisible();
  50 |   });
  51 | 
  52 |   test("przycisk CTA mówi Zapytaj o ten obiekt (nie pojazd)", async ({ page }) => {
  53 |     await page.goto("/pawilony/domek-caloroczny-35m2-z-antresola");
  54 |     await expect(page.getByRole("link", { name: "Zapytaj o ten obiekt" })).toBeVisible();
  55 |   });
  56 | 
  57 |   test("nowa realizacja (placeholder) pokazuje żółte ostrzeżenie o cenie", async ({ page }) => {
  58 |     await page.goto("/pawilony/dom-modulowy-40m2-10x4m");
  59 |     await expect(page.getByText(/UWAGA.*placeholder/i)).toBeVisible();
  60 |   });
  61 | });
  62 | 
```