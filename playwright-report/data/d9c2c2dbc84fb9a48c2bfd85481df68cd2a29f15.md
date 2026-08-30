# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-crud.spec.ts >> Panel admina - CRUD ogłoszeń >> dodanie nowego ogłoszenia, weryfikacja na liście, usunięcie
- Location: tests\admin-crud.spec.ts:5:7

# Error details

```
Error: Brak ADMIN_EMAIL/ADMIN_PASSWORD w .env.test - testy panelu admina wymagaja tych zmiennych.
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