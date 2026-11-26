$ErrorActionPreference = "Stop"
$root = "C:\Users\pziol\fidens"
Set-Location $root
$enc = New-Object System.Text.UTF8Encoding $false
$l = [string][char]0x142

# 1. HeroSearch.tsx z Downloads (kontrola sumy)
$expected = "570fc8b62f7d363f264256e2480695c5641fe448621f2a0b75815ff1fdcc6740"
$src = Join-Path $env:USERPROFILE "Downloads\HeroSearch.tsx"
if (-not (Test-Path $src)) { throw "Brak $src - pobierz plik HeroSearch.tsx" }
$h = (Get-FileHash $src -Algorithm SHA256).Hash.ToLower()
if ($h -ne $expected) { throw "Zla suma HeroSearch.tsx ($h) - pobierz ponownie" }

$files = @{}
function Get-Txt($rel) {
  if (-not $files.ContainsKey($rel)) { $files[$rel] = [System.IO.File]::ReadAllText((Join-Path $root $rel)) }
  return $files[$rel]
}
function PatchLit($rel, $old, $new, $count) {
  $t = Get-Txt $rel
  $n = ($t.Split(@($old), [System.StringSplitOptions]::None)).Count - 1
  if ($n -ne $count) { throw "BLAD $rel : '$old' znaleziono $n (oczekiwano $count)" }
  $files[$rel] = $t.Replace($old, $new)
  Write-Host "OK: $rel ($n)"
}
function PatchRx($rel, $pattern, $new, $count) {
  $t = Get-Txt $rel
  $n = [regex]::Matches($t, $pattern).Count
  if ($n -ne $count) { throw "BLAD $rel : wzorzec znaleziono $n (oczekiwano $count): $pattern" }
  $files[$rel] = [regex]::Replace($t, $pattern, $new)
  Write-Host "OK: $rel ($n)"
}

# 2. calculator.ts
$calc = @'
function calcShowcase(cenaPln: number, isMarza: boolean, wplataProc: number): number {
  const hasWykup = !isMarza
  const wykupProc = hasWykup ? getWykupLimits(SHOWCASE_OKRES_MSC).max : 0
  // Dla VAT-23 (leasing) rata liczona jest od ceny netto (cena bez VAT) -
  // tak wyglada realny leasing dla firm, ktore odliczaja VAT. Dla VAT-marza
  // (pozyczka) nie ma podzialu netto/brutto, liczymy od pelnej ceny.
  const cenaDoWyliczenia = hasWykup ? getNettoPrice(cenaPln) : cenaPln
  return calculateRata(cenaDoWyliczenia, wplataProc, SHOWCASE_OKRES_MSC, wykupProc, hasWykup)
}

export function calculateShowcaseRate(cenaPln: number, isMarza: boolean): number {
  return calcShowcase(cenaPln, isMarza, SHOWCASE_WPLATA_PROC)
}

// Rata przy konkretnej wplacie wlasnej w zlotych (brutto), ograniczonej do WPLATA_MAX % ceny.
export function calculateRateWithDownPayment(cenaPln: number, isMarza: boolean, wplataPln: number): number {
  if (!(cenaPln > 0)) return 0
  const proc = Math.min(Math.max((wplataPln / cenaPln) * 100, 0), WPLATA_MAX)
  return calcShowcase(cenaPln, isMarza, proc)
}
'@
PatchRx "lib\leasing\calculator.ts" '(?s)export function calculateShowcaseRate.*\z' $calc 1

# 3. app/page.tsx - dane dla hero (tylko osobowe/dostawcze)
$heroBlock = @'
  const { data: heroData } = await supabase
    .from("listings")
    .select("brand, model, price_pln, vat_type")
    .eq("status", "active")
    .eq("vehicle_type", "osobowe_dostawcze");
  const heroListings: HeroListing[] = (
    (heroData || []) as { brand: string | null; model: string | null; price_pln: number | null; vat_type: string | null }[]
  )
    .filter((row) => row.brand && row.model && row.price_pln)
    .map((row) => ({
      b: row.brand as string,
      m: row.model as string,
      p: row.price_pln as number,
      v: row.vat_type === "marza",
    }));
  const heroSlides = getActiveSlides();
