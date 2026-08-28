"use client"
import { useState, useMemo } from "react"
import { calculateRata, getNettoPrice } from "@/lib/leasing/calculator"

interface PawilonCalculatorProps {
  price: number
  slug: string
  brand: string | null
  model: string | null
}

function formatNumber(n: number): string {
  return Math.round(n).toLocaleString("pl-PL").replace(/,/g, " ")
}

export default function PawilonCalculator({ price, slug, brand, model }: PawilonCalculatorProps) {
  const [financingChoice, setFinancingChoice] = useState<"leasing" | "pozyczka">("leasing")
  const [wplataProc, setWplataProc] = useState(20)
  const [okresLeasing, setOkresLeasing] = useState<48 | 60>(60)
  const [okresPozyczka, setOkresPozyczka] = useState(60)

  const okresMsc = financingChoice === "leasing" ? okresLeasing : okresPozyczka

  const cenaDoWyliczenia = financingChoice === "leasing" ? getNettoPrice(price) : price
  const rata = useMemo(() => calculateRata(cenaDoWyliczenia, wplataProc, okresMsc, 0, false), [cenaDoWyliczenia, wplataProc, okresMsc])
  const rataBrutto = useMemo(() => calculateRata(price, wplataProc, okresMsc, 0, false), [price, wplataProc, okresMsc])

  const wplataKwota = price * (wplataProc / 100)

  const kontaktParams = new URLSearchParams()
  if (brand) kontaktParams.set("marka", brand)
  if (model) kontaktParams.set("model", model)
  kontaktParams.set("slug", slug)
  kontaktParams.set("typ", financingChoice)
  kontaktParams.set("wstepna", String(wplataProc))
  kontaktParams.set("msc", String(okresMsc))
  kontaktParams.set("rata", String(Math.round(rata)))
  const kontaktUrl = "/kontakt?" + kontaktParams.toString()

  const label = financingChoice === "leasing" ? "Kalkulator leasingu operacyjnego" : "Kalkulator pożyczki"

  return (
    <div>
      <div className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: "#888" }}>{label}</div>

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

      <div className="text-xs mb-1" style={{ color: "#888" }}>Rata miesięczna</div>
      <div className="font-bold leading-none mb-1" style={{ color: "#1B2A4A", fontSize: "44px" }}>
        {formatNumber(rata)} zł
        <span className="text-base font-normal ml-1" style={{ color: "#888" }}>/msc</span>
        {financingChoice === "leasing" && (
          <span className="text-base font-normal ml-1" style={{ color: "#888" }}>netto</span>
        )}
      </div>
      {financingChoice === "leasing" && (
        <div className="text-xs mb-1" style={{ color: "#aaa" }}>Rata brutto: {formatNumber(rataBrutto)} zł/msc</div>
      )}
      <div className="text-xs mb-5" style={{ color: "#aaa" }}>
        {financingChoice === "leasing" ? (
          <>Cena brutto: {formatNumber(price)} zł &middot; Cena netto: {formatNumber(cenaDoWyliczenia)} zł &middot; VAT 23%</>
        ) : (
          <>Cena brutto: {formatNumber(price)} zł</>
        )}
      </div>

      <div style={{ borderTop: "0.5px solid #e8eaed", paddingTop: "16px" }}>
        <div className="mb-4">
          <div className="flex justify-between items-baseline mb-2">
            <label className="text-sm font-semibold" style={{ color: "#1B2A4A" }}>Wpłata wstępna</label>
            <div className="text-sm font-bold" style={{ color: "#1B2A4A" }}>
              {wplataProc}% <span className="font-normal" style={{ color: "#888" }}>({formatNumber(wplataKwota)} zł brutto)</span>
            </div>
          </div>
          <input type="range" min={0} max={45} step={1} value={wplataProc} onChange={(e) => setWplataProc(Number(e.target.value))} className="w-full" style={{ accentColor: "#F0A500", cursor: "pointer" }} />
          <div className="flex justify-between text-xs mt-0.5" style={{ color: "#aaa" }}><span>0%</span><span>45%</span></div>
        </div>

        {financingChoice === "leasing" ? (
          <div className="mb-5">
            <label className="text-sm font-semibold block mb-2" style={{ color: "#1B2A4A" }}>Okres</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOkresLeasing(48)}
                className="flex-1 py-2 rounded-lg text-sm font-semibold transition-colors"
                style={
                  okresLeasing === 48
                    ? { backgroundColor: "#1B2A4A", color: "#fff", cursor: "pointer" }
                    : { backgroundColor: "#f0f0f2", color: "#1B2A4A", cursor: "pointer" }
                }
              >
                48 miesięcy
              </button>
              <button
                type="button"
                onClick={() => setOkresLeasing(60)}
                className="flex-1 py-2 rounded-lg text-sm font-semibold transition-colors"
                style={
                  okresLeasing === 60
                    ? { backgroundColor: "#1B2A4A", color: "#fff", cursor: "pointer" }
                    : { backgroundColor: "#f0f0f2", color: "#1B2A4A", cursor: "pointer" }
                }
              >
                60 miesięcy
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-5">
            <div className="flex justify-between items-baseline mb-2">
              <label className="text-sm font-semibold" style={{ color: "#1B2A4A" }}>Okres</label>
              <div className="text-sm font-bold" style={{ color: "#1B2A4A" }}>{okresPozyczka} <span className="font-normal" style={{ color: "#888" }}>miesięcy</span></div>
            </div>
            <input type="range" min={24} max={72} step={12} value={okresPozyczka} onChange={(e) => setOkresPozyczka(Number(e.target.value))} className="w-full" style={{ accentColor: "#F0A500", cursor: "pointer" }} />
            <div className="flex justify-between text-xs mt-0.5" style={{ color: "#aaa" }}><span>24</span><span>36</span><span>48</span><span>60</span><span>72</span></div>
          </div>
        )}
      </div>

      <a href={kontaktUrl} className="block text-center w-full font-bold rounded-lg py-3.5 px-6 text-sm no-underline hover:opacity-90 transition-opacity" style={{ backgroundColor: "#F0A500", color: "#1B2A4A" }}>Zapytaj o ten obiekt</a>
      <p className="text-xs leading-relaxed mt-3" style={{ color: "#aaa" }}>Kalkulacja orientacyjna. Ostateczna rata zależy od oferty banku.</p>
    </div>
  )
}
