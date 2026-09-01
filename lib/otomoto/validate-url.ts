// Poprawna walidacja URL OtoMoto - parsuje URL i sprawdza DOKLADNIE hostname,
// zamiast naiwnego url.includes("otomoto.pl") ktore mozna oszukac np.
// "http://evil.com/otomoto.pl" albo "http://otomoto.pl.attacker.com" (SSRF)
export function isValidOtomotoUrl(urlString: string): boolean {
  let parsed: URL
  try {
    parsed = new URL(urlString)
  } catch {
    return false
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return false
  }

  const hostname = parsed.hostname.toLowerCase()
  return hostname === "otomoto.pl" || hostname.endsWith(".otomoto.pl")
}