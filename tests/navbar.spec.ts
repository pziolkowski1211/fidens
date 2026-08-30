import { test, expect } from "@playwright/test";

test.describe("Navbar", () => {
  test("desktop - widoczne wszystkie linki i CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Ogłoszenia", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Pawilony", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Poznaj Fidens", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Kontakt", exact: true }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Zamów bezpłatną kalkulację" })).toBeVisible();
  });

  test("desktop - kliknięcie w Ogłoszenia przenosi do /ogloszenia", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Ogłoszenia", exact: true }).click();
    await expect(page).toHaveURL(/\/ogloszenia/);
  });

  test("desktop - kliknięcie w Pawilony przenosi do /pawilony", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Pawilony", exact: true }).click();
    await expect(page).toHaveURL(/\/pawilony/);
  });

  test("desktop - logo przenosi na stronę główną", async ({ page }) => {
    await page.goto("/ogloszenia");
    await page.getByRole("link").filter({ has: page.locator("img[alt*='FIDENS' i], img[alt*='Fidens' i]") }).first().click();
    await expect(page).toHaveURL("/");
  });

  test("navbar zostaje przyklejony po scrollowaniu", async ({ page }) => {
    await page.goto("/ogloszenia");
    const navbar = page.locator("nav").first();
    await expect(navbar).toBeVisible();
    await page.mouse.wheel(0, 1500);
    await expect(navbar).toBeInViewport();
  });

  test("mobile - menu hamburger pokazuje wszystkie linki", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /menu/i }).click();
    await expect(page.getByRole("link", { name: "Strona główna", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Ogłoszenia", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Pawilony", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Poznaj Fidens", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Kontakt", exact: true })).toBeVisible();
  });
});
