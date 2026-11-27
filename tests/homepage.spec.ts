import { test, expect } from "@playwright/test"

test.describe("Strona glowna - hero", () => {
  test("naglowek i wyszukiwarka bez zakladek", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Leasing samochod/)
    await expect(page.getByLabel("Marka")).toBeVisible()
    await expect(page.getByRole("tablist")).toHaveCount(0)
    const search = page.getByRole("link", { name: /Poka. oferty/ })
    await expect(search).toHaveAttribute("href", /kategoria=osobowe_dostawcze/)
    await expect(page.getByRole("link", { name: /Ci.*wszystkie og.oszenia/ })).toHaveAttribute("href", "/ogloszenia")
  })

  test("suwak wplaty wlasnej zmienia link wyszukiwania", async ({ page }) => {
    await page.goto("/")
    const slider = page.getByLabel(/Wp.ata w.asna/)
    await slider.focus()
    await page.keyboard.press("ArrowRight")
    await expect(page.getByRole("link", { name: /Poka. oferty/ })).toHaveAttribute("href", /wplata=5000/)
  })

  test("przelaczanie slajdow kropkami", async ({ page }) => {
    await page.goto("/")
    const dot = page.getByRole("button", { name: /Slajd 2/ })
    await dot.click()
    await expect(dot).toHaveAttribute("aria-current", "true")
  })

  test("lista ogloszen z limitem raty i wplata", async ({ page }) => {
    await page.goto("/ogloszenia?kategoria=osobowe_dostawcze&rata_max=1")
    await expect(page.getByText(/Maksymalna rata/)).toBeVisible()
    await expect(page.getByText(/Brak ofert/).first()).toBeVisible()
    await page.goto("/ogloszenia?kategoria=osobowe_dostawcze&wplata=50000")
    await expect(page.getByText(/Wp.ata w.asna/).first()).toBeVisible()
  })
})