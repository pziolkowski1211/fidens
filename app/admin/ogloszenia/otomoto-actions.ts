"use server"

import { fetchOtomotoListing, extractOtomotoImageUrls, OtomotoScrapedData } from "@/lib/otomoto/scraper"
import { createClient } from "@/lib/supabase/server"

export type ImportOtomotoResult =
  | { success: true; data: OtomotoScrapedData }
  | { success: false; error: string }

export async function importOtomotoListing(url: string): Promise<ImportOtomotoResult> {
  if (!url || !url.includes("otomoto.pl")) {
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

export type ImportOtomotoPhotosResult =
  | { success: true; imported: number; failed: number }
  | { success: false; error: string }

export async function importOtomotoPhotos(
  listingId: string,
  slug: string,
  otomotoUrl: string
): Promise<ImportOtomotoPhotosResult> {
  if (!otomotoUrl || !otomotoUrl.includes("otomoto.pl")) {
    return { success: false, error: "Brak poprawnego linku OtoMoto dla tego ogloszenia" }
  }

  let html: string
  try {
    const res = await fetch(otomotoUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "pl-PL,pl;q=0.9",
      },
    })
    if (!res.ok) {
      return { success: false, error: `OtoMoto zwrocilo blad HTTP ${res.status}` }
    }
    html = await res.text()
  } catch {
    return { success: false, error: "Nie udalo sie pobrac strony OtoMoto" }
  }

  const imageUrls = extractOtomotoImageUrls(html)

  if (imageUrls.length === 0) {
    return { success: false, error: "Nie znaleziono zdjec na stronie OtoMoto" }
  }

  const supabase = await createClient()

  const { data: existingImages } = await supabase
    .from("listing_images")
    .select("position")
    .eq("listing_id", listingId)
    .order("position", { ascending: false })
    .limit(1)

  let nextPosition = existingImages && existingImages.length > 0 ? existingImages[0].position + 1 : 0
  const isFirstUpload = nextPosition === 0

  let imported = 0
  let failed = 0

  for (let i = 0; i < imageUrls.length; i++) {
    try {
      const imgRes = await fetch(imageUrls[i])
      if (!imgRes.ok) {
        failed++
        continue
      }
      const blob = await imgRes.blob()
      const path = `${slug}/otomoto-${Date.now()}-${i}.jpg`

      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(path, blob, { contentType: "image/jpeg" })

      if (uploadError) {
        failed++
        continue
      }

      const { data: publicUrlData } = supabase.storage.from("listing-images").getPublicUrl(path)

      const { error: insertError } = await supabase.from("listing_images").insert({
        listing_id: listingId,
        storage_path: path,
        url: publicUrlData.publicUrl,
        position: nextPosition,
        is_cover: isFirstUpload && i === 0,
      })

      if (insertError) {
        failed++
        continue
      }

      nextPosition++
      imported++
    } catch {
      failed++
    }
  }

  if (imported === 0) {
    return { success: false, error: "Nie udalo sie zaimportowac zadnego zdjecia" }
  }

  return { success: true, imported, failed }
}