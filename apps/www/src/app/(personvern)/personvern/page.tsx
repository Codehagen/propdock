import { allLegalPosts } from "content-collections";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import LegalPage from "@/components/blog/legal";
import { constructMetadata } from "@/lib/blog/constructMetadata";

export const metadata: Metadata = constructMetadata({
  title: "Personvern – Propdock",
  image: "/api/og/help?title=Personvern&summary=propdock.no/personvern",
});

export default function Privacy() {
  const post = allLegalPosts.find((post) => post.slug === "privacy");
  if (!post) {
    notFound();
  }
  return <LegalPage post={post} />;
}
