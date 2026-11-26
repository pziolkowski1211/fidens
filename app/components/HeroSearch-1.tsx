"use client"

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type CSSProperties } from "react"
import Link from "next/link"
import Image from "next/image"
import { HERO_INTERVAL_MS, type HeroSlide } from "@/lib/config/hero-slides"
import { calculateRateWithDownPayment, calculateShowcaseRate } from "@/lib/leasing/calculator"

// Jedna oferta osobowa/dostawcza: marka, model, cena brutto, czy VAT-marza
export interface HeroListing {
  b: string
  m: string
  p: number
  v: boolean
}

interface HeroSearchProps {
  slides: HeroSlide[]
  listings: HeroListing[]
}

const NAVY = "#1B2A4A"
const GOLD = "#F0A500"

const DOWN_MAX = 200000
const DOWN_STEP = 5000

const SLIDE_EASE = "transform 600ms cubic-bezier(0.22, 0.61, 0.36, 1)"

export default function HeroSearch({ slides, listings }: HeroSearchProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [failed, setFailed] = useState<Record<string, boolean>>({})

  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [rateValue, setRateValue] = useState<number | null>(null)
  const [down, setDown] = useState(0)

  const sectionRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  const count = slides.length

  // Automatyczna zmiana slajdow (zatrzymywana po najechaniu / przy ograniczonych animacjach)
  useEffect(() => {
    if (paused || dragging || count < 2) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % count)
    }, HERO_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [paused, dragging, count, index])

  const brands = useMemo(
    () => Array.from(new Set(listings.map((l) => l.b))).sort((a, b) => a.localeCompare(b, "pl")),
    [listings]
  )

  const models = useMemo(
    () =>
      brand
        ? Array.from(new Set(listings.filter((l) => l.b === brand).map((l) => l.m))).sort((a, b) =>
            a.localeCompare(b, "pl")
          )
        : [],
    [listings, brand]
  )

  // Raty wszystkich ofert przy aktualnie wybranej wplacie wlasnej
  const rates = useMemo(
    () =>
      listings
        .map((l) =>
          Math.round(down > 0 ? calculateRateWithDownPayment(l.p, l.v, down) : calculateShowcaseRate(l.p, l.v))
        )
        .filter((r) => r > 0),
    [listings, down]
  )
  const rateMin = rates.length ? Math.floor(Math.min(...rates) / 100) * 100 : 0
  const rateTop = rates.length ? Math.ceil(Math.max(...rates) / 100) * 100 : 0
  const showRateSlider = rates.length > 0 && rateTop > rateMin

  // Limit raty: null = bez limitu (suwak na koncu lub poza zakresem po zmianie wplaty)
  const effLimit = rateValue === null ? null : Math.min(Math.max(rateValue, rateMin), rateTop)
  const limit = effLimit !== null && effLimit < rateTop ? effLimit : null

  const ratePct = rateTop > rateMin ? (((limit ?? rateTop) - rateMin) / (rateTop - rateMin)) * 100 : 0

  function changeBrand(next: string) {
    setBrand(next)
    setModel("")
  }

  function changeRate(value: number) {
    setRateValue(value >= rateTop ? null : value)
  }

  const searchHref = (() => {
    const p = new URLSearchParams()
    p.set("kategoria", "osobowe_dostawcze")
    if (brand) p.set("marka", brand)
    if (model) p.set("model", model)
    if (limit !== null) p.set("rata_max", String(limit))
    if (down > 0) p.set("wplata", String(down))
    return "/ogloszenia?" + p.toString()
  })()

  // Przeciaganie tla i tekstu (mysz i palec) - pas slajdow jedzie za kursorem
  function onPointerDown(e: ReactPointerEvent<HTMLElement>) {
    if (count < 2) return
    if (e.pointerType === "mouse" && e.button !== 0) return
    const target = e.target as HTMLElement
    if (formRef.current?.contains(target) || target.closest("a, button, input, select, label")) return

    const startX = e.clientX
    const startY = e.clientY
    let active = false
    let lastDx = 0

    function move(ev: PointerEvent) {
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY
      if (!active) {
        if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
          cleanup()
          return
        }
        if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
          active = true
          setDragging(true)
        } else {
          return
        }
      }
      lastDx = dx
      setDragX(dx)
    }

    function finish() {
      cleanup()
      if (!active) return
      const width = sectionRef.current?.offsetWidth ?? 800
      const threshold = Math.min(120, width * 0.15)
      setDragging(false)
      setDragX(0)
      if (lastDx < -threshold) setIndex((i) => (i + 1) % count)
      else if (lastDx > threshold) setIndex((i) => (i - 1 + count) % count)
    }

    function cleanup() {
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", finish)
      window.removeEventListener("pointercancel", finish)
    }

    window.addEventListener("pointermove", move)
    window.addEventListener("pointerup", finish)
    window.addEventListener("pointercancel", finish)
  }

  function formatPln(n: number): string {
    return n.toLocaleString("pl-PL").replace(/,/g, " ")
  }

  const trackStyle = {
    transform: "translateX(calc(" + -index * 100 + "% + " + dragX + "px))",
    transition: dragging ? "none" : SLIDE_EASE,
  }

  const selectClass =
    "w-full appearance-none rounded-xl border bg-gray-50 pl-4 pr-10 py-3 text-[15px] font-medium font-[inherit] outline-none transition-colors hover:border-[#F0A500] focus:border-[#F0A500] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
  const labelClass = "block text-[11px] font-bold uppercase tracking-wider mb-1.5"

  const chevron = (
    <svg
      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={NAVY}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden select-none md:cursor-grab md:active:cursor-grabbing"
      style={{ background: "linear-gradient(135deg, #1B2A4A 0%, #22365e 100%)", touchAction: "pan-y" }}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") setPaused(true)
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") setPaused(false)
      }}
      onPointerDown={onPointerDown}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-label="Oferta Fidens"
    >
      <style>{`
        .hero-range { -webkit-appearance: none; appearance: none; width: 100%; height: 28px; background: transparent; cursor: pointer; touch-action: pan-y; }
        .hero-range::-webkit-slider-runnable-track { height: 6px; border-radius: 9999px; background: linear-gradient(to right, #F0A500 var(--p, 0%), #e5e7eb var(--p, 0%)); }
        .hero-range::-moz-range-track { height: 6px; border-radius: 9999px; background: #e5e7eb; }
        .hero-range::-moz-range-progress { height: 6px; border-radius: 9999px; background: #F0A500; }
        .hero-range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 26px; height: 26px; margin-top: -10px; border-radius: 9999px; background: #F0A500; border: 3px solid #fff; box-shadow: 0 1px 5px rgba(0,0,0,0.35); transition: transform 0.15s; }
        .hero-range::-moz-range-thumb { width: 22px; height: 22px; border-radius: 9999px; background: #F0A500; border: 3px solid #fff; box-shadow: 0 1px 5px rgba(0,0,0,0.35); }
        .hero-range:hover::-webkit-slider-thumb, .hero-range:active::-webkit-slider-thumb { transform: scale(1.12); }
        .hero-range:focus-visible { outline: 2px solid #F0A500; outline-offset: 2px; border-radius: 9999px; }
      `}</style>
      {/* Tla slajdow - pas przesuwany w bok */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="flex h-full" style={trackStyle}>
          {slides.map((s, i) => (
            <div key={s.id + "-bg"} className="relative h-full w-full shrink-0">
              {s.image && !failed[s.id] && (
                <Image
                  src={s.image}
                  alt=""
                  fill
                  sizes="100vw"
                  priority={i === 0}
                  draggable={false}
                  className="object-cover"
                  onError={() => setFailed((f) => ({ ...f, [s.id]: true }))}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Nakladka dla czytelnosci tekstu */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(27,42,74,0.80) 0%, rgba(27,42,74,0.60) 50%, rgba(27,42,74,0.30) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-[1100px] mx-auto px-4 sm:px-6 pt-10 pb-14 sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-[72px] grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-12 items-center">
        {/* Lewa strona: naglowek + slajdy */}
        <div className="min-w-0">
          <h1
            className="text-[12px] sm:text-[13px] font-bold tracking-[0.18em] uppercase mb-4"
            style={{ color: GOLD }}
          >
            Leasing samochodów, ciężarówek i maszyn
          </h1>

          {count > 0 && (
            <div className="grid">
              <div className="contents">
                {slides.map((s, i) => {
                  const active = i === index
                  return (
                    <div
                      key={s.id}
                      className={
                        "col-start-1 row-start-1 pr-2 transition-opacity duration-500 " +
                        (active ? "opacity-100" : "opacity-0 pointer-events-none")
                      }
                      aria-hidden={!active}
                    >
                      {s.badge && (
                        <span
                          className="inline-block text-[11px] font-bold uppercase tracking-wider rounded-full px-3 py-1 mb-3"
                          style={{ backgroundColor: GOLD, color: NAVY }}
                        >
                          {s.badge}
                        </span>
                      )}
                      {s.stars && (
                        <div className="text-2xl tracking-widest mb-2" style={{ color: GOLD }} aria-hidden="true">
                          ★★★★★
                        </div>
                      )}
                      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white mb-3">
                        {s.title}
                      </h2>
                      {s.subtitle && (
                        <p className="text-base sm:text-lg text-white/80 mb-6 max-w-[560px]">{s.subtitle}</p>
                      )}
                      <Link
                        href={s.ctaHref}
                        tabIndex={active ? 0 : -1}
                        draggable={false}
                        className="inline-block font-bold rounded-lg py-3 px-6 text-[15px] transition-opacity hover:opacity-90"
                        style={{ backgroundColor: GOLD, color: NAVY }}
                      >
                        {s.ctaLabel} &rarr;
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

        </div>

        {/* Prawa strona: wyszukiwarka (stoi w miejscu, nie przesuwa sie ze slajdami) */}
        <div ref={formRef} className="cursor-auto select-text rounded-2xl bg-white p-5 sm:p-6 shadow-2xl">
          <p className="text-[22px] font-bold leading-tight" style={{ color: NAVY }}>
            Znajd&#378; auto na leasing
          </p>
          <p className="text-[13px] mt-1 mb-5" style={{ color: "#6b7280" }}>
            <span
              className="inline-block h-1.5 w-1.5 rounded-full mr-2 align-middle"
              style={{ backgroundColor: GOLD }}
              aria-hidden="true"
            />
            Osobowe i dostawcze do 3,5 t
          </p>

          <div className="mb-4">
            <label htmlFor="hero-marka" className={labelClass} style={{ color: "#6b7280" }}>
              Marka
            </label>
            <div className="relative">
              <select
                id="hero-marka"
                className={selectClass}
                style={{ borderColor: "#e5e7eb", color: NAVY }}
                value={brand}
                onChange={(e) => changeBrand(e.target.value)}
                disabled={brands.length === 0}
              >
                <option value="">{brands.length === 0 ? "Brak ofert w tej kategorii" : "Wszystkie marki"}</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              {chevron}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="hero-model" className={labelClass} style={{ color: "#6b7280" }}>
              Model
            </label>
            <div className="relative">
              <select
                id="hero-model"
                className={selectClass}
                style={{ borderColor: "#e5e7eb", color: NAVY }}
                value={model}
                onChange={(e) => setModel(e.target.value)}
                disabled={!brand}
              >
                <option value="">{brand ? "Wszystkie modele" : "Najpierw wybierz markę"}</option>
                {models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              {chevron}
            </div>
          </div>

          {showRateSlider && (
            <div className="mb-4">
              <label
                htmlFor="hero-rata"
                className="flex justify-between items-baseline text-[11px] font-bold uppercase tracking-wider mb-1.5"
                style={{ color: "#6b7280" }}
              >
                <span>Miesięczna rata</span>
                <span className="text-[14px] normal-case tracking-normal" style={{ color: NAVY }}>
                  {limit === null ? "bez limitu" : "do " + formatPln(limit) + " zł"}
                </span>
              </label>
              <input
                id="hero-rata"
                type="range"
                min={rateMin}
                max={rateTop}
                step={100}
                value={limit ?? rateTop}
                onChange={(e) => changeRate(Number(e.target.value))}
                className="hero-range"
                style={{ "--p": ratePct + "%" } as CSSProperties}
              />
              <div className="flex justify-between text-[11px]" style={{ color: "#9ca3af" }}>
                <span>{formatPln(rateMin)} zł</span>
                <span>bez limitu</span>
              </div>
            </div>
          )}

          <div className="mb-5">
            <label
              htmlFor="hero-wplata"
              className="flex justify-between items-baseline text-[11px] font-bold uppercase tracking-wider mb-1.5"
              style={{ color: "#6b7280" }}
            >
              <span>Wpłata własna (brutto)</span>
              <span className="text-[14px] normal-case tracking-normal" style={{ color: NAVY }}>
                {down === 0 ? "dowolna" : formatPln(down) + " zł"}
              </span>
            </label>
            <input
              id="hero-wplata"
              type="range"
              min={0}
              max={DOWN_MAX}
              step={DOWN_STEP}
              value={down}
              onChange={(e) => setDown(Number(e.target.value))}
              className="hero-range"
              style={{ "--p": (down / DOWN_MAX) * 100 + "%" } as CSSProperties}
            />
            <div className="flex justify-between text-[11px]" style={{ color: "#9ca3af" }}>
              <span>dowolna</span>
              <span>{formatPln(DOWN_MAX)} zł</span>
            </div>
            {down > 0 && (
              <p className="text-[11px] mt-1" style={{ color: "#9ca3af" }}>
                Rata liczona przy tej wpłacie (maksymalnie 45% ceny pojazdu).
              </p>
            )}
          </div>

          <Link
            href={searchHref}
            className="block text-center font-bold rounded-xl py-3.5 text-[15px] transition-opacity hover:opacity-90"
            style={{ backgroundColor: GOLD, color: NAVY }}
          >
            Pokaż oferty
          </Link>

          <Link
            href="/ogloszenia"
            className="block text-center text-[13px] mt-3 underline underline-offset-2 hover:text-[#F0A500]"
            style={{ color: "#555" }}
          >
            Ciężarówki, maszyny i pawilony &rarr; wszystkie kategorie
          </Link>
        </div>
      </div>

      {/* Kropki slajdow - na dole obrazu, posrodku */}
  {count > 1 && (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-black/25 px-2 py-0.5 backdrop-blur-sm" role="group" aria-label="Wybór slajdu">
      {slides.map((s, i) => (
        <button
          key={s.id + "-dot"}
          type="button"
          onClick={() => setIndex(i)}
          aria-label={"Slajd " + (i + 1) + ": " + s.title}
          aria-current={i === index}
          className="p-1.5"
        >
          <span
            className="block h-2.5 rounded-full transition-all duration-300"
            style={{
              width: i === index ? 28 : 10,
              backgroundColor: i === index ? GOLD : "rgba(255,255,255,0.45)",
            }}
          />
        </button>
      ))}
    </div>
  )}

      {/* Strzalki (tylko duze ekrany) */}
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => setIndex((index - 1 + count) % count)}
            aria-label="Poprzedni slajd"
            className="hidden xl:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 items-center justify-center shadow-md hover:bg-white transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setIndex((index + 1) % count)}
            aria-label="Następny slajd"
            className="hidden xl:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 items-center justify-center shadow-md hover:bg-white transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </>
      )}
    </section>
  )
}
