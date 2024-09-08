import type { Metadata } from "next";

export function constructMetadata({
  title = "Propdock - Revolusjonerende eiendomsadministrasjon",
  description = "Propdock er en innovativ løsning for eiendomsadministrasjon som kombinerer kraftig analyse, utleieadministrasjon og brukervennlig grensesnitt",
  image = "https://propdock.no/_static/thumbnail.png",
  icons = "/favicon.ico",
  noIndex = false
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@propdock"
    },
    icons,
    metadataBase: new URL(HOME_DOMAIN),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false
      }
    })
  };
}

export const HOME_DOMAIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? "https://propdock.no"
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "http://home.localhost:3000";

export const APP_HOSTNAMES = new Set([
  "propdock.no",
  "preview.propdock.no",
  "localhost:8888",
  "localhost:3000",
  "localhost"
]);

export const truncate = (str: string | null, length: number) => {
  if (!str || str.length <= length) {
    return str;
  }
  return `${str.slice(0, length - 3)}...`;
};
