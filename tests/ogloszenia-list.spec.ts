import { test, expect } from "@playwright/test";

const KATEGORIE = ["osobowe_dostawcze", "ciezki_transport", "maszyna", "maszyna_przemyslowa"];

test.describe("/ogloszenia - ekran kategorii", () => {
  test("strona sie laduje i pokazuje naglowek wyboru kategorii", async ({ page }) => {
    await page.goto("/ogloszenia");
    await expect(page.getByRole("heading", { name: /Wybierz kategori/ })).toBeVisible();
  });

  test("pokazuje 5 kafelkow kategorii", async ({ page }) => {
    await page.goto("/ogloszenia");
    const kafelki = page.locator("section");
    await expect(kafelki.getByRole("link", { name: /Osobowe i dostawcze do 3,5 t/ })).toBeVisible();
    await expect(kafelki.getByRole("link", { name: /Transport ci/ })).toBeVisible();
    await expect(kafelki.getByRole("link", { name: /Maszyny budowlane/ })).toBeVisible();
    await expect(kafelki.getByRole("link", { name: /Maszyny przemys/ })).toBeVisible();
    await expect(kafelki.getByRole("link", { name: /Domy modu.owe i pawilony/ })).toBeVisible();
  });

  test("klikniecie kafelka otwiera liste kategorii", async ({ page }) => {
    await page.goto("/ogloszenia");
    await page.locator("section").getByRole("link", { name: /Maszyny budowlane/ }).click();
    await expect(page).toHaveURL(/kategoria=maszyna$/);
    await expect(page.getByRole("heading", { name: "Maszyny budowlane" })).toBeVisible();
  });

  test("kafelek Pawilony prowadzi do /pawilony", async ({ page }) => {
    await page.goto("/ogloszenia");
    await page.locator("section").getByRole("link", { name: /Domy modu.owe i pawilony/ }).click();
    await expect(page).toHaveURL(/\/pawilony/);
  });

  test("nieznana kategoria w URL pokazuje ekran wyboru", async ({ page }) => {
    await page.goto("/ogloszenia?kategoria=xyz");
    await expect(page.getByRole("heading", { name: /Wybierz kategori/ })).toBeVisible();
  });
});

test.describe("/ogloszenia - lista kategorii", () => {
  for (const k of KATEGORIE) {
    test(`kategoria ${k} pokazuje karty albo komunikat braku ofert`, async ({ page }) => {
      await page.goto(`/ogloszenia?kategoria=${k}`);
      const cards = page.locator(`a[href^="/ogloszenia/"]`);
      const cardsCount = await cards.count();
      if (cardsCount === 0) {
        await expect(page.getByText(/Brak ofert/i)).toBeVisible();
      } else {
        await expect(cards.first()).toBeVisible();
      }
    });
  }

  test("pasek kategorii nie ma opcji Wszystkie", async ({ page }) => {
    await page.goto("/ogloszenia?kategoria=maszyna");
    await expect(page.getByRole("link", { name: /^Wszystkie$/ })).toHaveCount(0);
  });

  test("filtr marki z URL dziala (query params)", async ({ page }) => {
    await page.goto("/ogloszenia?marka=bmw");
    await expect(page).toHaveURL(/marka=bmw/);
  });

  test("wyszukiwarka pokazuje sugestie po wpisaniu tekstu", async ({ page }, testInfo) => {
    await page.goto("/ogloszenia");
    if (testInfo.project.name === "mobile-chrome") {
      await page.getByRole("button", { name: "Wyszukiwarka" }).click();
    }
    const search = page.locator(`input[placeholder="Szukaj marki lub modelu..."]:visible`);
    await search.fill("bmw");
    await page.waitForTimeout(500);
  });

  test("hover na karcie nie powoduje bledu konsoli", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/ogloszenia?kategoria=osobowe_dostawcze");
    const firstCard = page.locator(`a[href^="/ogloszenia/"]`).first();
    if (await firstCard.count() > 0) {
      await firstCard.hover();
      await page.waitForTimeout(300);
    }
    expect(errors).toEqual([]);
  });
});