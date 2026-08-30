import { test, expect } from "@playwright/test";

test.describe("/ogloszenia/[slug] - strona szczegółowa + kalkulator", () => {
  async function goToFirstListing(page: import("@playwright/test").Page) {
    await page.goto("/ogloszenia");
    const firstCard = page.locator(`a[href^="/ogloszenia/"]`).first();
    const count = await firstCard.count();
    if (count === 0) return null;
    const href = await firstCard.getAttribute("href");
    await firstCard.click();
    return href;
  }

  test("okruszki, tytuł i karuzela są widoczne", async ({ page }) => {
    const href = await goToFirstListing(page);
    test.skip(!href, "Brak ogłoszeń do przetestowania");
    const breadcrumb = page.locator("div.text-sm", { hasText: "Strona główna" });
    await expect(breadcrumb.getByText("Strona główna")).toBeVisible();
    await expect(breadcrumb.getByRole("link", { name: "Ogłoszenia", exact: true })).toBeVisible();
    await expect(page.locator("h1")).toBeVisible();
  });

  test("sekcja Dane pojazdu jest widoczna", async ({ page }) => {
    const href = await goToFirstListing(page);
    test.skip(!href, "Brak ogłoszeń do przetestowania");
    await expect(page.getByRole("heading", { name: "Dane pojazdu" })).toBeVisible();
  });

  test("opis nie pokazuje surowych gwiazdek Markdown", async ({ page }) => {
    const href = await goToFirstListing(page);
    test.skip(!href, "Brak ogłoszeń do przetestowania");
    const opisHeading = page.getByRole("heading", { name: "Opis" });
    if (await opisHeading.count() > 0) {
      const opisSection = opisHeading.locator("xpath=..");
      const text = await opisSection.textContent();
      expect(text).not.toContain("**");
    }
  });

  test("kalkulator pokazuje ratę i suwaki", async ({ page }) => {
    const href = await goToFirstListing(page);
    test.skip(!href, "Brak ogłoszeń do przetestowania");
    await expect(page.getByText(/Rata miesięczna/i)).toBeVisible();
    await expect(page.getByText(/Wpłata wstępna/i)).toBeVisible();
    await expect(page.getByText(/Okres/i).first()).toBeVisible();
  });

  test("jeśli jest wybór Leasing operacyjny/Pożyczka - przełączanie działa", async ({ page }) => {
    const href = await goToFirstListing(page);
    test.skip(!href, "Brak ogłoszeń do przetestowania");
    const leasingBtn = page.getByRole("button", { name: "Leasing operacyjny" });
    const pozyczkaBtn = page.getByRole("button", { name: "Pożyczka" });
    if (await leasingBtn.count() > 0) {
      await expect(page.getByText(/Wykup/i)).toBeVisible();
      await pozyczkaBtn.click();
      await expect(page.getByText(/Wykup/i)).not.toBeVisible();
      await leasingBtn.click();
      await expect(page.getByText(/Wykup/i)).toBeVisible();
    }
  });

  test("przycisk Zapytaj o ten pojazd prowadzi do /kontakt z parametrami", async ({ page }) => {
    const href = await goToFirstListing(page);
    test.skip(!href, "Brak ogłoszeń do przetestowania");
    const cta = page.getByRole("link", { name: /Zapytaj o ten pojazd/i });
    await expect(cta).toBeVisible();
    const ctaHref = await cta.getAttribute("href");
    expect(ctaHref).toContain("/kontakt?");
  });
});