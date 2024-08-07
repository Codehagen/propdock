import Link from "next/link"
import { allChangelogPosts } from "content-collections"
import { Rss } from "lucide-react"

import BlurImage from "@/lib/blog/blur-image"
import { constructMetadata } from "@/lib/blog/constructMetadata"
import { getBlurDataURL } from "@/lib/blog/images"
import { formatDate } from "@/lib/utils"
import MaxWidthWrapper from "@/components/blog/max-width-wrapper"
import { MDX } from "@/components/blog/mdx"

// import { Twitter } from "@/components/shared/icons"

export const metadata = constructMetadata({
  title: "Endringslogg – Propdock",
  description:
    "Alle de siste oppdateringene, forbedringene og feilrettingene til Propdock - eiendomsadministrasjonsverktøyet for moderne eiendomsforvaltere.",
  image: "/api/og/changelog",
})

export default function Changelog() {
  return (
    <MaxWidthWrapper className="px-0">
      <div className="relative grid border-b border-gray-200 py-20 md:grid-cols-4">
        <div className="md:col-span-1" />
        <div className="mx-5 flex flex-col space-y-6 md:col-span-3 md:mx-0">
          <h1 className="font-display text-4xl font-bold tracking-tight text-gray-800 md:text-5xl">
            Endringslogg
          </h1>
          <p className="text-lg text-gray-500">
            Alle de siste oppdateringene, forbedringene og feilrettingene til
            Propdock.
          </p>
        </div>
        <div className="absolute bottom-2 right-0 flex items-center space-x-2">
          <p className="text-sm text-gray-500">Abonner på oppdateringer →</p>
          <Link
            href="https://twitter.com/codehagen"
            className="rounded-full bg-blue-100 p-2 transition-colors hover:bg-blue-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* <Twitter className="h-4 w-4 text-[#1d9bf0]" /> */}
          </Link>
          {/* <Link
            href="/atom"
            className="rounded-full bg-gray-100 p-2 transition-colors hover:bg-gray-200"
          >
            <Rss className="h-4 w-4 text-gray-500" />
          </Link> */}
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {allChangelogPosts
          .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
          .map(async (post, idx) => (
            <div
              key={idx}
              className="grid py-20 md:grid-cols-4 md:px-5 xl:px-0"
            >
              <div className="sticky top-20 hidden self-start md:col-span-1 md:block">
                <Link href={`/changelog/${post.slug}`}>
                  <time
                    dateTime={post.publishedAt}
                    className="text-gray-500 transition-colors hover:text-gray-800"
                  >
                    {formatDate(post.publishedAt)}
                  </time>
                </Link>
              </div>
              <div className="flex flex-col gap-6 md:col-span-3">
                <Link href={`/changelog/${post.slug}`}>
                  <BlurImage
                    src={post.image}
                    alt={post.title}
                    width={1200}
                    height={630}
                    priority={idx === 0} // since it's above the fold
                    placeholder="blur"
                    blurDataURL={await getBlurDataURL(post.image!)}
                    className="aspect-video border border-gray-100 object-cover md:rounded-2xl"
                  />
                </Link>
                <Link
                  href={`/changelog/${post.slug}`}
                  className="group mx-5 flex items-center space-x-3 md:mx-0"
                >
                  <time
                    dateTime={post.publishedAt}
                    className="text-sm text-gray-500 transition-all group-hover:text-gray-800 md:hidden"
                  >
                    {formatDate(post.publishedAt)}
                  </time>
                </Link>
                <Link href={`/changelog/${post.slug}`} className="mx-5 md:mx-0">
                  <h2 className="font-display text-3xl font-bold tracking-tight text-gray-800 hover:underline hover:decoration-1 hover:underline-offset-4 md:text-4xl">
                    {post.title}
                  </h2>
                </Link>
                <MDX code={post.mdx} className="mx-5 sm:prose-lg md:mx-0" />
              </div>
            </div>
          ))}
      </div>
    </MaxWidthWrapper>
  )
}
