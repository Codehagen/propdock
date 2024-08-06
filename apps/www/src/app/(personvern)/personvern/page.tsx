import { Metadata } from "next"
import { notFound } from "next/navigation"
import { allLegalPosts } from "content-collections"

import { constructMetadata } from "@/lib/blog/constructMetadata"
import LegalPage from "@/components/blog/legal"

export const metadata: Metadata = constructMetadata({
  title: "Personvern – Propdock",
  image: "/api/og/help?title=Personvern&summary=propdock.no/personvern",
})

export default function Privacy() {
  const post = allLegalPosts.find((post) => post.slug === "privacy")
  if (!post) {
    notFound()
  }
  return <LegalPage post={post} />
}
