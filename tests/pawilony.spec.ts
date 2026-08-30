import { test, expect } from "@playwright/test";

test.describe("/pawilony - lista", () => {
  test("strona się ładuje z nagłówkiem i 5 realizacjami + kafelek własnego projektu", async ({ page }) => {
    await page.goto("/pawilony");
    await expect(page.getByRole("heading", { name: "Pawilony i kontenery na zamówienie" })).toBeVisible();
    await expect(page.getByText("Domek całoroczny 35m² z antresolą")).toBeVisible();
    await expect(page.getByText("Dom modułowy 40m²")).toBeVisible();
    await expect(page.getByText("Pawilon biurowy 24m²")).toBeVisible();
    await expect(page.getByText("Pawilon gastronomiczny 18m²")).toBeVisible();
    await expect(page.getByText("Domek modułowy 42m² z elewacją palisandrową")).toBeVisible();
    await expect(page.getByText("Twój własny projekt")).toBeVisible();
  });

  test("kafelek Twój własny projekt prowadzi do /kontakt", async ({ page }) => {
    await page.goto("/pawilony");
    await page.getByRole("link", { name: "Zapytaj o wycenę" }).click();
    await expect(page).toHaveURL(/\/kontakt/);
  });

  test("kliknięcie w realizację przenosi do strony szczegółowej", async ({ page }) => {
    await page.goto("/pawilony");
    await page.getByText("Domek całoroczny 35m² z antresolą").click();
    await expect(page).toHaveURL(/\/pawilony\/domek-caloroczny-35m2-z-antresola/);
  });
});

test.describe("/pawilony/[slug] - strona szczegółowa + PawilonCalculator", () => {
  test("realizacja z realną ceną - okruszki, karuzela, dane obiektu, wyposażenie", async ({ page }) => {
    await page.goto("/pawilony/domek-caloroczny-35m2-z-antresola");
    await expect(page.getByText("Strona główna")).toBeVisible();
    await expect(page.getByText("Pawilony", { exact: true })).toBeVisible();
    await expect(page.locator("h1")).toContainText("Domek całoroczny");
    await expect(page.getByRole("heading", { name: "Dane obiektu" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Wyposażenie" })).toBeVisible();
  });

  test("kalkulator: Leasing operacyjny pokazuje TYLKO 48/60 msc, bez suwaka wykupu", async ({ page }) => {
    await page.goto("/pawilony/domek-caloroczny-35m2-z-antresola");
    await expect(page.getByRole("button", { name: "48 miesięcy" })).toBeVisible();
    await expect(page.getByRole("button", { name: "60 miesięcy" })).toBeVisible();
    await expect(page.getByText(/Wykup/i)).not.toBeVisible();
  });

  test("kalkulator: Pożyczka pokazuje suwak okresu 24-72 msc", async ({ page }) => {
    await page.goto("/pawilony/domek-caloroczny-35m2-z-antresola");
    await page.getByRole("button", { name: "Pożyczka" }).click();
    await expect(page.getByText("24")).toBeVisible();
    await expect(page.getByText("72")).toBeVisible();
  });

  test("przycisk CTA mówi Zapytaj o ten obiekt (nie pojazd)", async ({ page }) => {
    await page.goto("/pawilony/domek-caloroczny-35m2-z-antresola");
    await expect(page.getByRole("link", { name: "Zapytaj o ten obiekt" })).toBeVisible();
  });

  test("nowa realizacja (placeholder) pokazuje żółte ostrzeżenie o cenie", async ({ page }) => {
    await page.goto("/pawilony/dom-modulowy-40m2-10x4m");
    await expect(page.getByText(/UWAGA.*placeholder/i)).toBeVisible();
  });
});
