# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: pawilony.spec.ts >> /pawilony/[slug] - strona szczegółowa + PawilonCalculator >> realizacja z realną ceną - okruszki, karuzela, dane obiektu, wyposażenie
- Location: tests\pawilony.spec.ts:29:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Pawilony', { exact: true })
Expected: visible
Error: strict mode violation: getByText('Pawilony', { exact: true }) resolved to 2 elements:
    1) <a href="/pawilony">Pawilony</a> aka getByRole('navigation').getByText('Pawilony')
    2) <a href="/pawilony" class="transition-colors hover:text-[#F0A500]">Pawilony</a> aka getByRole('link', { name: 'Pawilony' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Pawilony', { exact: true })

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
      - link "Strona główna" [ref=e15] [cursor=pointer]:
        - /url: /
      - generic [ref=e16]: ›
      - link "Pawilony" [ref=e17] [cursor=pointer]:
        - /url: /pawilony
      - generic [ref=e18]: ›
      - generic [ref=e19]: Domek całoroczny 35m² z antresolą
    - generic [ref=e21]:
      - generic [ref=e22]:
        - heading "Domek całoroczny 35m² z antresolą" [level=1] [ref=e23]
        - generic [ref=e24]:
          - generic [ref=e25] [cursor=pointer]:
            - img "Domek całoroczny 35m² z antresolą - zdjęcie 1" [ref=e26]
            - button "Poprzednie zdjecie" [ref=e27]
            - button "Nastepne zdjecie" [ref=e30]
            - generic [ref=e33]: 1 / 6
          - generic [ref=e34]:
            - button "Pokaz zdjecie 1" [ref=e35] [cursor=pointer]
            - button "Pokaz zdjecie 2" [ref=e36] [cursor=pointer]
            - button "Pokaz zdjecie 3" [ref=e37] [cursor=pointer]
            - button "Pokaz zdjecie 4" [ref=e38] [cursor=pointer]
            - button "Pokaz zdjecie 5" [ref=e39] [cursor=pointer]
            - button "Pokaz zdjecie 6" [ref=e40] [cursor=pointer]
        - generic [ref=e41]:
          - heading "Dane obiektu" [level=2] [ref=e42]
          - generic [ref=e43]:
            - generic [ref=e44]:
              - term [ref=e45]: Wymiary
              - definition [ref=e46]: 10m × 3,5m
            - generic [ref=e47]:
              - term [ref=e48]: Powierzchnia
              - definition [ref=e49]: 35 m²
        - generic [ref=e50]:
          - heading "Wyposażenie" [level=2] [ref=e51]
          - list [ref=e52]:
            - listitem [ref=e53]: Antresola
            - listitem [ref=e54]: Przestronny salon z gotowym aneksem kuchennym
            - listitem [ref=e55]: W pełni wykończona łazienka
            - listitem [ref=e56]: Dwie komfortowe sypialnie
            - listitem [ref=e57]: Klimatyzacja
            - listitem [ref=e58]: Taras
            - listitem [ref=e59]: Nowoczesna elewacja
        - generic [ref=e60]:
          - heading "Sprawdza się jako" [level=2] [ref=e61]
          - list [ref=e62]:
            - listitem [ref=e63]: Dom całoroczny
            - listitem [ref=e64]: Domek rekreacyjny
            - listitem [ref=e65]: Inwestycja pod wynajem
            - listitem [ref=e66]: Biuro lub obiekt usługowy
          - paragraph [ref=e67]: Każdy projekt wyceniamy indywidualnie i dopasowujemy do oczekiwań klienta. Podana cena ma charakter orientacyjny.
      - complementary [ref=e68]:
        - generic [ref=e70]:
          - generic [ref=e71]: Kalkulator leasingu operacyjnego
          - generic [ref=e72]:
            - button "Leasing operacyjny" [ref=e73] [cursor=pointer]
            - button "Pożyczka" [ref=e74] [cursor=pointer]
          - generic [ref=e75]: Rata miesięczna
          - generic [ref=e76]: 2017 zł/mscnetto
          - generic [ref=e77]: "Rata brutto: 2481 zł/msc"
          - generic [ref=e78]: "Cena brutto: 158 000 zł · Cena netto: 128 455 zł · VAT 23%"
          - generic [ref=e79]:
            - generic [ref=e80]:
              - generic [ref=e81]:
                - generic [ref=e82]: Wpłata wstępna
                - generic [ref=e83]:
                  - text: 20%
                  - generic [ref=e84]: (31 600 zł brutto)
              - slider [ref=e85] [cursor=pointer]: "20"
              - generic [ref=e86]:
                - generic [ref=e87]: 0%
                - generic [ref=e88]: 45%
            - generic [ref=e89]:
              - generic [ref=e90]: Okres
              - generic [ref=e91]:
                - button "48 miesięcy" [ref=e92] [cursor=pointer]
                - button "60 miesięcy" [ref=e93] [cursor=pointer]
          - link "Zapytaj o ten obiekt" [ref=e94] [cursor=pointer]:
            - /url: /kontakt?marka=Pawilon&model=Domek+ca%C5%82oroczny+35m%C2%B2+z+antresol%C4%85&slug=domek-caloroczny-35m2-z-antresola&typ=leasing&wstepna=20&msc=60&rata=2017
          - paragraph [ref=e95]: Kalkulacja orientacyjna. Ostateczna rata zależy od oferty banku.
    - generic [ref=e97]:
      - generic [ref=e98]: FIDENS
      - generic [ref=e99]:
        - link "Poznaj Fidens" [ref=e100] [cursor=pointer]:
          - /url: /o-nas
        - link "Leasing" [ref=e101] [cursor=pointer]:
          - /url: /leasing
        - link "Kontakt" [ref=e102] [cursor=pointer]:
          - /url: /kontakt
        - link "Regulamin" [ref=e103] [cursor=pointer]:
          - /url: /regulamin
        - link "Polityka prywatności" [ref=e104] [cursor=pointer]:
          - /url: /polityka
      - generic [ref=e105]: (c) 2026 Fidens. Wszelkie prawa zastrzeżone.
  - button "Open Next.js Dev Tools" [ref=e111] [cursor=pointer]
  - alert [ref=e115]
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
> 32 |     await expect(page.getByText("Pawilony", { exact: true })).toBeVisible();
     |                                                               ^ Error: expect(locator).toBeVisible() failed
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
  48 |     await expect(page.getByText("24")).toBeVisible();
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