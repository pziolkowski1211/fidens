"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

interface CarouselImage {
  url: string
  position: number
}

interface CarouselProps {
  images: CarouselImage[]
  alt: string
}

export default function Carousel({ images, alt }: CarouselProps) {
  const [current, setCurrent] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const total = images.length

  const goPrev = () => setCurrent((p) => (p === 0 ? total - 1 : p - 1))
  const goNext = () => setCurrent((p) => (p === total - 1 ? 0 : p + 1))

  const openLightbox = () => setLightboxOpen(true)
  const closeLightbox = () => setLightboxOpen(false)

  // Klawisze strzalek + Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
      if (e.key === "Escape" && lightboxOpen) closeLightbox()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [total, lightboxOpen])

  // Blokuj scroll body kiedy lightbox otwarty
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [lightboxOpen])

  // Swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }
  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return
    const diff = touchStartX.current - touchEndX.current
    if (diff > 50) goNext()
    else if (diff < -50) goPrev()
    touchStartX.current = null
    touchEndX.current = null
  }

  if (total === 0) {
    return (
      <div
        className="rounded-xl overflow-hidden mb-6 flex items-center justify-center"
        style={{ backgroundColor: "#e8eaed", aspectRatio: "16 / 10" }}
      >
        <span className="text-sm" style={{ color: "#aaa" }}>Brak zdjęć</span>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6">
        {/* Glowne zdjecie */}
        <div
          className="relative rounded-xl overflow-hidden mb-3 cursor-pointer"
          style={{ aspectRatio: "16 / 10", backgroundColor: "#e8eaed" }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={openLightbox}
        >
          <Image
            src={images[current].url}
            alt={`${alt} - zdjęcie ${current + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 700px"
            className="object-cover"
            draggable={false}
            priority={current === 0}
          />

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goPrev() }}
                aria-label="Poprzednie zdjecie"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center cursor-pointerborder-none transition-opacity hover:opacity-100"
                style={{ backgroundColor: "rgba(0,0,0,0.5)", color: "white", opacity: 0.85 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goNext() }}
                aria-label="Nastepne zdjecie"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border-none transition-opacity hover:opacity-100"
                style={{ backgroundColor: "rgba(0,0,0,0.5)", color: "white", opacity: 0.85 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>

              <div
                className="absolute bottom-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: "rgba(0,0,0,0.6)", color: "white" }}
              >
                {current + 1} / {total}
              </div>
            </>
          )}
        </div>

        {/* Miniatury - desktop */}
        {total > 1 && (
          <div className="hidden sm:flex gap-2 overflow-x-auto">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrent(idx)}
                aria-label={`Pokaz zdjecie ${idx + 1}`}
                className="relative flex-shrink-0 rounded-lg overflow-hidden cursor-pointer transition-all"
                style={{
                  width: "90px",
                  height: "60px",
                  border: idx === current ? "2px solid #F0A500" : "2px solid transparent",
                  opacity: idx === current ? 1 : 0.7,
                }}
              >
                <Image src={img.url} alt="" fill sizes="90px" className="object-cover" draggable={false} />
              </button>
            ))}
          </div>
        )}

        {/* Kropki - mobile */}
        {total > 1 && (
          <div className="flex sm:hidden justify-center gap-2 mt-1">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrent(idx)}
                aria-label={`Pokaz zdjecie ${idx + 1}`}
                className="w-2 h-2 rounded-full border-none cursor-pointer transition-all"
                style={{
                  backgroundColor: idx === current ? "#F0A500" : "#cdd1d6",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* LIGHTBOX */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.92)" }}
          onClick={closeLightbox}
        >
          {/* Przycisk zamknij */}
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Zamknij"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer border-none z-10"
            style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "white" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Licznik */}
          {total > 1 && (
            <div
              className="absolute top-6 left-1/2 -translate-x-1/2 text-sm font-semibold px-3 py-1.5 rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "white" }}
            >
              {current + 1} / {total}
            </div>
          )}

          {/* Zdjecie - klik nie zamyka */}
          <div
            className="relative max-w-[95vw] max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[current].url}
              alt={`${alt} - zdjęcie ${current + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
              draggable={false}
            />
          </div>

          {/* Strzalki w lightbox */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goPrev() }}
                aria-label="Poprzednie zdjecie"
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center cursor-pointer border-none"
                style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "white" }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goNext() }}
                aria-label="Nastepne zdjecie"
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center cursor-pointer border-none"
                style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "white" }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}