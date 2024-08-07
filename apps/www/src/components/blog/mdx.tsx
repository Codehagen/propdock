import Link from "next/link"
import { MDXContent } from "@content-collections/mdx/react"
import {
  allBlogPosts,
  allChangelogPosts,
  allHelpPosts,
} from "content-collections"
import { ListChecks } from "lucide-react"

import BlurImage from "@/lib/blog/blur-image"
import { HELP_CATEGORIES, POPULAR_ARTICLES } from "@/lib/blog/content"
import { cn, formatDate } from "@/lib/utils"

import CategoryCard from "./category-card"
import CopyBox from "./copy-box"
import HelpArticleLink from "./help-article-link"
import ExpandingArrow from "./icons/expanding-arrow"
import ZoomImage from "./zoom-image"

const CustomLink = (props: any) => {
  const href = props.href

  if (href.startsWith("/")) {
    return (
      <Link {...props} href={href}>
        {props.children}
      </Link>
    )
  }

  if (href.startsWith("#")) {
    return <a {...props} />
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />
}

const components = {
  h2: (props: any) => (
    <h2
      className="text-2xl text-foreground underline-offset-4 hover:underline"
      {...props}
    />
  ),
  a: (props: any) => (
    <CustomLink
      className="font-medium text-muted-foreground underline-offset-4 hover:text-foreground"
      {...props}
    />
  ),
  code: (props: any) => (
    <code
      className="rounded-md border border-border bg-muted px-2 py-1 font-medium text-muted-foreground before:hidden after:hidden"
      {...props}
    />
  ),
  thead: (props: any) => (
    <thead className="border-b border-border" {...props} />
  ),
  th: (props: any) => (
    <th
      className="px-4 py-2 text-left font-medium text-foreground"
      {...props}
    />
  ),
  td: (props: any) => (
    <td
      className="border-t border-border px-4 py-2 text-muted-foreground"
      {...props}
    />
  ),
  p: (props: any) => (
    <p className="text-foreground dark:text-muted-foreground" {...props} />
  ),
  li: (props: any) => (
    <li className="text-foreground dark:text-muted-foreground" {...props} />
  ),
  Note: (props: any) => (
    <div
      className={cn(
        "mt-4 rounded-md border-l-4 border-border bg-muted px-4 py-1 text-[0.95rem] leading-[1.4rem] text-foreground",
        {
          "border-yellow-500 bg-yellow-100 dark:bg-yellow-900/30":
            props.variant === "warning",
          "border-blue-500 bg-blue-100 dark:bg-blue-900/30":
            props.variant === "info",
          "border-green-500 bg-green-100 dark:bg-green-900/30":
            props.variant === "success",
        },
      )}
      {...props}
    />
  ),
  Quote: (props: {
    author: string
    authorSrc: string
    title: string
    company: string
    companySrc: string
    text: string
  }) => (
    <div className="not-prose mt-4 flex flex-col items-center justify-center space-y-4 rounded-md border border-border bg-card p-10">
      <div className="w-fit rounded-full bg-gradient-to-r from-blue-100 to-green-100 p-1.5 dark:from-blue-900 dark:to-green-900">
        <BlurImage
          className="h-20 w-20 rounded-full border-2 border-background"
          src={props.authorSrc}
          alt={props.author}
          width={80}
          height={80}
        />
      </div>
      <p className="text-center text-lg text-muted-foreground [text-wrap:balance]">
        "{props.text}"
      </p>
      <div className="flex items-center justify-center space-x-2">
        <BlurImage
          className="h-12 w-12 rounded-md border-2 border-background"
          src={props.companySrc}
          alt={props.company}
          width={48}
          height={48}
        />
        <div className="flex flex-col">
          <p className="font-semibold text-foreground">{props.author}</p>
          <p className="text-sm text-muted-foreground">{props.title}</p>
        </div>
      </div>
    </div>
  ),
  Prerequisites: (props: any) => (
    <div className="mt-4 rounded-md border border-border bg-card px-6 py-1 text-[0.95rem] leading-[1.4rem] shadow-md">
      <div className="-mb-6 flex items-center space-x-2 text-muted-foreground">
        <ListChecks size={20} />
        <p className="text-sm font-medium uppercase">Prerequisites</p>
      </div>
      {props.children}
    </div>
  ),
  CopyBox,
  HelpArticles: (props: { articles: string[] }) => (
    <div className="not-prose grid gap-2 rounded-xl border border-border bg-card p-4">
      {(props.articles || POPULAR_ARTICLES).map((slug) => (
        <HelpArticleLink
          key={slug}
          article={allHelpPosts.find((post) => post.slug === slug)!}
        />
      ))}
    </div>
  ),
  HelpCategories: () => (
    <div className="not-prose grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {HELP_CATEGORIES.map((category) => (
        <CategoryCard
          key={category.slug}
          href={`/help/category/${category.slug}`}
          name={category.title}
          description={category.description}
          icon={category.icon}
          pattern={{
            y: 16,
            squares: [
              [0, 1],
              [1, 3],
            ],
          }}
        />
      ))}
    </div>
  ),
  Changelog: (props: any) => (
    <ul className="not-prose grid list-none rounded-xl border border-border bg-card p-4">
      {[...allBlogPosts, ...allChangelogPosts]
        .filter((post) => post.publishedAt <= props.before)
        .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
        .slice(0, props.count)
        .map((post) => (
          <li key={post.slug}>
            <Link
              href={`/${post.type === "BlogPost" ? "blog" : "changelog"}/${
                post.slug
              }`}
              className="group flex items-center justify-between rounded-lg px-2 py-3 transition-colors hover:bg-muted active:bg-muted/80 sm:px-4"
            >
              <div>
                <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
                  {formatDate(post.publishedAt)}
                </p>
                <h3 className="my-px text-base font-medium text-foreground group-hover:text-foreground">
                  {post.title}
                </h3>
                <p className="line-clamp-1 text-sm text-muted-foreground group-hover:text-foreground">
                  {post.summary}
                </p>
              </div>
              <ExpandingArrow className="-ml-4 h-4 w-4 text-muted-foreground group-hover:text-foreground" />
            </Link>
          </li>
        ))}
    </ul>
  ),
}

interface MDXProps {
  code: string
  images?: { alt: string; src: string; blurDataURL: string }[]
  tweets?: any[]
  repos?: any[]
  className?: string
}

export function MDX({ code, images, tweets, repos, className }: MDXProps) {
  const MDXImage = (props: any) => {
    if (!images) return null
    const blurDataURL = images.find(
      (image) => image.src === props.src,
    )?.blurDataURL

    return <ZoomImage {...props} blurDataURL={blurDataURL} />
  }

  // ... other custom components ...

  return (
    <article
      data-mdx-container
      className={cn(
        "prose-headings:font-display prose prose-gray max-w-none transition-all prose-headings:relative prose-headings:scroll-mt-20 prose-headings:font-bold",
        className,
      )}
    >
      <MDXContent
        code={code}
        components={{
          ...components,
          Image: MDXImage,
          // Tweet,
          // GithubRepo: MDXRepo,
        }}
      />
    </article>
  )
}
