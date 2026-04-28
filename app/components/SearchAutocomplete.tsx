"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { searchVehicles, type VehicleSuggestion } from "@/lib/vehicles/catalog"

interface SearchAutocompleteProps {
  variant?: "desktop" | "mobile"
  onSelect?: () => void
  autoFocus?: boolean
}

export default function SearchAutocomplete({ variant = "desktop", onSelect, autoFocus = false }: SearchAutocompleteProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<VehicleSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus()
    }
  }, [autoFocus])

  useEffect(() => {
    if (query.trim().length === 0) {
      setSuggestions([])
      return
    }
    setSuggestions(searchVehicles(query, 8))
    setHighlightedIndex(-1)
  }, [query])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const navigateToListings = useCallback((suggestion?: VehicleSuggestion) => {
    const params = new URLSearchParams()

    if (suggestion) {
      params.set("marka", suggestion.brand.toLowerCase())
      if (suggestion.model) {
        params.set("model", suggestion.model.toLowerCase())
      }
    } else if (query.trim()) {
      params.set("q", query.trim())
    } else {
      return
    }

    setIsOpen(false)
    setQuery("")
    onSelect?.()
    router.push("/ogloszenia?" + params.toString())
  }, [query, router, onSelect])

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setIsOpen(true)
      setHighlightedIndex((prev) => Math.min(prev + 1, suggestions.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightedIndex((prev) => Math.max(prev - 1, -1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        navigateToListings(suggestions[highlightedIndex])
      } else {
        navigateToListings()
      }
    } else if (e.key === "Escape") {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  function highlightMatch(text: string, q: string) {
    if (!q) return text
    const lower = text.toLowerCase()
    const qLower = q.toLowerCase()
    const idx = lower.indexOf(qLower)
    if (idx === -1) return text

    return (
      <>
        {text.slice(0, idx)}
        <span className="font-bold text-[#1B2A4A]">
          {text.slice(idx, idx + q.length)}
        </span>
        {text.slice(idx + q.length)}
      </>
    )
  }

  const isDesktop = variant === "desktop"
  const showDropdown = isOpen && suggestions.length > 0

  return (
    <div
      ref={containerRef}
      className={"relative " + (isDesktop ? "w-72 lg:w-80" : "w-full")}
    >
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Szukaj marki lub modelu..."
          className="w-full bg-white/10 text-white placeholder:text-white/50 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:bg-white/15 focus:border-[#F0A500] transition-colors"
          autoComplete="off"
          aria-label="Wyszukaj pojazd"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
        />
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
          <ul role="listbox">
            {suggestions.map((item, idx) => (
              <li
                key={item.brand + "-" + (item.model ?? "all") + "-" + item.category}
                role="option"
                aria-selected={idx === highlightedIndex}
                onMouseDown={(e) => {
                  e.preventDefault()
                  navigateToListings(item)
                }}
                onMouseEnter={() => setHighlightedIndex(idx)}
                className={"px-4 py-2.5 cursor-pointer flex items-center justify-between gap-3 text-sm " + (idx === highlightedIndex ? "bg-[#f8f9fb]" : "hover:bg-[#f8f9fb]")}
              >
                <span className="text-gray-700">
                  {highlightMatch(item.label, query)}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-gray-400 shrink-0">
                  {item.category === "osobowe" && "Osobowe"}
                  {item.category === "ciezarowe" && "Ciężarowe"}
                  {item.category === "maszyna" && "Maszyna"}
                </span>
              </li>
            ))}
          </ul>

          {query.trim() && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault()
                navigateToListings()
              }}
              className="w-full px-4 py-2.5 border-t border-gray-100 bg-gray-50 text-left text-xs text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Szukaj &quot;{query.trim()}&quot; &rarr;
            </button>
          )}
        </div>
      )}

      {isOpen && query.trim().length > 0 && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault()
              navigateToListings()
            }}
            className="w-full px-4 py-3 text-left text-sm text-gray-600 hover:bg-[#f8f9fb] transition-colors"
          >
            Brak gotowych podpowiedzi. Szukaj &quot;{query.trim()}&quot; &rarr;
          </button>
        </div>
      )}
    </div>
  )
}
