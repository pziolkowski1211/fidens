// Dane kontaktowe wyswietlane na stronie.
// Telefon: wpisz numer (np. "+48 600 000 000") dopiero gdy bedzie prawdziwy.
// Dopoki jest pusty, przyciski "Zadzwon" nie sa pokazywane.
export const CONTACT_PHONE: string = ""

export function phoneHref(): string {
  return "tel:" + CONTACT_PHONE.replace(/[^+\d]/g, "")
}