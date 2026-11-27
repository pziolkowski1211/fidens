"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import SearchAutocomplete from "./SearchAutocomplete"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const onListings = pathname.startsWith("/ogloszenia")
  const onAbout = pathname.startsWith("/o-nas")
  const onContact = pathname.startsWith("/kontakt")

  // Pasek zmniejsza sie i dostaje cien po przewinieciu strony
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

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
      <nav
        style={{ backgroundColor: "#1B2A4A" }}
        className={"px-4 sm:px-6 sticky top-0 z-50 flex items-center transition-all duration-300 " + (scrolled ? "py-2 shadow-lg shadow-black/25" : "py-4")}
      >

        {/* Logo - lewa strona, klikalne */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/jasne.png"
            alt="Fidens"
            width={300}
            height={200}
            className={"w-auto transition-all duration-300 " + (scrolled ? "h-8 sm:h-9" : "h-9 sm:h-11")}
            priority
          />
        </Link>

        {/* DESKTOP: Wyszukiwarka - elastyczna, bierze tylko dostepne miejsce (nie nachodzi na menu) */}
        <div className="hidden lg:flex flex-1 justify-center px-4">
          <div className="w-full max-w-md">
            <SearchAutocomplete variant="desktop" />
          </div>
        </div>

        {/* DESKTOP: Menu prawa strona */}
        <div className="hidden lg:flex items-center gap-6 shrink-0">
          <Link
            href="/ogloszenia"
            aria-current={onListings ? "page" : undefined}
            className={
              "nav-shine relative overflow-hidden text-[14px] font-semibold border border-[#F0A500] rounded-md px-4 py-[7px] transition-colors hover:bg-[#F0A500] hover:text-[#1B2A4A] " +
              (onListings ? "bg-[#F0A500] text-[#1B2A4A]" : "text-[#F0A500]")
            }
          >
            Wszystkie og&#322;oszenia
          </Link>
          <Link href="/o-nas" className="nav-link" aria-current={onAbout ? "page" : undefined}>Poznaj Fidens</Link>
          <a href="/kontakt" className="nav-link" aria-current={onContact ? "page" : undefined}>Kontakt</a>
          <a
            href="/kontakt"
            className="nav-cta"
            style={{ backgroundColor: "#F0A500", color: "#1B2A4A", padding: "8px 20px", borderRadius: "6px", fontWeight: "600", fontSize: "14px" }}
          >
            Zamów bezpłatną kalkulację
          </a>
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
            <nav className="drawer-links flex flex-col p-5 gap-1 flex-1">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-4 py-3 text-base transition-colors"
              >
                Strona główna
              </Link>
              <Link
                href="/ogloszenia"
                onClick={() => setIsMenuOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-4 py-3 text-base transition-colors"
              >
                Wszystkie og&#322;oszenia
              </Link>

              <Link
                href="/o-nas"
                onClick={() => setIsMenuOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-4 py-3 text-base transition-colors"
              >
                Poznaj Fidens
              </Link>
              <a
                href="/kontakt"
                onClick={() => setIsMenuOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-4 py-3 text-base transition-colors"
              >
                Kontakt
              </a>
            </nav>

            {/* CTA na dole */}
            <div className="p-5 border-t border-white/10">
              <a
                href="/kontakt"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center font-bold rounded-lg py-3.5 text-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#F0A500", color: "#1B2A4A" }}
              >
                Zamów bezpłatną kalkulację
              </a>
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

        /* Linki w pasku: zmiana koloru po najechaniu */
        :global(.nav-link) {
          position: relative;
          padding: 4px 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          transition: color 200ms;
        }
        :global(.nav-link:hover),
        :global(.nav-link[aria-current="page"]) {
          color: #ffffff;
        }

        /* Przycisk kalkulacji: lekkie uniesienie */
        :global(.nav-cta) {
          transition: transform 200ms, box-shadow 200ms;
        }
        :global(.nav-cta:hover) {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(240, 165, 0, 0.35);
        }

        /* Przycisk "Wszystkie ogloszenia": blysk co kilka sekund */
        @keyframes shine {
          0%,
          70% {
            left: -60%;
          }
          100% {
            left: 130%;
          }
        }
        :global(.nav-shine)::after {
          content: "";
          position: absolute;
          top: 0;
          left: -60%;
          width: 40%;
          height: 100%;
          background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.5), transparent);
          transform: skewX(-20deg);
          animation: shine 6s ease-in-out infinite;
          pointer-events: none;
        }

        /* Menu mobilne: linki wjezdzaja kolejno */
        @keyframes linkIn {
          from {
            opacity: 0;
            transform: translateX(14px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        :global(.drawer-links) > :global(*) {
          opacity: 0;
          animation: linkIn 300ms ease-out forwards;
        }
        :global(.drawer-links) > :global(*:nth-child(1)) {
          animation-delay: 80ms;
        }
        :global(.drawer-links) > :global(*:nth-child(2)) {
          animation-delay: 130ms;
        }
        :global(.drawer-links) > :global(*:nth-child(3)) {
          animation-delay: 180ms;
        }
        :global(.drawer-links) > :global(*:nth-child(4)) {
          animation-delay: 230ms;
        }

        @media (prefers-reduced-motion: reduce) {
          :global(.nav-shine)::after {
            display: none;
          }
          :global(.drawer-links) > :global(*) {
            animation: none;
            opacity: 1;
          }
          :global(.nav-cta),
          :global(.nav-link) {
            transition: none;
          }
        }
      `}</style>
    </>
  )
}
