import type { Page } from "@playwright/test";

export async function loginAsAdmin(page: Page) {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "Brak ADMIN_EMAIL/ADMIN_PASSWORD w .env.test - testy panelu admina wymagaja tych zmiennych."
    );
  }
  await page.goto("/admin/login");
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole("button", { name: /zaloguj/i }).click();
  await page.waitForURL(/\/admin\/ogloszenia/, { timeout: 10000 });
}
