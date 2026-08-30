import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers";

test.describe("Panel admina - CRUD ogłoszeń", () => {
  test("dodanie nowego ogłoszenia, weryfikacja na liście, usunięcie", async ({ page }) => {
    const uniqueId = Date.now();
    const testTitle = `PLAYWRIGHT TEST ${uniqueId}`;
    const testSlug = `playwright-test-${uniqueId}`;

    await loginAsAdmin(page);
    await page.goto("/admin/ogloszenia/nowe");

    async function fillByLabel(labelText: string, value: string) {
      const input = page
        .locator(`label:has-text("${labelText}")`)
        .locator("xpath=following-sibling::input[1]");
      await input.fill(value);
    }

    await fillByLabel("Tytuł", testTitle);
    await fillByLabel("Slug", testSlug);
    await fillByLabel("Marka", "TestMarka");
    await fillByLabel("Model", "TestModel");
    await fillByLabel("Rok", "2024");

    await page.getByRole("button", { name: /zapisz/i }).click();

    await page.waitForURL(/\/admin\/ogloszenia\/[a-f0-9-]+/, { timeout: 10000 });

    await page.goto("/admin/ogloszenia");
    await expect(page.getByText(testTitle)).toBeVisible();

    await page.getByText(testTitle).click();
    await page.waitForURL(/\/admin\/ogloszenia\/[a-f0-9-]+/, { timeout: 10000 });

    const deleteBtn = page.getByRole("button", { name: /usuń/i });
    await deleteBtn.click();

    const confirmBtn = page.getByRole("button", { name: /usuń|potwierdź|tak/i }).last();
    await confirmBtn.click();

    await page.waitForURL(/\/admin\/ogloszenia$/, { timeout: 10000 });
    await expect(page.getByText(testTitle)).not.toBeVisible();
  });

  test("lista ogłoszeń w panelu się ładuje", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/ogloszenia");
    await expect(page.getByRole("heading", { name: /ogłoszenia/i }).first()).toBeVisible();
  });
});
