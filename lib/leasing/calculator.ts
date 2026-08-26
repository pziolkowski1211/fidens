// lib/leasing/calculator.ts
// Wspolny wzor liczenia raty leasingu/pozyczki - uzywany przez
// LeasingCalculator.tsx (interaktywny kalkulator) oraz karty ogloszen
// (statyczne "od X zl" liczone wariantem realistycznym).

export const OKRES_MIN = 24
export const OKRES_MAX = 72
export const WPLATA_MIN = 0
export const WPLATA_MAX = 45
export const APR_MIN = 5.4
export const VAT_RATE = 0.23
export const APR_MAX = 7.3

export function getWykupLimits(okres: number): { min: number; max: number } {
  if (okres <= 24) return { min: 16, max: 55 }
  if (okres <= 36) return { min: 1, max: 45 }
  if (okres <= 48) return { min: 1, max: 40 }
  if (okres <= 60) return { min: 1, max: 35 }
  return { min: 1, max: 30 }
}

export function getAPR(wplataProc: number, okresMsc: number, wykupProc: number, hasWykup: boolean): number {
  const wplataScore = 1 - (wplataProc - WPLATA_MIN) / (WPLATA_MAX - WPLATA_MIN)
  const okresScore = (okresMsc - OKRES_MIN) / (OKRES_MAX - OKRES_MIN)
  let score: number
  if (hasWykup) {
    const wykupLimits = getWykupLimits(okresMsc)
    const wykupRange = wykupLimits.max - wykupLimits.min
    const wykupScore = wykupRange > 0 ? (wykupProc - wykupLimits.min) / wykupRange : 0
    score = (wplataScore + okresScore + wykupScore) / 3
  } else {
    score = (wplataScore + okresScore) / 2
  }
  const apr = APR_MIN + score * (APR_MAX - APR_MIN)
  return apr / 100
}

export function calculateRata(cena: number, wplataProc: number, okresMsc: number, wykupProc: number, hasWykup: boolean): number {
  const wplata = cena * (wplataProc / 100)
  const wykup = hasWykup ? cena * (wykupProc / 100) : 0
  const kapital = cena - wplata
  const aprRoczne = getAPR(wplataProc, okresMsc, wykupProc, hasWykup)
  const r = aprRoczne / 12
  if (r === 0) return (kapital - wykup) / okresMsc
  const factor = Math.pow(1 + r, okresMsc)
  const pv = kapital - wykup / factor
  return (pv * r) / (1 - 1 / factor)
}

// Rata "od X zl" pokazywana na kartach ogloszen (poza strona pojedynczego
// ogloszenia, gdzie klient sam suwa parametry).
// Wariant B (realistyczny, zatwierdzony z klientem): wplata 20%, okres 60 msc,
// wykup maksymalny dla tego okresu (najkorzystniejsza/najnizsza rata jaka
// uczciwie mozna pokazac - bez zawyzania oczekiwan jak przy wariancie
// agresywnym).
const SHOWCASE_WPLATA_PROC = 20
const SHOWCASE_OKRES_MSC = 60

export function getNettoPrice(cenaBrutto: number): number {
  return cenaBrutto / (1 + VAT_RATE)
}

export function calculateShowcaseRate(cenaPln: number, isMarza: boolean): number {
  const hasWykup = !isMarza
  const wykupProc = hasWykup ? getWykupLimits(SHOWCASE_OKRES_MSC).max : 0
  // Dla VAT-23 (leasing) rata liczona jest od ceny netto (cena bez VAT) -
  // tak wyglada realny leasing dla firm, ktore odliczaja VAT. Dla VAT-marza
  // (pozyczka) nie ma podzialu netto/brutto, liczymy od pelnej ceny.
  const cenaDoWyliczenia = hasWykup ? getNettoPrice(cenaPln) : cenaPln
  return calculateRata(cenaDoWyliczenia, SHOWCASE_WPLATA_PROC, SHOWCASE_OKRES_MSC, wykupProc, hasWykup)
}
