# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ogloszenie-detail.spec.ts >> /ogloszenia/[slug] - strona szczegółowa + kalkulator >> okruszki, tytuł i karuzela są widoczne
- Location: tests\ogloszenie-detail.spec.ts:14:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Ogłoszenia', { exact: true })
Expected: visible
Error: strict mode violation: getByText('Ogłoszenia', { exact: true }) resolved to 2 elements:
    1) <a href="/ogloszenia">Ogłoszenia</a> aka getByRole('navigation').getByRole('link', { name: 'Ogłoszenia' })
    2) <a href="/ogloszenia" class="transition-colors hover:text-[#F0A500]">Ogłoszenia</a> aka getByRole('link', { name: 'Ogłoszenia' }).nth(1)

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Ogłoszenia', { exact: true })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]
  - alert [ref=e11]: BMW 5 Series 530d xDrive — Fidens
  - main [ref=e12]:
    - navigation [ref=e13]:
      - link [ref=e14] [cursor=pointer]:
        - /url: /
        - img "Fidens" [ref=e15]
      - textbox "Wyszukaj pojazd" [ref=e19]:
        - /placeholder: Szukaj marki lub modelu...
      - generic [ref=e20]:
        - link "Ogłoszenia" [ref=e21] [cursor=pointer]:
          - /url: /ogloszenia
        - link "Pawilony" [ref=e22] [cursor=pointer]:
          - /url: /pawilony
        - link "Poznaj Fidens" [ref=e23] [cursor=pointer]:
          - /url: /o-nas
        - link "Kontakt" [ref=e24] [cursor=pointer]:
          - /url: /kontakt
        - link "Zamów bezpłatną kalkulację" [ref=e25] [cursor=pointer]:
          - /url: /kontakt
    - generic [ref=e27]:
      - link "Strona główna" [ref=e28] [cursor=pointer]:
        - /url: /
      - generic [ref=e29]: ›
      - link "Ogłoszenia" [ref=e30] [cursor=pointer]:
        - /url: /ogloszenia
      - generic [ref=e31]: ›
      - generic [ref=e32]: BMW 5 Series 530d xDrive
    - generic [ref=e34]:
      - generic [ref=e35]:
        - generic [ref=e36]:
          - heading "BMW 5 Series 530d xDrive" [level=1] [ref=e37]
          - generic [ref=e38]: Nowe
        - generic [ref=e39]:
          - generic [ref=e40] [cursor=pointer]:
            - img "BMW 5 Series 530d xDrive - zdjęcie 1" [ref=e41]
            - button "Poprzednie zdjecie" [ref=e42]
            - button "Nastepne zdjecie" [ref=e45]
            - generic [ref=e48]: 1 / 3
          - generic [ref=e49]:
            - button "Pokaz zdjecie 1" [ref=e50] [cursor=pointer]
            - button "Pokaz zdjecie 2" [ref=e51] [cursor=pointer]
            - button "Pokaz zdjecie 3" [ref=e52] [cursor=pointer]
        - generic [ref=e53]:
          - heading "Dane pojazdu" [level=2] [ref=e54]
          - generic [ref=e55]:
            - generic [ref=e56]:
              - term [ref=e57]: Rok produkcji
              - definition [ref=e58]: "2022"
            - generic [ref=e59]:
              - term [ref=e60]: Przebieg
              - definition [ref=e61]: 68 000 km
            - generic [ref=e62]:
              - term [ref=e63]: Paliwo
              - definition [ref=e64]: Diesel
            - generic [ref=e65]:
              - term [ref=e66]: Skrzynia biegów
              - definition [ref=e67]: Automatyczna
            - generic [ref=e68]:
              - term [ref=e69]: Moc
              - definition [ref=e70]: 286 KM
            - generic [ref=e71]:
              - term [ref=e72]: Pojemność silnika
              - definition [ref=e73]: 2993 cm3
            - generic [ref=e74]:
              - term [ref=e75]: Kolor
              - definition [ref=e76]: Czarny metalik
            - generic [ref=e77]:
              - term [ref=e78]: Pochodzenie
              - definition [ref=e79]: Polska
        - generic [ref=e80]:
          - heading "Opis" [level=2] [ref=e81]
          - paragraph [ref=e83]: BMW 5 Series 530d xDrive z 2022 roku w idealnym stanie. Salon Polska, pierwszy właściciel, pełna historia serwisowa w ASO BMW. Pakiet M Sport, fotele sportowe, harman/kardon, head-up display, kamery 360.
      - complementary [ref=e84]:
        - generic [ref=e86]:
          - generic [ref=e87]: Kalkulator leasingu
          - generic [ref=e88]:
            - button "Leasing operacyjny" [ref=e89] [cursor=pointer]
            - button "Pożyczka" [ref=e90] [cursor=pointer]
          - generic [ref=e91]: Rata miesięczna
          - generic [ref=e92]: 2212 zł/mscnetto
          - generic [ref=e93]: "Rata brutto: 2720 zł/msc"
          - generic [ref=e94]: "Cena brutto: 249 999 zł · Cena netto: 203 251 zł · VAT 23%"
          - generic [ref=e95]:
            - generic [ref=e96]:
              - generic [ref=e97]:
                - generic [ref=e98]: Wpłata wstępna
                - generic [ref=e99]:
                  - text: 20%
                  - generic [ref=e100]: (50 000 zł brutto)
              - slider [ref=e101] [cursor=pointer]: "20"
              - generic [ref=e102]:
                - generic [ref=e103]: 0%
                - generic [ref=e104]: 45%
            - generic [ref=e105]:
              - generic [ref=e106]:
                - generic [ref=e107]: Okres
                - generic [ref=e108]: 60 miesięcy
              - slider [ref=e109] [cursor=pointer]: "60"
              - generic [ref=e110]:
                - generic [ref=e111]: "24"
                - generic [ref=e112]: "36"
                - generic [ref=e113]: "48"
                - generic [ref=e114]: "60"
                - generic [ref=e115]: "72"
            - generic [ref=e116]:
              - generic [ref=e117]:
                - generic [ref=e118]: Wykup
                - generic [ref=e119]:
                  - text: 35%
                  - generic [ref=e120]: (87 500 zł brutto)
              - slider [ref=e121] [cursor=pointer]: "35"
              - generic [ref=e122]:
                - generic [ref=e123]: 1%
                - generic [ref=e124]: 35%
          - link "Zapytaj o ten pojazd" [ref=e125] [cursor=pointer]:
            - /url: /kontakt?marka=BMW&model=5+Series&slug=bmw-5-series-530d-xdrive-2022&typ=leasing&wstepna=20&msc=60&wykup=35&rata=2212
          - paragraph [ref=e126]: Kalkulacja orientacyjna. Ostateczna rata zależy od oferty banku.
    - generic [ref=e128]:
      - generic [ref=e129]: FIDENS
      - generic [ref=e130]:
        - link "Poznaj Fidens" [ref=e131] [cursor=pointer]:
          - /url: /o-nas
        - link "Leasing" [ref=e132] [cursor=pointer]:
          - /url: /leasing
        - link "Kontakt" [ref=e133] [cursor=pointer]:
          - /url: /kontakt
        - link "Regulamin" [ref=e134] [cursor=pointer]:
          - /url: /regulamin
        - link "Polityka prywatności" [ref=e135] [cursor=pointer]:
          - /url: /polityka
      - generic [ref=e136]: (c) 2026 Fidens. Wszelkie prawa zastrzeżone.
