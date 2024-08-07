import { allLegalPosts } from "content-collections"

import { formatDate } from "@/lib/utils"

import MaxWidthWrapper from "./max-width-wrapper"
import { MDX } from "./mdx"

export default function LegalPage({ post }) {
  if (!post) {
    return (
      <div className="text-muted-foreground">Juridisk innlegg ikke funnet</div>
    )
  }

  return (
    <div className="bg-background">
      <div className="bg-card py-20 sm:py-40">
        <h1 className="font-display mt-5 text-center text-4xl font-extrabold leading-[1.15] text-foreground sm:text-6xl sm:leading-[1.15]">
          {post.title}
        </h1>
      </div>
      <MaxWidthWrapper className="flex max-w-screen-md flex-col items-center p-10 sm:pt-20">
        <MDX code={post.mdx} />
        <div className="mt-10 w-full border-t border-border pt-10 text-center">
          <p className="text-muted-foreground">
            Sist oppdatert: {formatDate(post.updatedAt)}
          </p>
        </div>
      </MaxWidthWrapper>
    </div>
  )
}
