import { allBlogPosts } from "content-collections"

import { getBlurDataURL } from "@/lib/blog/images"
import BlogCard from "@/components/blog/blog-card"

export default async function Blog() {
  const articles = await Promise.all(
    allBlogPosts
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      )
      .map(async (post) => ({
        ...post,
        blurDataURL: await getBlurDataURL(post.image),
      })),
  )

  return articles.map((article, idx) => (
    <BlogCard key={article.slug} data={article} priority={idx <= 1} />
  ))
}
