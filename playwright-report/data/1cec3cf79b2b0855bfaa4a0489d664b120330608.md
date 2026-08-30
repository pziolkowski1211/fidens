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
    - locator resolved to <a href="/ogloszenia">Ogłoszenia</a>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <input value="" type="text" autocomplete="off" aria-expanded="false" aria-autocomplete="list" aria-label="Wyszukaj pojazd" placeholder="Szukaj marki lub modelu..." class="w-full bg-white/10 text-white placeholder:text-white/50 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:bg-white/15 focus:border-[#F0A500] transition-colors"/> from <div class="jsx-8ade039f1f9907a7 hidden lg:block absolute left-1/2 -translate-x-1/2">…</div> subtree intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <input value="" type="text" autocomplete="off" aria-expanded="false" aria-autocomplete="list" aria-label="Wyszukaj pojazd" placeholder="Szukaj marki lub modelu..." class="w-full bg-white/10 text-white placeholder:text-white/50 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:bg-white/15 focus:border-[#F0A500] transition-colors"/> from <div class="jsx-8ade039f1f9907a7 hidden lg:block absolute left-1/2 -translate-x-1/2">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 100ms
    54 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <input value="" type="text" autocomplete="off" aria-expanded="false" aria-autocomplete="list" aria-label="Wyszukaj pojazd" placeholder="Szukaj marki lub modelu..." class="w-full bg-white/10 text-white placeholder:text-white/50 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:bg-white/15 focus:border-[#F0A500] transition-colors"/> from <div class="jsx-8ade039f1f9907a7 hidden lg:block absolute left-1/2 -translate-x-1/2">…</div> subtree intercepts pointer events
     - retrying click action
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
    - generic [ref=e16]:
      - heading "Finansowanie pojazdów i maszyn budowlanych" [level=1] [ref=e17]
      - paragraph [ref=e18]: Leasing, kredyt, wynajem — szybka decyzja kredytowa. Ty wybierasz pojazd, my zajmujemy się resztą.
    - generic [ref=e20]:
      - generic [ref=e21]:
        - heading "Ogłoszenie tygodnia" [level=2] [ref=e22]
        - generic [ref=e23]: Wyróżnione
      - link "BMW 5 Series 530d xDrive Ogłoszenie tygodnia BMW 5 Series 530d xDrive 2022 · 68 000 km · Diesel · Automatyczna od 2212 zł /miesiąc netto Sprawdź ofertę →" [ref=e24] [cursor=pointer]:
        - /url: /ogloszenia/bmw-5-series-530d-xdrive-2022
        - img "BMW 5 Series 530d xDrive" [ref=e26]
        - generic [ref=e27]:
          - generic [ref=e28]: Ogłoszenie tygodnia
          - heading "BMW 5 Series 530d xDrive" [level=3] [ref=e29]
          - paragraph [ref=e30]: 2022 · 68 000 km · Diesel · Automatyczna
          - generic [ref=e31]:
            - text: od 2212 zł
            - generic [ref=e32]: /miesiąc netto
          - generic [ref=e33]: Sprawdź ofertę →
    - generic [ref=e35]:
      - generic [ref=e36]:
        - heading "Najnowsze oferty" [level=2] [ref=e37]
        - link "Zobacz wszystkie →" [ref=e38] [cursor=pointer]:
          - /url: /ogloszenia
      - generic [ref=e39]:
        - link "Volvo XC 90 B5 D AWD Geartronic Inscription Volvo XC 90 B5 D AWD Geartronic Inscription 2020 75 892 km od 1416 zł /msc netto" [ref=e40] [cursor=pointer]:
          - /url: /ogloszenia/volvo-xc-90-b5-d-awd-geartronic-inscription
          - img "Volvo XC 90 B5 D AWD Geartronic Inscription" [ref=e42]
          - generic [ref=e43]:
            - generic [ref=e44]: Volvo XC 90 B5 D AWD Geartronic Inscription
            - generic [ref=e45]:
              - generic [ref=e46]: "2020"
              - generic [ref=e50]: 75 892 km
            - generic [ref=e54]:
              - text: od 1416 zł
              - generic [ref=e55]: /msc netto
        - link "Volkswagen Arteon 2.0 TSI R-Line DSG Volkswagen Arteon 2.0 TSI R-Line DSG 2019 124 977 km od 972 zł /msc" [ref=e56] [cursor=pointer]:
          - /url: /ogloszenia/volkswagen-arteon-2-0-tsi-r-line-dsg
          - img "Volkswagen Arteon 2.0 TSI R-Line DSG" [ref=e58]
          - generic [ref=e59]:
            - generic [ref=e60]: Volkswagen Arteon 2.0 TSI R-Line DSG
            - generic [ref=e61]:
              - generic [ref=e62]: "2019"
              - generic [ref=e66]: 124 977 km
            - generic [ref=e70]: od 972 zł /msc
        - link "Porsche Panamera Turbo E-Hybrid PHEV Porsche Panamera Turbo E-Hybrid PHEV 2025 10 km od 8537 zł /msc netto" [ref=e71] [cursor=pointer]:
          - /url: /ogloszenia/porsche-panamera-turbo-e-hybrid-phev
          - img "Porsche Panamera Turbo E-Hybrid PHEV" [ref=e73]
          - generic [ref=e74]:
            - generic [ref=e75]: Porsche Panamera Turbo E-Hybrid PHEV
            - generic [ref=e76]:
              - generic [ref=e77]: "2025"
              - generic [ref=e81]: 10 km
            - generic [ref=e85]:
              - text: od 8537 zł
              - generic [ref=e86]: /msc netto
    - generic [ref=e88]:
      - heading "Jak to działa?" [level=2] [ref=e89]
      - generic [ref=e90]:
        - generic [ref=e91]:
          - generic [ref=e92]: "1"
          - generic [ref=e93]: Złóż zapytanie online
        - generic [ref=e94]:
          - generic [ref=e95]: "2"
          - generic [ref=e96]: Decyzja w 60 minut
        - generic [ref=e97]:
          - generic [ref=e98]: "3"
          - generic [ref=e99]: Podpisz umowę
        - generic [ref=e100]:
          - generic [ref=e101]: "4"
          - generic [ref=e102]: Wpłać opłatę wstępną
        - generic [ref=e103]:
          - generic [ref=e104]: "5"
          - generic [ref=e105]: Rejestrujemy i ubezpieczamy
        - generic [ref=e106]:
          - generic [ref=e107]: "6"
          - generic [ref=e108]: Pojazd gotowy do drogi
    - generic [ref=e110]:
      - heading "Opinie klientów" [level=2] [ref=e111]
      - generic [ref=e112]:
        - generic [ref=e113]:
          - generic [ref=e114]: ★★★★★
          - paragraph [ref=e115]: "\"Ekspresowa decyzja, zero stresu. Polecam każdemu przedsiębiorcy.\""
          - generic [ref=e116]: Marek K., Warszawa
        - generic [ref=e117]:
          - generic [ref=e118]: ★★★★★
          - paragraph [ref=e119]: "\"Wszystko załatwione w jeden dzień. Auto stało pod domem następnego dnia.\""
          - generic [ref=e120]: Tomasz W., Kraków
        - generic [ref=e121]:
          - generic [ref=e122]: ★★★★★
          - paragraph [ref=e123]: "\"Profesjonalne podejście, najlepsza oferta leasingu jaką znalazłem.\""
          - generic [ref=e124]: Anna P., Wrocław
    - generic [ref=e126]:
      - generic [ref=e127]: FIDENS
      - generic [ref=e128]:
        - link "Poznaj Fidens" [ref=e129] [cursor=pointer]:
          - /url: /o-nas
        - link "Leasing" [ref=e130] [cursor=pointer]:
          - /url: /leasing
        - link "Kontakt" [ref=e131] [cursor=pointer]:
          - /url: /kontakt
        - link "Regulamin" [ref=e132] [cursor=pointer]:
          - /url: /regulamin
        - link "Polityka prywatności" [ref=e133] [cursor=pointer]:
          - /url: /polityka
      - generic [ref=e134]: (c) 2026 Fidens. Wszelkie prawa zastrzeżone.
  - button "Open Next.js Dev Tools" [ref=e140] [cursor=pointer]
  - alert [ref=e144]
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