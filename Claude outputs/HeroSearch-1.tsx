"use client"

import { useEffect, useMemo, useRef, useState, type TouchEvent, type PointerEvent } from "react"
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

export default function HeroSearch({ slides, listings }: HeroSearchProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [failed, setFailed] = useState<Record<string, boolean>>({})

  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [rateValue, setRateValue] = useState<number | null>(null)
  const [down, setDown] = useState(0)

  const formRef = useRef<HTMLDivElement>(null)
  const mouseStart = useRef<{ x: number; y: number } | null>(null)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  // Automatyczna zmiana slajdow (zatrzymywana po najechaniu / przy ograniczonych animacjach)
  useEffect(() => {
    if (paused || slides.length < 2) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, HERO_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [paused, slides.length, index])

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

  // Przesuwanie slajdow palcem (nie dziala na formularzu)
  function onTouchStart(e: TouchEvent<HTMLElement>) {
    if (formRef.current?.contains(e.target as Node)) {
      touchStart.current = null
      return
    }
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }

  // Przeciaganie myszka na komputerze (nie dziala na formularzu, linkach i przyciskach)
  function onMouseDown(e: PointerEvent<HTMLElement>) {
    if (e.pointerType !== "mouse" || e.button !== 0) return
    const target = e.target as HTMLElement
    if (formRef.current?.contains(target) || target.closest("a, button, input, select")) {
      mouseStart.current = null
      return
    }
    mouseStart.current = { x: e.clientX, y: e.clientY }
  }

  function onMouseUp(e: PointerEvent<HTMLElement>) {
    const start = mouseStart.current
    mouseStart.current = null
    if (!start || e.pointerType !== "mouse" || slides.length < 2) return
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return
    setIndex((i) => (dx < 0 ? (i + 1) % slides.length : (i - 1 + slides.length) % slides.length))
  }

  function onTouchEnd(e: TouchEvent<HTMLElement>) {
    const start = touchStart.current
    touchStart.current = null
    if (!start || slides.length < 2) return
    const t = e.changedTouches[0]
    const dx = t.clientX - start.x
    const dy = t.clientY - start.y
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return
    setIndex((i) => (dx < 0 ? (i + 1) % slides.length : (i - 1 + slides.length) % slides.length))
  }

  function formatPln(n: number): string {
    return n.toLocaleString("pl-PL").replace(/,/g, " ")
  }

  const hasSlides = slides.length > 0
  const selectClass =
    "w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#F0A500] disabled:bg-gray-50 disabled:text-gray-400"

  return (
    <section
      className="relative overflow-hidden md:cursor-grab md:active:cursor-grabbing"
      style={{ background: "linear-gradient(135deg, #1B2A4A 0%, #22365e 100%)" }}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") setPaused(true)
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") setPaused(false)
      }}
      onPointerDown={onMouseDown}
      onPointerUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-label="Oferta Fidens"
    >
      {/* Tla slajdow */}
      {slides.map((s, i) =>
        s.image && !failed[s.id] ? (
          <div
            key={s.id + "-bg"}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === index ? 1 : 0 }}
            aria-hidden="true"
          >
            <Image
              src={s.image}
              alt=""
              fill
              sizes="100vw"
              priority={i === 0}
              className="object-cover"
              onError={() => setFailed((f) => ({ ...f, [s.id]: true }))}
            />
          </div>
        ) : null
      )}

      {/* Nakladka dla czytelnosci tekstu */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(27,42,74,0.92) 0%, rgba(27,42,74,0.75) 50%, rgba(27,42,74,0.45) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-[1100px] mx-auto px-4 sm:px-6 py-10 sm:py-14 lg:py-16 grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-12 items-center">
        {/* Lewa strona: naglowek + slajdy */}
        <div>
          <h1
            className="text-[12px] sm:text-[13px] font-bold tracking-[0.18em] uppercase mb-4"
            style={{ color: GOLD }}
          >
            Leasing samochodów, ciężarówek i maszyn
          </h1>

          {hasSlides && (
            <div className="grid">
              {slides.map((s, i) => {
                const active = i === index
                return (
                  <div
                    key={s.id}
                    className={
                      "col-start-1 row-start-1 transition-opacity duration-700 " +
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
                      className="inline-block font-bold rounded-lg py-3 px-6 text-[15px] transition-opacity hover:opacity-90"
                      style={{ backgroundColor: GOLD, color: NAVY }}
                    >
                      {s.ctaLabel} &rarr;
                    </Link>
                  </div>
                )
              })}
            </div>
          )}

          {slides.length > 1 && (
            <div className="flex items-center gap-1 mt-6" role="group" aria-label="Wybór slajdu">
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
        </div>

        {/* Prawa strona: wyszukiwarka (osobowe i dostawcze do 3,5 t) */}
        <div ref={formRef} className="cursor-auto rounded-xl bg-white p-4 sm:p-5 shadow-2xl">
          <div className="text-[12px] font-bold uppercase tracking-wider mb-4" style={{ color: "#888" }}>
            Osobowe i dostawcze do 3,5 t
          </div>

          <label htmlFor="hero-marka" className="block text-[13px] font-semibold mb-1" style={{ color: NAVY }}>
            Marka
          </label>
          <select
            id="hero-marka"
            className={selectClass + " mb-3"}
            style={{ borderColor: "#e8eaed", color: NAVY }}
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

          <label htmlFor="hero-model" className="block text-[13px] font-semibold mb-1" style={{ color: NAVY }}>
            Model
          </label>
          <select
            id="hero-model"
            className={selectClass + " mb-3"}
            style={{ borderColor: "#e8eaed", color: NAVY }}
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

          {showRateSlider && (
            <div className="mb-3">
              <label
                htmlFor="hero-rata"
                className="flex justify-between items-baseline text-[13px] font-semibold mb-1"
                style={{ color: NAVY }}
              >
                <span>Miesięczna rata</span>
                <span className="font-bold">{limit === null ? "bez limitu" : "do " + formatPln(limit) + " zł"}</span>
              </label>
              <input
                id="hero-rata"
                type="range"
                min={rateMin}
                max={rateTop}
                step={100}
                value={limit ?? rateTop}
                onChange={(e) => changeRate(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: GOLD }}
              />
              <div className="flex justify-between text-[11px]" style={{ color: "#999" }}>
                <span>{formatPln(rateMin)} zł</span>
                <span>bez limitu</span>
              </div>
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="hero-wplata"
              className="flex justify-between items-baseline text-[13px] font-semibold mb-1"
              style={{ color: NAVY }}
            >
              <span>Wpłata własna (brutto)</span>
              <span className="font-bold">{down === 0 ? "dowolna" : formatPln(down) + " zł"}</span>
            </label>
            <input
              id="hero-wplata"
              type="range"
              min={0}
              max={DOWN_MAX}
              step={DOWN_STEP}
              value={down}
              onChange={(e) => setDown(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: GOLD }}
            />
            <div className="flex justify-between text-[11px]" style={{ color: "#999" }}>
              <span>dowolna</span>
              <span>{formatPln(DOWN_MAX)} zł</span>
            </div>
            {down > 0 && (
              <p className="text-[11px] mt-1" style={{ color: "#888" }}>
                Rata liczona przy tej wpłacie (maksymalnie 45% ceny pojazdu).
              </p>
            )}
          </div>

          <Link
            href={searchHref}
            className="block text-center font-bold rounded-lg py-3 text-[15px] transition-opacity hover:opacity-90"
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

      {/* Strzalki (tylko duze ekrany) */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setIndex((index - 1 + slides.length) % slides.length)}
            aria-label="Poprzedni slajd"
            className="hidden xl:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 items-center justify-center shadow-md hover:bg-white transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setIndex((index + 1) % slides.length)}
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
