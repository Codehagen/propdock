import { allLegalPosts } from "content-collections";
import type { Metadata } from "next";

import LegalPage from "@/components/blog/legal";
import { constructMetadata } from "@/lib/blog/constructMetadata";

export const metadata: Metadata = constructMetadata({
  title: "Terms – Propdock",
  image: "/api/og/help?title=Terms&summary=propdock.no/terms"
});

export default function Vilkar() {
  const post = allLegalPosts.find(post => post.slug === "terms")!;
  return <LegalPage post={post} />;
}