'@
PatchRx "app\page.tsx" '(?s)  const \{ data: heroData \} = await supabase.*?  const heroSlides = getActiveSlides\(\);\r?\n' ($heroBlock + "`n") 1

# 4. app/ogloszenia/page.tsx - wplata wlasna
$op = "app\ogloszenia\page.tsx"
PatchLit $op 'import { calculateShowcaseRate } from "@/lib/leasing/calculator"' 'import { calculateShowcaseRate, calculateRateWithDownPayment } from "@/lib/leasing/calculator"' 1
PatchRx $op '(    rata_max\?: string)(\r?\n)' ('$1$2    wplata?: string$2') 1
PatchRx $op '(  const rataMax = Number\(params\.rata_max\) > 0 \? Number\(params\.rata_max\) : null)(\r?\n)' ('$1$2  const wplata = Number(params.wplata) > 0 ? Number(params.wplata) : null$2') 1
PatchLit $op 'rate: row.price_pln ? calculateShowcaseRate(row.price_pln, row.vat_type === "marza") : null,' 'rate: row.price_pln
      ? wplata
        ? calculateRateWithDownPayment(row.price_pln, row.vat_type === "marza", wplata)
        : calculateShowcaseRate(row.price_pln, row.vat_type === "marza")
      : null,' 1
PatchLit $op '/msc{!auto.is_marza && " netto"}</span>' '/msc{!auto.is_marza && " netto"}</span>
                        {wplata && (
                          <span className="block text-[12px] font-normal" style={{ color: "#888" }}>przy wp&#322;acie {formatNumber(wplata)} z&#322;</span>
                        )}' 1
$hdr = @'
          {wplata && (
            <p className="text-sm mb-1" style={{ color: "#888" }}>
              Wp&#322;ata w&#322;asna: {formatNumber(wplata)} z&#322;
            </p>
          )}
'@
PatchRx $op '(Maksymalna rata: \{formatNumber\(rataMax\)\} z&#322;/msc\r?\n\s*</p>\r?\n\s*\)\}\r?\n)' ('$1' + $hdr) 1

# 5. slajd maszyn -> wszystkie ogloszenia
PatchLit "lib\config\hero-slides.ts" '/ogloszenia?kategoria=maszyna"' '/ogloszenia"' 1

# 6. Navbar - wyrozniony przycisk
$btn = '<Link href="/ogloszenia" className="text-[#F0A500] text-[14px] font-semibold border border-[#F0A500] rounded-md px-4 py-[7px] transition-colors hover:bg-[#F0A500] hover:text-[#1B2A4A]">Wszystkie og&#322;oszenia</Link>'
PatchRx "app\components\Navbar.tsx" '<Link href="/ogloszenia" style=\{\{ color: "rgba\(255,255,255,0\.8\)", fontSize: "14px" \}\}>Og.oszenia</Link>' $btn 1
PatchRx "app\components\Navbar.tsx" '(?m)^( +)Og.oszenia(\r?)$' '$1Wszystkie og&#322;oszenia$2' 1

# 7. test navbar
PatchRx "tests\navbar.spec.ts" 'name: "Og.oszenia", exact: true' ('name: "Wszystkie og' + $l + 'oszenia", exact: true') 3

# 8. test strony glownej
$spec = @'
import { test, expect } from "@playwright/test"

test.describe("Strona glowna - hero", () => {
  test("naglowek i wyszukiwarka bez zakladek", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Leasing samochod/)
    await expect(page.getByLabel("Marka")).toBeVisible()
    await expect(page.getByRole("tablist")).toHaveCount(0)
    const search = page.getByRole("link", { name: /Poka. oferty/ })
    await expect(search).toHaveAttribute("href", /kategoria=osobowe_dostawcze/)
    await expect(page.getByRole("link", { name: /wszystkie kategorie/i })).toHaveAttribute("href", "/ogloszenia")
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
'@
$files["tests\homepage.spec.ts"] = $spec

# zapis wszystkiego dopiero po udanych sprawdzeniach
foreach ($k in $files.Keys) { [System.IO.File]::WriteAllText((Join-Path $root $k), $files[$k], $enc) }
Copy-Item $src (Join-Path $root "app\components\HeroSearch.tsx") -Force
Write-Host "Zapisano. Sprawdzam typy..."
npx tsc --noEmit
Write-Host "Gotowe"
