import { Suspense } from "react"

import { constructMetadata } from "@/lib/blog/constructMetadata"
import { Customer } from "@/components/blog/customers"
import MaxWidthWrapper from "@/components/blog/max-width-wrapper"

export const metadata = constructMetadata({
  title: "Kunder - Propdock",
  description: "Møt våre kunder og lær hvordan de bruker Propdock.",
})

export default function Customers() {
  return (
    <>
      <MaxWidthWrapper className="mb-8 mt-16 text-center">
        <div className="mx-auto mb-10 sm:max-w-lg">
          <h1 className="font-display text-4xl font-extrabold text-black sm:text-5xl">
            Se våre{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              kunder
            </span>
          </h1>
          <p className="mt-5 text-gray-600 sm:text-lg">
            Propdock gir superkrefter til eiendomsforvaltere og eiere - fra
            enkeltpersoner med én eiendom til store selskaper med omfattende
            porteføljer.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-5 py-5 md:grid-cols-4">
          {customers.map((customer) => (
            <Customer key={customer.slug} {...customer} />
          ))}
        </div>
      </MaxWidthWrapper>
      <Suspense>{/* <Testimonials /> */}</Suspense>
      {/* <CTA /> */}
    </>
  )
}

const customers = [
  {
    slug: "vercel",
    site: "https://vercel.com",
  },
  {
    slug: "corponor",
  },
  // {
  //   slug: "tinybird",
  //   site: "https://tinybird.co",
  // },
  // {
  //   slug: "hashnode",
  //   site: "https://hashnode.com",
  // },
  // {
  //   slug: "cal",
  //   site: "https://cal.com",
  // },
  // {
  //   slug: "perplexity",
  //   site: "https://perplexity.ai",
  // },
  // {
  //   slug: "replicate",
  //   site: "https://replicate.com",
  // },
  // {
  //   slug: "super",
  //   site: "https://super.so",
  // },
  // {
  //   slug: "chronicle",
  //   site: "https://chroniclehq.com",
  // },
  // {
  //   slug: "attio",
  //   site: "https://attio.com",
  // },
  // {
  //   slug: "crowd",
  //   site: "https://crowd.dev",
  // },
  // {
  //   slug: "checkly",
  //   site: "https://checklyhq.com",
  // },
  // {
  //   slug: "rovisys",
  //   site: "https://www.rovisys.com",
  // },
  // {
  //   slug: "chatwoot",
  //   site: "https://chatwoot.com",
  // },
  // {
  //   slug: "lugg",
  //   site: "https://lugg.com",
  // },
  // {
  //   slug: "vueschool",
  //   site: "https://vueschool.io",
  // },
  // {
  //   slug: "refine",
  //   site: "https://refine.dev",
  // },
  // {
  //   slug: "crowdin",
  //   site: "https://crowdin.com",
  // },
  // {
  //   slug: "peerlist",
  //   site: "https://peerlist.io",
  // },
  // {
  //   slug: "anja",
  //   site: "https://www.anjahealth.com/",
  // },
  // {
  //   slug: "inngest",
  //   site: "https://www.inngest.com/",
  // },
  // {
  //   slug: "ashore",
  //   site: "https://ashore.io/",
  // },
  // {
  //   slug: "galactic",
  //   site: "https://galacticrecords.com/",
  // },
  // {
  //   slug: "1komma5grad",
  //   site: "https://1komma5grad.com/",
  // },
]
