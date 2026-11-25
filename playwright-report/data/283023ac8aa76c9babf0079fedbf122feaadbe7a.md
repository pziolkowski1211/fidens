# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: pawilony.spec.ts >> /pawilony - lista >> strona się ładuje z nagłówkiem i 5 realizacjami + kafelek własnego projektu
- Location: tests\pawilony.spec.ts:4:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Pawilon biurowy 24m²')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Pawilon biurowy 24m²')

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
  - heading "Pawilony i kontenery na zamówienie" [level=1]
  - paragraph: Szeroki wybór pawilonów i kontenerów modułowych, w pełni spersonalizowanych pod Twoje potrzeby. Jaki projekt sobie wymarzysz — taki zrealizujemy i wycenimy. Poniżej przykładowe realizacje wraz z orientacyjną wyceną.
  - link "Domek całoroczny 35m² z antresolą Dom całoroczny Domek całoroczny 35m² z antresolą 10m × 3,5m 35 m² Cena orientacyjna od 158 000 zł brutto":
    - /url: /pawilony/domek-caloroczny-35m2-z-antresola
    - img "Domek całoroczny 35m² z antresolą"
    - text: Dom całoroczny
    - heading "Domek całoroczny 35m² z antresolą" [level=2]
    - img
    - text: 10m × 3,5m
    - img
    - text: 35 m² Cena orientacyjna od 158 000 zł brutto
  - link "Dom modułowy 40m² Dom modułowy Dom modułowy 40m² 10m × 4m 40 m² Cena orientacyjna od 147 000 zł brutto":
    - /url: /pawilony/dom-modulowy-40m2-10x4m
    - img "Dom modułowy 40m²"
    - text: Dom modułowy
    - heading "Dom modułowy 40m²" [level=2]
    - img
    - text: 10m × 4m
    - img
    - text: 40 m² Cena orientacyjna od 147 000 zł brutto
  - link "Pawilon modułowy 24m² Pawilon modułowy Pawilon modułowy 24m² 8m × 3m 24 m² Cena orientacyjna od 83 000 zł brutto":
    - /url: /pawilony/pawilon-biurowy-24m2-8x3m
    - img "Pawilon modułowy 24m²"
    - text: Pawilon modułowy
    - heading "Pawilon modułowy 24m²" [level=2]
    - img
    - text: 8m × 3m
    - img
    - text: 24 m² Cena orientacyjna od 83 000 zł brutto
  - link "Pawilon gastronomiczny 18m² Pawilon gastronomiczny Pawilon gastronomiczny 18m² 6m × 3m 18 m² Cena orientacyjna od 42 000 zł brutto":
    - /url: /pawilony/pawilon-gastronomiczny-18m2-6x3m
    - img "Pawilon gastronomiczny 18m²"
    - text: Pawilon gastronomiczny
    - heading "Pawilon gastronomiczny 18m²" [level=2]
    - img
    - text: 6m × 3m
    - img
    - text: 18 m² Cena orientacyjna od 42 000 zł brutto
  - link "Domek modułowy 42m² Domek modułowy Domek modułowy 42m² 7m × 6m 42 m² Cena orientacyjna od 173 000 zł brutto":
    - /url: /pawilony/domek-modulowy-42m2-elewacja-palisandrowa
    - img "Domek modułowy 42m²"
    - text: Domek modułowy
    - heading "Domek modułowy 42m²" [level=2]
    - img
    - text: 7m × 6m
    - img
    - text: 42 m² Cena orientacyjna od 173 000 zł brutto
  - img
  - heading "Twój własny projekt" [level=2]
  - paragraph: Nie widzisz tego, czego szukasz? Zaprojektujemy i wycenimy pawilon lub kontener dokładnie pod Twoje potrzeby.
  - link "Zapytaj o wycenę":
    - /url: /kontakt
  - paragraph: Każdy projekt wyceniamy indywidualnie i dopasowujemy do oczekiwań klienta. Podane ceny mają charakter orientacyjny.
  - text: FIDENS
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
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("/pawilony - lista", () => {
  4  |   test("strona się ładuje z nagłówkiem i 5 realizacjami + kafelek własnego projektu", async ({ page }) => {
  5  |     await page.goto("/pawilony");
  6  |     await expect(page.getByRole("heading", { name: "Pawilony i kontenery na zamówienie" })).toBeVisible();
  7  |     await expect(page.getByText("Domek całoroczny 35m² z antresolą")).toBeVisible();
  8  |     await expect(page.getByText("Dom modułowy 40m²")).toBeVisible();
> 9  |     await expect(page.getByText("Pawilon biurowy 24m²")).toBeVisible();
     |                                                          ^ Error: expect(locator).toBeVisible() failed
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
  31 |     const breadcrumb = page.locator("div.text-sm", { hasText: "Strona główna" });
  32 |     await expect(breadcrumb.getByText("Strona główna")).toBeVisible();
  33 |     await expect(breadcrumb.getByRole("link", { name: "Pawilony", exact: true })).toBeVisible();
  34 |     await expect(page.locator("h1")).toContainText("Domek całoroczny");
  35 |     await expect(page.getByRole("heading", { name: "Dane obiektu" })).toBeVisible();
  36 |     await expect(page.getByRole("heading", { name: "Wyposażenie" })).toBeVisible();
  37 |   });
  38 | 
  39 |   test("kalkulator: Leasing operacyjny pokazuje TYLKO 48/60 msc, bez suwaka wykupu", async ({ page }) => {
  40 |     await page.goto("/pawilony/domek-caloroczny-35m2-z-antresola");
  41 |     await expect(page.getByRole("button", { name: "48 miesięcy" })).toBeVisible();
  42 |     await expect(page.getByRole("button", { name: "60 miesięcy" })).toBeVisible();
  43 |     await expect(page.getByText(/Wykup/i)).not.toBeVisible();
  44 |   });
  45 | 
  46 |   test("kalkulator: Pożyczka pokazuje suwak okresu 24-72 msc", async ({ page }) => {
  47 |     await page.goto("/pawilony/domek-caloroczny-35m2-z-antresola");
  48 |     await page.getByRole("button", { name: "Pożyczka" }).click();
  49 |     await expect(page.getByText("24", { exact: true })).toBeVisible();
  50 |     await expect(page.getByText("72", { exact: true })).toBeVisible();
  51 |   });
  52 | 
  53 |   test("przycisk CTA mówi Zapytaj o ten obiekt (nie pojazd)", async ({ page }) => {
  54 |     await page.goto("/pawilony/domek-caloroczny-35m2-z-antresola");
  55 |     await expect(page.getByRole("link", { name: "Zapytaj o ten obiekt" })).toBeVisible();
  56 |   });
  57 | 
  58 |   test("nowa realizacja (placeholder) pokazuje żółte ostrzeżenie o cenie", async ({ page }) => {
  59 |     await page.goto("/pawilony/dom-modulowy-40m2-10x4m");
  60 |     await expect(page.getByText(/UWAGA.*placeholder/i)).toBeVisible();
  61 |   });
  62 | });
```