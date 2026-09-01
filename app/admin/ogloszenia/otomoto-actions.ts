"use server"
import { fetchOtomotoListing, OtomotoScrapedData } from "@/lib/otomoto/scraper"
import { isValidOtomotoUrl } from "@/lib/otomoto/validate-url"

export type ImportOtomotoResult =
  | { success: true; data: OtomotoScrapedData }
  | { success: false; error: string }

export async function importOtomotoListing(url: string): Promise<ImportOtomotoResult> {
  if (!url || !isValidOtomotoUrl(url)) {
    return { success: false, error: "To nie wyglada na poprawny link do OtoMoto" }
  }
  try {
    const data = await fetchOtomotoListing(url)
    return { success: true, data }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Nieznany blad podczas importu",
    }
  }
}
