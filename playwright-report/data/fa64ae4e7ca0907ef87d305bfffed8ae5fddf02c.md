# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: kontakt.spec.ts >> /kontakt - formularz >> wysłanie formularza (ZE zgodą marketingową) pokazuje podziękowanie, potem sprzątamy
- Location: tests\kontakt.spec.ts:43:7

# Error details

```
Error: Brak ADMIN_EMAIL/ADMIN_PASSWORD w .env.test - testy panelu admina wymagaja tych zmiennych.
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
      - heading "Dziękujemy!" [level=1] [ref=e19]
      - paragraph [ref=e20]: Skontaktujemy się z Tobą wkrótce.
    - generic [ref=e22]:
      - generic [ref=e23]: FIDENS
      - generic [ref=e24]:
        - link "Poznaj Fidens" [ref=e25] [cursor=pointer]:
          - /url: /o-nas
        - link "Leasing" [ref=e26] [cursor=pointer]:
          - /url: /leasing
        - link "Kontakt" [ref=e27] [cursor=pointer]:
          - /url: /kontakt
        - link "Regulamin" [ref=e28] [cursor=pointer]:
          - /url: /regulamin
        - link "Polityka prywatności" [ref=e29] [cursor=pointer]:
          - /url: /polityka
      - generic [ref=e30]: (c) 2026 Fidens. Wszelkie prawa zastrzeżone.
  - button "Open Next.js Dev Tools" [ref=e36] [cursor=pointer]
  - alert [ref=e40]
```

# Test source

```ts
  1  | ﻿import type { Page } from "@playwright/test";
  2  | 
  3  | export async function loginAsAdmin(page: Page) {
  4  |   const email = process.env.ADMIN_EMAIL;
  5  |   const password = process.env.ADMIN_PASSWORD;
  6  |   if (!email || !password) {
> 7  |     throw new Error(
     |           ^ Error: Brak ADMIN_EMAIL/ADMIN_PASSWORD w .env.test - testy panelu admina wymagaja tych zmiennych.
  8  |       "Brak ADMIN_EMAIL/ADMIN_PASSWORD w .env.test - testy panelu admina wymagaja tych zmiennych."
  9  |     );
  10 |   }
  11 |   await page.goto("/admin/login");
  12 |   await page.locator('input[type="email"]').fill(email);
  13 |   await page.locator('input[type="password"]').fill(password);
  14 |   await page.getByRole("button", { name: /zaloguj/i }).click();
  15 |   await page.waitForURL(/\/admin\/ogloszenia/, { timeout: 10000 });
  16 | }
  17 | 
```