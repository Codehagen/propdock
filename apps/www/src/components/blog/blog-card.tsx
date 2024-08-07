import Link from "next/link"

import BlurImage from "@/lib/blog/blur-image"
import { formatDate } from "@/lib/utils"

import Author from "./author"

interface BlogPost {
  title: string
  summary: string
  publishedAt: string
  image: string
  author: string
  slug: string
}

export default function BlogCard({
  data,
  priority,
}: {
  data: BlogPost & {
    blurDataURL: string
  }
  priority?: boolean
}) {
  return (
    <Link
      href={`/blog/${data.slug}`}
      className="flex flex-col rounded-lg border border-border bg-card text-card-foreground"
    >
      <BlurImage
        className="aspect-[1200/630] rounded-t-xl object-cover"
        src={data.image}
        blurDataURL={data.blurDataURL}
        width={1200}
        height={630}
        alt={data.title}
        priority={priority}
      />
      <div className="flex flex-1 flex-col justify-between rounded-b-lg p-6">
        <div>
          <h2 className="font-display line-clamp-1 text-2xl font-bold">
            {data.title}
          </h2>
          <p className="mt-2 line-clamp-2 text-muted-foreground">
            {data.summary}
          </p>
        </div>
        <div className="mt-4 flex items-center space-x-2">
          <Author username={data.author} imageOnly />
          <time
            dateTime={data.publishedAt}
            className="text-sm text-muted-foreground"
          >
            {formatDate(data.publishedAt)}
          </time>
        </div>
      </div>
    </Link>
  )
}
