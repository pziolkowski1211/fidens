"use client"

import { useState, useMemo, useEffect } from "react"
import { getWykupLimits, calculateRata, getNettoPrice } from "@/lib/leasing/calculator"

interface LeasingCalculatorProps {
  price: number
  isMarza: boolean
  slug: string
  brand: string | null
  model: string | null
}

function formatNumber(n: number): string {
  return Math.round(n).toLocaleString("pl-PL").replace(/,/g, " ")
}

export default function LeasingCalculator({ price, isMarza, slug, brand, model }: LeasingCalculatorProps) {
  const [financingChoice, setFinancingChoice] = useState<"leasing" | "pozyczka">(isMarza ? "pozyczka" : "leasing")
  const hasWykup = !isMarza && financingChoice === "leasing"

  const [wplataProc, setWplataProc] = useState(20)
  const [okresMsc, setOkresMsc] = useState(60)
  const [wykupProc, setWykupProc] = useState(() => (hasWykup ? getWykupLimits(60).max : 10))

  useEffect(() => {
    if (!hasWykup) return
    const { min, max } = getWykupLimits(okresMsc)
    if (wykupProc < min) setWykupProc(min)
    else if (wykupProc > max) setWykupProc(max)
  }, [okresMsc, hasWykup, wykupProc])

  const cenaDoWyliczenia = hasWykup ? getNettoPrice(price) : price
  const rata = useMemo(() => calculateRata(cenaDoWyliczenia, wplataProc, okresMsc, wykupProc, hasWykup), [cenaDoWyliczenia, wplataProc, okresMsc, wykupProc, hasWykup])
  const rataBrutto = useMemo(() => calculateRata(price, wplataProc, okresMsc, wykupProc, hasWykup), [price, wplataProc, okresMsc, wykupProc, hasWykup])

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
  const ratalabel = "Rata miesięczna"

  return (
    <div>
      <div className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: "#888" }}>{label}</div>

      {!isMarza && (
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setFinancingChoice("leasing")}
            className="flex-1 py-2 rounded-lg text-sm font-semibold transition-colors"
            style={
              financingChoice === "leasing"
                ? { backgroundColor: "#1B2A4A", color: "#fff", cursor: "pointer" }
                : { backgroundColor: "#f0f0f2", color: "#1B2A4A", cursor: "pointer" }
            }
          >
            Leasing operacyjny
          </button>
          <button
            type="button"
            onClick={() => setFinancingChoice("pozyczka")}
            className="flex-1 py-2 rounded-lg text-sm font-semibold transition-colors"
            style={
              financingChoice === "pozyczka"
                ? { backgroundColor: "#1B2A4A", color: "#fff", cursor: "pointer" }
                : { backgroundColor: "#f0f0f2", color: "#1B2A4A", cursor: "pointer" }
            }
          >
            Pożyczka
          </button>
        </div>
      )}

      <div className="text-xs mb-1" style={{ color: "#888" }}>{ratalabel}</div>
      <div className="font-bold leading-none mb-1" style={{ color: "#1B2A4A", fontSize: "44px" }}>{formatNumber(rata)} zł<span className="text-base font-normal ml-1" style={{ color: "#888" }}>/msc</span>{hasWykup && (<span className="text-base font-normal ml-1" style={{ color: "#888" }}>netto</span>)}</div>
      {hasWykup && (
        <div className="text-xs mb-1" style={{ color: "#aaa" }}>Rata brutto: {formatNumber(rataBrutto)} zł/msc</div>
      )}
      <div className="text-xs mb-5" style={{ color: "#aaa" }}>
        {hasWykup ? (
          <>Cena brutto: {formatNumber(price)} zł &middot; Cena netto: {formatNumber(cenaDoWyliczenia)} zł &middot; {vatLabel}</>
        ) : (
          <>Cena brutto: {formatNumber(price)} zł &middot; {vatLabel}</>
        )}
      </div>
      <div style={{ borderTop: "0.5px solid #e8eaed", paddingTop: "16px" }}>
        <div className="mb-4">
          <div className="flex justify-between items-baseline mb-2"><label className="text-sm font-semibold" style={{ color: "#1B2A4A" }}>Wpłata wstępna</label><div className="text-sm font-bold" style={{ color: "#1B2A4A" }}>{wplataProc}% <span className="font-normal" style={{ color: "#888" }}>({formatNumber(wplataKwota)} zł brutto)</span></div></div>
          <input type="range" min={0} max={45} step={1} value={wplataProc} onChange={(e) => setWplataProc(Number(e.target.value))} className="w-full" style={{accentColor: "#F0A500" }} />
          <div className="flex justify-between text-xs mt-0.5" style={{ color: "#aaa" }}><span>0%</span><span>45%</span></div>
        </div>
        <div className="mb-4">
          <div className="flex justify-between items-baseline mb-2"><label className="text-sm font-semibold" style={{ color: "#1B2A4A" }}>Okres</label><div className="text-sm font-bold" style={{ color: "#1B2A4A" }}>{okresMsc} <span className="font-normal" style={{ color: "#888" }}>miesięcy</span></div></div>
          <input type="range" min={24} max={72} step={12} value={okresMsc} onChange={(e) => setOkresMsc(Number(e.target.value))} className="w-full" style={{ accentColor: "#F0A500" }} />
          <div className="flex justify-between text-xs mt-0.5" style={{ color: "#aaa" }}><span>24</span><span>36</span><span>48</span><span>60</span><span>72</span></div>
        </div>
        {hasWykup ? (<div className="mb-5"><div className="flex justify-between items-baseline mb-2"><label className="text-sm font-semibold" style={{ color: "#1B2A4A" }}>Wykup</label><div className="text-sm font-bold" style={{ color: "#1B2A4A" }}>{wykupProc}% <span className="font-normal" style={{ color: "#888" }}>({formatNumber(wykupKwota)} zł brutto)</span></div></div><input type="range" min={wykupLimits.min} max={wykupLimits.max} step={1} value={wykupProc} onChange={(e) => setWykupProc(Number(e.target.value))} className="w-full" style={{ accentColor: "#F0A500" }} /><div className="flex justify-between text-xs mt-0.5" style={{ color: "#aaa" }}><span>{wykupLimits.min}%</span><span>{wykupLimits.max}%</span></div></div>) : null}
      </div>
      <a href={kontaktUrl} className="block text-center w-full font-bold rounded-lg py-3.5 px-6 text-sm no-underline hover:opacity-90 transition-opacity" style={{ backgroundColor: "#F0A500", color: "#1B2A4A" }}>Zapytaj o ten pojazd</a>
      <p className="text-xs leading-relaxed mt-3" style={{ color: "#aaa" }}>Kalkulacja orientacyjna. Ostateczna rata zależy od oferty banku.</p>
    </div>
  )
}



