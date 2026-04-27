"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import SearchAutocomplete from "./SearchAutocomplete"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Zablokuj scroll body kiedy menu jest otwarte
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  // Zamknij menu przy zmianie rozmiaru ekranu na desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false)
        setIsSearchOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <>
      {/* GLOWNA NAWIGACJA */}
      <nav style={{ backgroundColor: "#1B2A4A" }} className="px-4 sm:px-6 py-4 relative flex items-center">

        {/* Logo - lewa strona, klikalne */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/jasne.png"
            alt="Fidens"
            width={300}
            height={200}
            className="h-9 sm:h-11 w-auto"
            priority
          />
        </Link>

        {/* DESKTOP: Wyszukiwarka wycentrowana */}
        <div className="hidden lg:block absolute left-1/2 -translate-x-1/2">
          <SearchAutocomplete variant="desktop" />
        </div>

        {/* DESKTOP: Menu prawa strona */}
        <div className="hidden lg:flex ml-auto items-center gap-8">
          <Link href="/leasing" style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}>Jak dziala leasing</Link>
          <Link href="/o-nas" style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}>O nas</Link>
          <Link href="/kontakt" style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}>Kontakt</Link>
          <Link
            href="/kontakt"
            style={{ backgroundColor: "#F0A500", color: "#1B2A4A", padding: "8px 20px", borderRadius: "6px", fontWeight: "600", fontSize: "14px" }}
          >
            Zamow bezplatna kalkulacje
          </Link>
        </div>

        {/* MOBILE: Lupa + Hamburger po prawej */}
        <div className="lg:hidden ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Wyszukiwarka"
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Menu"
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* MOBILE: Pole wyszukiwania pod nawigacja (gdy klikniete lupa) */}
      {isSearchOpen && (
        <div className="lg:hidden px-4 py-3 border-b border-white/10" style={{ backgroundColor: "#1B2A4A" }}>
          <SearchAutocomplete
            variant="mobile"
            autoFocus
            onSelect={() => setIsSearchOpen(false)}
          />
        </div>
      )}

      {/* MOBILE: Drawer (panel boczny) z menu */}
      {isMenuOpen && (
        <>
          {/* Tlo polprzezroczyste */}
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40 animate-fadeIn"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div
            className="lg:hidden fixed top-0 right-0 bottom-0 w-[280px] z-50 shadow-2xl animate-slideIn flex flex-col"
            style={{ backgroundColor: "#1B2A4A" }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            {/* Naglowek drawera */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <span style={{ color: "#F0A500", fontSize: "18px", fontWeight: 700, letterSpacing: "1px" }}>
                Menu
              </span>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Zamknij menu"
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Linki */}
            <nav className="flex flex-col p-5 gap-1 flex-1">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-4 py-3 text-base transition-colors"
              >
                Strona glowna
              </Link>
              <Link
                href="/ogloszenia"
                onClick={() => setIsMenuOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-4 py-3 text-base transition-colors"
              >
                Wszystkie oferty
              </Link>
              <Link
                href="/leasing"
                onClick={() => setIsMenuOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-4 py-3 text-base transition-colors"
              >
                Jak dziala leasing
              </Link>
              <Link
                href="/o-nas"
                onClick={() => setIsMenuOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-4 py-3 text-base transition-colors"
              >
                O nas
              </Link>
              <Link
                href="/kontakt"
                onClick={() => setIsMenuOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-4 py-3 text-base transition-colors"
              >
                Kontakt
              </Link>
            </nav>

            {/* CTA na dole */}
            <div className="p-5 border-t border-white/10">
              <Link
                href="/kontakt"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center font-bold rounded-lg py-3.5 text-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#F0A500", color: "#1B2A4A" }}
              >
                Zamow bezplatna kalkulacje
              </Link>
            </div>
          </div>
        </>
      )}

      {/* Animacje CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        :global(.animate-fadeIn) {
          animation: fadeIn 200ms ease-out;
        }
        :global(.animate-slideIn) {
          animation: slideIn 280ms ease-out;
        }
      `}</style>
    </>
  )
}
