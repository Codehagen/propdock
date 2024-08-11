import { Suspense } from "react"

import { constructMetadata } from "@/lib/blog/constructMetadata"
import { Integration } from "@/components/blog/integrations"
import MaxWidthWrapper from "@/components/blog/max-width-wrapper"

export const metadata = constructMetadata({
  title: "Integrasjoner - Propdock",
  description:
    "Utforsk våre integrasjoner og se hvordan de kan forbedre din eiendomsforvaltning.",
})

export default function Integrations() {
  return (
    <>
      <MaxWidthWrapper className="mb-8 mt-16 text-center">
        <div className="mx-auto mb-10 sm:max-w-lg">
          <h1 className="font-display text-4xl font-extrabold text-black sm:text-5xl">
            Våre{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              integrasjoner
            </span>
          </h1>
          <p className="mt-5 text-gray-600 sm:text-lg">
            Propdock integrerer sømløst med en rekke verktøy for å forbedre din
            eiendomsforvaltning.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 py-5 md:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integration) => (
            <Integration key={integration.slug} {...integration} />
          ))}
        </div>
      </MaxWidthWrapper>
      <Suspense>{/* <Testimonials /> */}</Suspense>
      {/* <CTA /> */}
    </>
  )
}

const integrations = [
  {
    slug: "poweroffice",
    description:
      "Vi har brukt PowerOffice i Propdock siden lanseringen for over et år siden for alle våre eiendomskampanjer, og vårt team elsker det absolutt!",
  },
  {
    slug: "tripletex",
    site: "https://tripletex.no",
    description:
      "Tripletex er et kraftig regnskapssystem som gjør det enkelt å få tilgang til regnskapsdata fra Tripletex, slik at du kan få en enda bedre innsikt i din eiendomsforvaltning.",
  },
  {
    slug: "visma",
    site: "https://visma.no",
    description:
      "Visma's regnskapsinfrastruktur og analyser har hjulpet oss med å få verdifull innsikt i regnskapsføring for eiendomsforvaltning.",
  },

  {
    slug: "propcloud",
    site: "https://propcloud.no",
    description:
      "PropCloud er en av våre mest populære integrasjoner, og er brukt av vårt team som standard for alle våre eiendomskampanjer.",
  },
  {
    slug: "fiken",
    site: "https://fiken.no",
    description:
      "Integrasjonen gjør det enkelt å få tilgang til regnskapsdata fra Fiken, slik at du kan få en enda bedre innsikt i din eiendomsforvaltning.",
  },
  {
    slug: "signicat",
    description:
      "Signicat gjør det enkelt å sende dokumenter til kunder og motta signerte dokumenter fra kunder.",
  },
  {
    slug: "brreg",
    description:
      "Integrasjonen gjør det enkelt å få tilgang til korrekt bedriftsinformasjon direkte fra Brreg.",
  },
  {
    slug: "kartverket",
    description:
      "Integrasjonen gjør det enkelt å få tilgang til kartdata fra Kartverket. ",
  },

  // Add more integrations as needed
]