```

# Test source

```ts
  1  | ﻿import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("/ogloszenia/[slug] - strona szczegółowa + kalkulator", () => {
  4  |   async function goToFirstListing(page: import("@playwright/test").Page) {
  5  |     await page.goto("/ogloszenia");
  6  |     const firstCard = page.locator('a[href^="/ogloszenia/"]').first();
  7  |     const count = await firstCard.count();
  8  |     if (count === 0) return null;
  9  |     const href = await firstCard.getAttribute("href");
  10 |     await firstCard.click();
  11 |     return href;
  12 |   }
  13 | 
  14 |   test("okruszki, tytuł i karuzela są widoczne", async ({ page }) => {
  15 |     const href = await goToFirstListing(page);
  16 |     test.skip(!href, "Brak ogłoszeń do przetestowania");
  17 |     await expect(page.getByText("Strona główna")).toBeVisible();
> 18 |     await expect(page.getByText("Ogłoszenia", { exact: true })).toBeVisible();
     |                                                                 ^ Error: expect(locator).toBeVisible() failed
  19 |     await expect(page.locator("h1")).toBeVisible();
  20 |   });
  21 | 
  22 |   test("sekcja Dane pojazdu jest widoczna", async ({ page }) => {
  23 |     const href = await goToFirstListing(page);
  24 |     test.skip(!href, "Brak ogłoszeń do przetestowania");
  25 |     await expect(page.getByRole("heading", { name: "Dane pojazdu" })).toBeVisible();
  26 |   });
  27 | 
  28 |   test("opis nie pokazuje surowych gwiazdek Markdown", async ({ page }) => {
  29 |     const href = await goToFirstListing(page);
  30 |     test.skip(!href, "Brak ogłoszeń do przetestowania");
  31 |     const opisHeading = page.getByRole("heading", { name: "Opis" });
  32 |     if (await opisHeading.count() > 0) {
  33 |       const opisSection = opisHeading.locator("xpath=..");
  34 |       const text = await opisSection.textContent();
  35 |       expect(text).not.toContain("**");
  36 |     }
  37 |   });
  38 | 
  39 |   test("kalkulator pokazuje ratę i suwaki", async ({ page }) => {
  40 |     const href = await goToFirstListing(page);
  41 |     test.skip(!href, "Brak ogłoszeń do przetestowania");
  42 |     await expect(page.getByText(/Rata miesięczna/i)).toBeVisible();
  43 |     await expect(page.getByText(/Wpłata wstępna/i)).toBeVisible();
  44 |     await expect(page.getByText(/Okres/i).first()).toBeVisible();
  45 |   });
  46 | 
  47 |   test("jeśli jest wybór Leasing operacyjny/Pożyczka - przełączanie działa", async ({ page }) => {
  48 |     const href = await goToFirstListing(page);
  49 |     test.skip(!href, "Brak ogłoszeń do przetestowania");
  50 |     const leasingBtn = page.getByRole("button", { name: "Leasing operacyjny" });
  51 |     const pozyczkaBtn = page.getByRole("button", { name: "Pożyczka" });
  52 |     if (await leasingBtn.count() > 0) {
  53 |       await expect(page.getByText(/Wykup/i)).toBeVisible();
  54 |       await pozyczkaBtn.click();
  55 |       await expect(page.getByText(/Wykup/i)).not.toBeVisible();
  56 |       await leasingBtn.click();
  57 |       await expect(page.getByText(/Wykup/i)).toBeVisible();
  58 |     }
  59 |   });
  60 | 
  61 |   test("przycisk Zapytaj o ten pojazd prowadzi do /kontakt z parametrami", async ({ page }) => {
  62 |     const href = await goToFirstListing(page);
  63 |     test.skip(!href, "Brak ogłoszeń do przetestowania");
  64 |     const cta = page.getByRole("link", { name: /Zapytaj o ten pojazd/i });
  65 |     await expect(cta).toBeVisible();
  66 |     const ctaHref = await cta.getAttribute("href");
  67 |     expect(ctaHref).toContain("/kontakt?");
  68 |   });
  69 | });
  70 | 
```