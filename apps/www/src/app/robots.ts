import type { MetadataRoute } from "next"
import { headers } from "next/headers"

import { APP_HOSTNAMES } from "@/lib/blog/constructMetadata"

export default function robots(): MetadataRoute.Robots {
  const headersList = headers()
  let domain = headersList.get("host") as string
  if (APP_HOSTNAMES.has(domain)) domain = "propdock.no"

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/private/"],
    },
    sitemap: `https://${domain}/sitemap.xml`,
  }
}
