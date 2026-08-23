"use client"

import { useState, useMemo, useEffect } from "react"

interface LeasingCalculatorProps {
  price: number
  isMarza: boolean
  slug: string
  brand: string | null
  model: string | null
}

const OKRES_MIN = 24
const OKRES_MAX = 72
const WPLATA_MIN = 0
const WPLATA_MAX = 45
const APR_MIN = 5.2
const APR_MAX = 6.2

function getWykupLimits(okres: number): { min: number; max: number } {
  if (okres <= 24) return { min: 16, max: 55 }
  if (okres <= 36) return { min: 1, max: 45 }
  if (okres <= 48) return { min: 1, max: 40 }
  if (okres <= 60) return { min: 1, max: 35 }
  return { min: 1, max: 30 }
}

function getAPR(wplataProc: number, okresMsc: number, wykupProc: number, hasWykup: boolean): number {
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

function calculateRata(cena: number, wplataProc: number, okresMsc: number, wykupProc: number, hasWykup: boolean): number {
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

function formatNumber(n: number): string {
  return Math.round(n).toLocaleString("pl-PL").replace(/,/g, " ")
}

export default function LeasingCalculator({ price, isMarza, slug, brand, model }: LeasingCalculatorProps) {
  const [wplataProc, setWplataProc] = useState(20)
  const [okresMsc, setOkresMsc] = useState(48)
  const [wykupProc, setWykupProc] = useState(10)
  const hasWykup = !isMarza

  useEffect(() => {
    if (!hasWykup) return
    const { min, max } = getWykupLimits(okresMsc)
    if (wykupProc < min) setWykupProc(min)
    else if (wykupProc > max) setWykupProc(max)
  }, [okresMsc, hasWykup, wykupProc])

  const rata = useMemo(() => calculateRata(price, wplataProc, okresMsc, wykupProc, hasWykup), [price, wplataProc, okresMsc, wykupProc, hasWykup])

  const wplataKwota = price * (wplataProc / 100)
  const wykupKwota = hasWykup ? price * (wykupProc / 100) : 0
  const wykupLimits = getWykupLimits(okresMsc)

  const kontaktParams = new URLSearchParams()
  if (brand) kontaktParams.set("marka", brand)
  if (model) kontaktParams.set("model", model)
  kontaktParams.set("slug", slug)
  kontaktParams.set("typ", hasWykup ? "leasing" : "pozyczka")
  kontaktParams.set("wstepna", String(wplataProc))
  kontaktParams.set("msc", String(okresMsc))
  if (hasWykup) kontaktParams.set("wykup", String(wykupProc))
  kontaktParams.set("rata", String(Math.round(rata)))
  const kontaktUrl = "/kontakt?" + kontaktParams.toString()

  const label = hasWykup ? "Kalkulator leasingu" : "Kalkulator pożyczki leasingowej"
  const vatLabel = isMarza ? "VAT marża" : "VAT 23%"

  return (
    <div>
      <div className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: "#888" }}>{label}</div>
      <div className="text-xs mb-1" style={{ color: "#888" }}>Rata miesięczna</div>
      <div className="font-bold leading-none mb-1" style={{ color: "#1B2A4A", fontSize: "44px" }}>{formatNumber(rata)} zł<span className="text-base font-normal ml-1" style={{ color: "#888" }}>/msc</span></div>
      <div className="text-xs mb-5" style={{ color: "#aaa" }}>Cena pojazdu: {formatNumber(price)} zł &middot; {vatLabel}</div>
      <div style={{ borderTop: "0.5px solid #e8eaed", paddingTop: "16px" }}>
        <div className="mb-4">
          <div className="flex justify-between items-baseline mb-2"><label className="text-sm font-semibold" style={{ color: "#1B2A4A" }}>Wpłata wstępna</label><div className="text-sm font-bold" style={{ color: "#1B2A4A" }}>{wplataProc}% <span className="font-normal" style={{ color: "#888" }}>({formatNumber(wplataKwota)} zł)</span></div></div>
          <input type="range" min={0} max={45} step={1} value={wplataProc} onChange={(e) => setWplataProc(Number(e.target.value))} className="w-full" style={{ accentColor: "#F0A500" }} />
          <div className="flex justify-between text-xs mt-0.5" style={{ color: "#aaa" }}><span>0%</span><span>45%</span></div>
        </div>
        <div className="mb-4">
          <div className="flex justify-between items-baseline mb-2"><label className="text-sm font-semibold" style={{ color: "#1B2A4A" }}>Okres</label><div className="text-sm font-bold" style={{ color: "#1B2A4A" }}>{okresMsc} <span className="font-normal" style={{ color: "#888" }}>miesięcy</span></div></div>
          <input type="range" min={24} max={72} step={12} value={okresMsc} onChange={(e) => setOkresMsc(Number(e.target.value))} className="w-full" style={{ accentColor: "#F0A500" }} />
          <div className="flex justify-between text-xs mt-0.5" style={{ color: "#aaa" }}><span>24</span><span>36</span><span>48</span><span>60</span><span>72</span></div>
        </div>
        {hasWykup ? (<div className="mb-5"><div className="flex justify-between items-baseline mb-2"><label className="text-sm font-semibold" style={{ color: "#1B2A4A" }}>Wykup</label><div className="text-sm font-bold" style={{ color: "#1B2A4A" }}>{wykupProc}% <span className="font-normal" style={{ color: "#888" }}>({formatNumber(wykupKwota)} zł)</span></div></div><input type="range" min={wykupLimits.min} max={wykupLimits.max} step={1} value={wykupProc} onChange={(e) => setWykupProc(Number(e.target.value))} className="w-full" style={{ accentColor: "#F0A500" }} /><div className="flex justify-between text-xs mt-0.5" style={{ color: "#aaa" }}><span>{wykupLimits.min}%</span><span>{wykupLimits.max}%</span></div></div>) : null}
      </div>
      <a href={kontaktUrl} className="block text-center w-full font-bold rounded-lg py-3.5 px-6 text-sm no-underline hover:opacity-90 transition-opacity" style={{ backgroundColor: "#F0A500", color: "#1B2A4A" }}>Zapytaj o ten pojazd</a>
      <p className="text-xs leading-relaxed mt-3" style={{ color: "#aaa" }}>Kalkulacja orientacyjna. Ostateczna rata zależy od oferty banku.</p>
    </div>
  )
}
