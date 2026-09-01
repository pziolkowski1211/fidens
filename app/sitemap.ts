import type { MetadataRoute } from "next"
import { createServiceClient } from "@/lib/supabase/service"

const SITE_URL = "https://fidens.pl"

const STATIC_ROUTES: { path: string; priority: number }[] = [
  { path: "", priority: 1.0 },
  { path: "/ogloszenia", priority: 0.9 },
  { path: "/pawilony", priority: 0.8 },
  { path: "/leasing", priority: 0.6 },
  { path: "/o-nas", priority: 0.5 },
  { path: "/kontakt", priority: 0.6 },
  { path: "/regulamin", priority: 0.2 },
  { path: "/polityka", priority: 0.2 },
]

const PAWILONY_SLUGS = [
  "domek-caloroczny-35m2-z-antresola",
  "dom-modulowy-40m2-10x4m",
  "pawilon-biurowy-24m2-8x3m",
  "pawilon-gastronomiczny-18m2-6x3m",
  "domek-modulowy-42m2-elewacja-palisandrowa",
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(),
    priority: route.priority,
  }))

  const pawilonyEntries: MetadataRoute.Sitemap = PAWILONY_SLUGS.map((slug) => ({
    url: `${SITE_URL}/pawilony/${slug}`,
    lastModified: new Date(),
    priority: 0.7,
  }))

  let listingEntries: MetadataRoute.Sitemap = []

  try {
    const supabase = createServiceClient()
    const { data: listings } = await supabase
      .from("listings")
      .select("slug, updated_at")
      .eq("status", "active")

    if (listings) {
      listingEntries = listings.map((listing) => ({
        url: `${SITE_URL}/ogloszenia/${listing.slug}`,
        lastModified: new Date(listing.updated_at),
        priority: 0.8,
      }))
    }
  } catch (error) {
    console.error("Blad pobierania ogloszen do sitemap.xml:", error)
  }

  return [...staticEntries, ...pawilonyEntries, ...listingEntries]
}