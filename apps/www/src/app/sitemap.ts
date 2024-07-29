import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const domain = "propdock.no" // Replace with your actual domain

  // Manually added static pages with today's date
  const staticPagesSitemap = [
    {
      url: `https://${domain}/`, // Home page
      lastModified: new Date("2023-11-28"), // Set to November 28, 2023
    },
    {
      url: `https://${domain}/pricing`, // Pricing page
      lastModified: new Date("2023-11-28"), // Set to November 28, 2023
    },
    // Add other static pages here if necessary
  ]
}
