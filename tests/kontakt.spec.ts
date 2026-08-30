import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers";

async function cleanupTestRequest(page: import("@playwright/test").Page, testName: string) {
  await loginAsAdmin(page);
  await page.goto("/admin/zapytania");
  const row = page.locator(`text=${testName}`).locator("xpath=ancestor::*[self::tr or contains(@class,'rounded')][1]");
  const deleteBtn = row.getByRole("button", { name: /usuń/i });
  if (await deleteBtn.count() > 0) {
    await deleteBtn.click();
  }
}

test.describe("/kontakt - formularz", () => {
  test("wszystkie pola formularza są widoczne", async ({ page }) => {
    await page.goto("/kontakt");
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="nip"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
    await expect(page.locator('input[name="marketingConsent"]')).toBeVisible();
  });

  test("zgoda marketingowa jest odznaczona domyślnie", async ({ page }) => {
    await page.goto("/kontakt");
    await expect(page.locator('input[name="marketingConsent"]')).not.toBeChecked();
  });

  test("wysłanie formularza (BEZ zgody marketingowej) pokazuje podziękowanie, potem sprzątamy", async ({ page }) => {
    const uniqueId = Date.now();
    const testName = `PLAYWRIGHT TEST ${uniqueId}`;
    await page.goto("/kontakt");
    await page.locator('input[name="name"]').fill(testName);
    await page.locator('input[name="phone"]').fill("500000000");
    await page.locator('input[name="email"]').fill(`playwright-test-${uniqueId}@example.com`);
    await page.getByRole("button", { name: "Wyślij zapytanie" }).click();
    await expect(page.getByText("Dziękujemy!")).toBeVisible({ timeout: 10000 });

    await cleanupTestRequest(page, testName);
  });

  test("wysłanie formularza (ZE zgodą marketingową) pokazuje podziękowanie, potem sprzątamy", async ({ page }) => {
    const uniqueId = Date.now();
    const testName = `PLAYWRIGHT TEST zgoda ${uniqueId}`;
    await page.goto("/kontakt");
    await page.locator('input[name="name"]').fill(testName);
    await page.locator('input[name="phone"]').fill("500000000");
    await page.locator('input[name="email"]').fill(`playwright-test-consent-${uniqueId}@example.com`);
    await page.locator('input[name="marketingConsent"]').check();
    await page.getByRole("button", { name: "Wyślij zapytanie" }).click();
    await expect(page.getByText("Dziękujemy!")).toBeVisible({ timeout: 10000 });

    await cleanupTestRequest(page, testName);
  });

  test("email jest wymagany - formularz nie wysyła się bez niego", async ({ page }) => {
    await page.goto("/kontakt");
    await page.locator('input[name="name"]').fill("PLAYWRIGHT TEST bez email");
    await page.locator('input[name="phone"]').fill("500000000");
    await page.getByRole("button", { name: "Wyślij zapytanie" }).click();
    await expect(page.getByText("Dziękujemy!")).not.toBeVisible();
  });
});
