const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type ContactFormValidationResult =
  | { valid: true }
  | { valid: false; error: string }

// Suma kontrolna NIP wg wzoru z ustawy - wagi 6,5,7,2,3,4,5,6,7, reszta z dzielenia przez 11
export function isValidNIP(nipRaw: string): boolean {
  const cleaned = nipRaw.replace(/[\s-]/g, "")
  if (!/^\d{10}$/.test(cleaned)) return false
  const digits = cleaned.split("").map(Number)
  const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7]
  const sum = weights.reduce((acc, w, i) => acc + w * digits[i], 0)
  const checksum = sum % 11
  if (checksum === 10) return false
  return checksum === digits[9]
}

// Akceptuje polskie numery: 9 cyfr, opcjonalnie z prefiksem +48/48, spacjami/myslnikami
export function isValidPolishPhone(phoneRaw: string): boolean {
  const cleaned = phoneRaw.replace(/[\s\-()]/g, "").replace(/^\+?48/, "")
  return /^\d{9}$/.test(cleaned)
}

export function validateContactForm(data: {
  name: string
  phone: string
  email: string
  nip?: string
  message?: string
}): ContactFormValidationResult {
  const name = data.name?.trim() ?? ""
  const phone = data.phone?.trim() ?? ""
  const email = data.email?.trim() ?? ""
  const nip = data.nip?.trim() ?? ""
  const message = data.message?.trim() ?? ""

  if (name.length < 2 || name.length > 100) {
    return { valid: false, error: "Imie i nazwisko musi miec od 2 do 100 znakow" }
  }
  if (!isValidPolishPhone(phone)) {
    return { valid: false, error: "Podaj poprawny numer telefonu (9 cyfr, opcjonalnie z prefiksem +48)" }
  }
  if (email.length > 254 || !EMAIL_REGEX.test(email)) {
    return { valid: false, error: "Podaj poprawny adres email" }
  }
  if (nip && !isValidNIP(nip)) {
    return { valid: false, error: "Podany NIP jest nieprawidlowy" }
  }
  if (message.length > 2000) {
    return { valid: false, error: "Wiadomosc jest za dluga (maksymalnie 2000 znakow)" }
  }
  return { valid: true }
}