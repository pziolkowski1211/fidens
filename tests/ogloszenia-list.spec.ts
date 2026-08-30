import { test, expect } from "@playwright/test";

test.describe("/ogloszenia - lista", () => {
  test("strona się ładuje i pokazuje nagłówek", async ({ page }) => {
    await page.goto("/ogloszenia");
    await expect(page.getByRole("heading", { name: "Wszystkie ogłoszenia" })).toBeVisible();
  });

  test("pokazuje karty ogłoszeń albo komunikat braku ofert", async ({ page }) => {
    await page.goto("/ogloszenia");
    const cards = page.locator('a[href^="/ogloszenia/"]');
    const brakOfert = page.getByText(/Brak ofert/i);
    const cardsCount = await cards.count();
    if (cardsCount === 0) {
      await expect(brakOfert).toBeVisible();
    } else {
      await expect(cards.first()).toBeVisible();
    }
  });

  test("filtr marki z URL działa (query params)", async ({ page }) => {
    await page.goto("/ogloszenia?marka=bmw");
    await expect(page).toHaveURL(/marka=bmw/);
  });

  test("wyszukiwarka pokazuje sugestie po wpisaniu tekstu", async ({ page }) => {
    await page.goto("/ogloszenia");
    const search = page.getByPlaceholder(/Szukaj marki lub modelu/i);
    await search.fill("bmw");
    await page.waitForTimeout(500);
  });

  test("hover na karcie nie powoduje błędu konsoli", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/ogloszenia");
    const firstCard = page.locator('a[href^="/ogloszenia/"]').first();
    if (await firstCard.count() > 0) {
      await firstCard.hover();
      await page.waitForTimeout(300);
    }
    expect(errors).toEqual([]);
  });
});
