import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { allHelpPosts } from "content-collections"
import { ChevronRight } from "lucide-react"

import { constructMetadata } from "@/lib/blog/constructMetadata"
import { HELP_CATEGORIES, POPULAR_ARTICLES } from "@/lib/blog/content"
import HelpArticleLink from "@/components/blog/help-article-link"
import MaxWidthWrapper from "@/components/blog/max-width-wrapper"
import SearchButton from "@/components/blog/search-button"

export async function generateStaticParams() {
  return HELP_CATEGORIES.map((category) => ({
    slug: category.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata | undefined> {
  const category = HELP_CATEGORIES.find(
    (category) => category.slug === params.slug,
  )
  if (!category) {
    return
  }

  const { title, description } = category

  return constructMetadata({
    title: `${title} – Propdock Hjelpesenter`,
    description,
    image: `/api/og/help?title=${encodeURIComponent(
      title,
    )}&summary=${encodeURIComponent(description)}`,
  })
}

export default function HelpCategory({
  params,
}: {
  params: {
    slug: string
  }
}) {
  const data = HELP_CATEGORIES.find((category) => category.slug === params.slug)
  if (!data) {
    notFound()
  }
  const articles = allHelpPosts
    .filter((post) => post.categories.includes(data.slug))
    // order by POPULAR_ARTICLES
    .reduce(
      (acc, curr) => {
        if (POPULAR_ARTICLES.includes(curr.slug)) {
          acc.unshift(curr)
        } else {
          acc.push(curr)
        }
        return acc
      },
      [] as typeof allHelpPosts,
    )

  return (
    <>
      <MaxWidthWrapper className="flex max-w-screen-lg flex-col py-10">
        <SearchButton />
      </MaxWidthWrapper>

      <div className="min-h-[50vh] border border-gray-200 bg-white/50 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur-lg">
        <MaxWidthWrapper className="flex max-w-screen-lg flex-col py-10">
          <div className="flex items-center space-x-2">
            <Link
              href="/help"
              className="text-sm font-medium text-gray-500 hover:text-gray-800"
            >
              Alle kategorier
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link
              href={`/help/category/${data.slug}`}
              className="text-sm font-medium text-gray-500 hover:text-gray-800"
            >
              {data.title}
            </Link>
          </div>
          <div className="my-8 flex flex-col space-y-4">
            <Link href={`/help/category/${data.slug}`}>
              <h1 className="font-display text-2xl font-bold sm:text-4xl">
                {data.title}
              </h1>
            </Link>
            <p className="text-gray-500">{data.description}</p>
          </div>
          <div className="grid gap-2 rounded-xl border border-gray-200 bg-white p-4">
            {articles.map((article) => (
              <HelpArticleLink key={article.slug} article={article} />
            ))}
          </div>
        </MaxWidthWrapper>
      </div>
    </>
  )
}
