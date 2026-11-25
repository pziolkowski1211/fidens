# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: pawilony.spec.ts >> /pawilony/[slug] - strona szczegółowa + PawilonCalculator >> nowa realizacja (placeholder) pokazuje żółte ostrzeżenie o cenie
- Location: tests\pawilony.spec.ts:58:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/UWAGA.*placeholder/i)
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText(/UWAGA.*placeholder/i)

```

```yaml
- main:
  - navigation:
    - link "Fidens":
      - /url: /
      - img "Fidens"
    - img
    - textbox "Wyszukaj pojazd":
      - /placeholder: Szukaj marki lub modelu...
    - link "Ogłoszenia":
      - /url: /ogloszenia
    - link "Poznaj Fidens":
      - /url: /o-nas
    - link "Kontakt":
      - /url: /kontakt
    - link "Zamów bezpłatną kalkulację":
      - /url: /kontakt
  - link "Strona główna":
    - /url: /
  - text: ›
  - link "Pawilony":
    - /url: /pawilony
  - text: › Dom modułowy 40m²
  - heading "Dom modułowy 40m²" [level=1]
  - img "Dom modułowy 40m² - zdjęcie 1"
  - button "Poprzednie zdjecie":
    - img
  - button "Nastepne zdjecie":
    - img
  - text: 1 / 5
  - button "Pokaz zdjecie 1"
  - button "Pokaz zdjecie 2"
  - button "Pokaz zdjecie 3"
  - button "Pokaz zdjecie 4"
  - button "Pokaz zdjecie 5"
  - heading "Dane obiektu" [level=2]
  - term: Wymiary
  - definition: 10m × 4m
  - term: Powierzchnia
  - definition: 40 m²
  - term: Materiał
  - definition: płyta wielowarstwowa
  - heading "Wyposażenie" [level=2]
  - list:
    - listitem: Antresola
    - listitem: Przestronny salon z gotowym aneksem kuchennym
    - listitem: W pełni wykończona łazienka
    - listitem: Sypialnia
    - listitem: Klimatyzacja
    - listitem: Taras
  - paragraph: Pełna specyfikacja techniczna dostępna po kontakcie z naszym doradcą.
  - heading "Sprawdza się jako" [level=2]
  - list:
    - listitem: Dom całoroczny
    - listitem: Domek rekreacyjny
    - listitem: Inwestycja pod wynajem
    - listitem: Biuro lub obiekt usługowy
  - paragraph: Każdy projekt wyceniamy indywidualnie i dopasowujemy do oczekiwań klienta. Podana cena ma charakter orientacyjny.
  - complementary:
    - text: Kalkulator leasingu operacyjnego
    - button "Leasing operacyjny"
    - button "Pożyczka"
    - text: "Rata miesięczna 1877 zł/mscnetto Rata brutto: 2309 zł/msc Cena brutto: 147 000 zł · Cena netto: 119 512 zł · VAT 23% Wpłata wstępna 20% (29 400 zł brutto)"
    - slider: "20"
    - text: 0% 45% Okres
    - button "48 miesięcy"
    - button "60 miesięcy"
    - link "Zapytaj o ten obiekt":
      - /url: /kontakt?marka=Pawilon&model=Dom+modu%C5%82owy+40m%C2%B2&slug=dom-modulowy-40m2-10x4m&typ=leasing&wstepna=20&msc=60&rata=1877
    - paragraph: Kalkulacja orientacyjna. Ostateczna rata zależy od oferty banku.
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
> 60 |     await expect(page.getByText(/UWAGA.*placeholder/i)).toBeVisible();
     |                                                         ^ Error: expect(locator).toBeVisible() failed
  61 |   });
  62 | });
```