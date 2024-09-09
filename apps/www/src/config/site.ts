import type { SiteConfig } from "@/types";

import { env } from "@/env";

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "Propdock",
  description:
    "Propdock er en innovativ løsning for eiendomsadministrasjon som kombinerer kraftig analyse, utleieadministrasjon og brukervennlig grensesnitt",
  url: site_url,
  ogImage: "https://propdock.no/_static/thumbnail.png",
  links: {
    twitter: "https://twitter.com/codehagen",
    github: "https://github.com/codehagen",
  },
  mailSupport: "Christer@propdock.no",
};
