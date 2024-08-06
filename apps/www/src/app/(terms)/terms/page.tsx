import { Metadata } from "next"
import { allLegalPosts } from "content-collections"

import { constructMetadata } from "@/lib/blog/constructMetadata"
import LegalPage from "@/components/blog/legal"

export const metadata: Metadata = constructMetadata({
  title: "Terms – Propdock",
  image: "/api/og/help?title=Terms&summary=propdock.no/terms",
})

export default function Vilkar() {
  const post = allLegalPosts.find((post) => post.slug === "terms")!
  return <LegalPage post={post} />
}
