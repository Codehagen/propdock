import type { Metadata } from "next"

export function constructMetadata({
  title = "Dub - Link Management for Modern Marketing Teams",
  description = "Dub is an open-source link management tool for modern marketing teams to create, share, and track short links.",
  image = "https://dub.co/_static/thumbnail.png",
  icons = "/favicon.ico",
  noIndex = false,
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@propdock",
    },
    icons,
    metadataBase: new URL(HOME_DOMAIN),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  }
}

export const HOME_DOMAIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? "https://propdock.no"
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "http://home.localhost:3000"

export const APP_HOSTNAMES = new Set([
  "propdock.no",
  "preview.propdock.no",
  "localhost:8888",
  "localhost:3000",
  "localhost",
])
