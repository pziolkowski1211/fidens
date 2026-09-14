const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type ContactFormField = "name" | "phone" | "email" | "nip" | "message"

export type ContactFormValidationResult =
  | { valid: true }
  | { valid: false; error: string; field: ContactFormField }

// Akceptuje polskie numery: 9 cyfr, opcjonalnie z prefiksem +48/48, spacjami/myslnikami
export function isValidPolishPhone(phoneRaw: string): boolean {
  const cleaned = phoneRaw.replace(/[\s\-()]/g, "").replace(/^\+?48/, "")
  return /^\d{9}$/.test(cleaned)
}

// Sprawdza tylko FORMAT (10 cyfr), bez sumy kontrolnej - swiadoma decyzja biznesowa
// (01.09): surowa walidacja matematyczna blokowala realne leady przy drobnych
// pomylkach klienta, a NIP nie jest krytyczny do pierwszego kontaktu
function isValidNipFormat(nipRaw: string): boolean {
  const cleaned = nipRaw.replace(/[\s-]/g, "")
  return /^\d{10}$/.test(cleaned)
}

export function validateContactForm(data: {
  name: string
  phone: string
  email: string
  nip?: string
  message?: string
  nipRequired?: boolean
}): ContactFormValidationResult {
  const name = data.name?.trim() ?? ""
  const phone = data.phone?.trim() ?? ""
  const email = data.email?.trim() ?? ""
  const nip = data.nip?.trim() ?? ""
  const message = data.message?.trim() ?? ""
  const nipRequired = data.nipRequired ?? false

  if (name.length < 2 || name.length > 100) {
    return { valid: false, error: "Imie i nazwisko musi miec od 2 do 100 znakow", field: "name" }
  }
  if (!isValidPolishPhone(phone)) {
    return { valid: false, error: "Podaj poprawny numer telefonu (9 cyfr, opcjonalnie z prefiksem +48)", field: "phone" }
  }
  if (email.length > 254 || !EMAIL_REGEX.test(email)) {
    return { valid: false, error: "Podaj poprawny adres email", field: "email" }
  }
  if (nipRequired && !nip) {
    return { valid: false, error: "NIP jest wymagany dla zapytan o konkretne ogloszenie", field: "nip" }
  }
  if (nip && !isValidNipFormat(nip)) {
    return { valid: false, error: "NIP musi skladac sie z 10 cyfr", field: "nip" }
  }
  if (message.length > 2000) {
    return { valid: false, error: "Wiadomosc jest za dluga (maksymalnie 2000 znakow)", field: "message" }
  }
  return { valid: true }
}