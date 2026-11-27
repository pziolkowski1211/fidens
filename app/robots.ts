import type { MetadataRoute } from "next"
import { ALLOW_INDEXING } from "@/lib/config/site"

export default function robots(): MetadataRoute.Robots {
  if (!ALLOW_INDEXING) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    }
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: "https://fidens.pl/sitemap.xml",
  }
}