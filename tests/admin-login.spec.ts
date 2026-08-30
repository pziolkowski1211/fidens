import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers";

test.describe("Panel admina - logowanie", () => {
  test("formularz logowania pokazuje pola email i hasło", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("złe dane logowania pokazują błąd, nie wpuszczają do panelu", async ({ page }) => {
    await page.goto("/admin/login");
    await page.locator('input[type="email"]').fill("zle-dane@example.com");
    await page.locator('input[type="password"]').fill("zlehaslo123");
    await page.getByRole("button", { name: /zaloguj/i }).click();
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("poprawne dane logowania wpuszczają do panelu ogłoszeń", async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page).toHaveURL(/\/admin\/ogloszenia/);
  });

  test("po zalogowaniu widoczny jest przycisk Wyloguj, i działa", async ({ page }) => {
    await loginAsAdmin(page);
    const wylogujBtn = page.getByRole("button", { name: /wyloguj/i });
    await expect(wylogujBtn).toBeVisible();
    await wylogujBtn.click();
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 10000 });
  });
});
