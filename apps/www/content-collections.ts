import { defineCollection, defineConfig } from "@content-collections/core"
import { compileMDX } from "@content-collections/mdx"
import { rehypeCode, remarkGfm } from "fumadocs-core/mdx-plugins"
import GithubSlugger from "github-slugger"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeSlug from "rehype-slug"

const computedFields = (
  type: "blog" | "changelog" | "customers" | "help" | "legal" | "integrations",
) => ({
  slug: (document) => {
    const slugger = new GithubSlugger()
    return document.slug || slugger.slug(document.title)
  },
  tableOfContents: (document) => {
    const content =
      document.content || document.body?.raw || document.mdx?.code || ""
    const headings = content.match(/^##\s(.+)$/gm)
    const slugger = new GithubSlugger()
    return (
      headings?.map((heading) => {
        const title = heading.replace(/^##\s/, "")
        return {
          title,
          slug: slugger.slug(title),
        }
      }) || []
    )
  },
  images: (document) => {
    if (!document.body?.raw) return []
    return (
      document.body.raw.match(/(?<=<Image[^>]*\bsrc=")[^"]+(?="[^>]*\/>)/g) ||
      []
    )
  },
  tweetIds: (document) => {
    if (!document.body?.raw) return []
    const tweetMatches = document.body.raw.match(/<Tweet\sid="[0-9]+"\s\/>/g)
    return tweetMatches?.map((tweet) => tweet.match(/[0-9]+/g)[0]) || []
  },
  githubRepos: (document) => {
    if (!document.body?.raw) return []
    return (
      document.body.raw.match(
        /(?<=<GithubRepo[^>]*\burl=")[^"]+(?="[^>]*\/>)/g,
      ) || []
    )
  },
})

const BlogPost = defineCollection({
  name: "BlogPost",
  directory: "src/content/blog",
  include: "*.mdx",
  schema: (z) => ({
    title: z.string(),
    categories: z
      .array(z.enum(["company", "engineering", "education", "customers"]))
      .default(["company"]),
    publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    featured: z.boolean().default(false),
    image: z.string(),
    images: z.array(z.string()).optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    author: z.string(),
    summary: z.string(),
    related: z.array(z.string()).optional(),
    githubRepos: z.array(z.string()).optional(),
    tweetIds: z.array(z.string()).optional(),
    slug: z.string().optional(),
  }),
  transform: async (document, context) => {
    try {
      const mdx = await compileMDX(context, document, {
        rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
        remarkPlugins: [remarkGfm],
      })
      console.log("MDX compilation successful for:", document.title)
      const computed = computedFields("blog")
      return {
        ...document,
        slug: computed.slug(document),
        mdx,
        related: document.related || [],
        tableOfContents: computed.tableOfContents({
          ...document,
          body: { raw: mdx.raw },
        }),
        images: computed.images({ ...document, body: { raw: mdx.raw } }),
        tweetIds: computed.tweetIds({ ...document, body: { raw: mdx.raw } }),
        githubRepos: computed.githubRepos({
          ...document,
          body: { raw: mdx.raw },
        }),
      }
    } catch (error) {
      console.error("Error compiling MDX for:", document.title, error)
      console.error("Error details:", error.stack)
      throw error
    }
  },
})

const ChangelogPost = defineCollection({
  name: "ChangelogPost",
  directory: "src/content/changelog",
  include: "*.mdx",
  schema: (z) => ({
    title: z.string(),
    publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    summary: z.string(),
    image: z.string(),
    author: z.string(),
    slug: z.string().optional(),
  }),
  transform: async (document, context) => {
    try {
      const mdx = await compileMDX(context, document, {
        rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
        remarkPlugins: [remarkGfm],
      })
      console.log("MDX compilation successful for:", document.title)
      const computed = computedFields("changelog")
      return {
        ...document,
        slug: computed.slug(document),
        mdx,
        tableOfContents: computed.tableOfContents({
          ...document,
          body: { raw: mdx.raw },
        }),
        images: computed.images({ ...document, body: { raw: mdx.raw } }),
        tweetIds: computed.tweetIds({ ...document, body: { raw: mdx.raw } }),
        githubRepos: computed.githubRepos({
          ...document,
          body: { raw: mdx.raw },
        }),
      }
    } catch (error) {
      console.error("Error compiling MDX for:", document.title, error)
      console.error("Error details:", error.stack)
      throw error
    }
  },
})

export const CustomersPost = defineCollection({
  name: "CustomersPost",
  directory: "src/content/customers",
  include: "*.mdx",
  schema: (z) => ({
    title: z.string(),
    publishedAt: z.string(),
    summary: z.string(),
    image: z.string(),
    company: z.string(),
    companyLogo: z.string(),
    companyUrl: z.string(),
    companyDescription: z.string(),
    companyIndustry: z.string(),
    companySize: z.string(),
    companyFounded: z.number(),
    plan: z.string(),
    slug: z.string().optional(),
  }),
  transform: async (document, context) => {
    try {
      const mdx = await compileMDX(context, document, {
        rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
        remarkPlugins: [remarkGfm],
      })
      console.log("MDX compilation successful for:", document.title)
      const computed = computedFields("customers")
      return {
        ...document,
        slug: computed.slug(document),
        mdx,
        tableOfContents: computed.tableOfContents({
          ...document,
          body: { raw: mdx.raw },
        }),
        images: computed.images({ ...document, body: { raw: mdx.raw } }),
        tweetIds: computed.tweetIds({ ...document, body: { raw: mdx.raw } }),
        githubRepos: computed.githubRepos({
          ...document,
          body: { raw: mdx.raw },
        }),
      }
    } catch (error) {
      console.error("Error compiling MDX for:", document.title, error)
      console.error("Error details:", error.stack)
      throw error
    }
  },
})

export const HelpPost = defineCollection({
  name: "HelpPost",
  directory: "src/content/help",
  include: "*.mdx",
  schema: (z) => ({
    title: z.string(),
    updatedAt: z.string(),
    summary: z.string(),
    author: z.string(),
    categories: z
      .array(z.enum(["oversikt", "starter", "eiendomsforvaltning", "api"]))
      .default(["oversikt"]),
    related: z.array(z.string()).optional(),
    excludeHeadingsFromSearch: z.boolean().optional(),
    slug: z.string().optional(),
  }),
  transform: async (document, context) => {
    try {
      const mdx = await compileMDX(context, document, {
        rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
        remarkPlugins: [remarkGfm],
      })

      const computed = computedFields("help")

      const result = {
        ...document,
        slug: computed.slug(document),
        mdx,
        tableOfContents: computed.tableOfContents(document),
        images: computed.images(document),
        tweetIds: computed.tweetIds(document),
        githubRepos: computed.githubRepos(document),
      }

      return result
    } catch (error) {
      console.error("Error compiling MDX for:", document.title, error)
      console.error("Error details:", error.stack)
      throw error
    }
  },
})

export const LegalPost = defineCollection({
  name: "LegalPost",
  directory: "src/content/legal",
  include: "*.mdx",
  schema: (z) => ({
    title: z.string(),
    updatedAt: z.string(),
    slug: z.string().optional(),
  }),
  transform: async (document, context) => {
    try {
      const mdx = await compileMDX(context, document, {
        rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
        remarkPlugins: [remarkGfm],
      })
      console.log("MDX compilation successful for:", document.title)
      const computed = computedFields("legal")
      return {
        ...document,
        slug: computed.slug(document),
        mdx,
        tableOfContents: computed.tableOfContents({
          ...document,
          body: { raw: mdx.raw },
        }),
        images: computed.images({ ...document, body: { raw: mdx.raw } }),
        tweetIds: computed.tweetIds({ ...document, body: { raw: mdx.raw } }),
        githubRepos: computed.githubRepos({
          ...document,
          body: { raw: mdx.raw },
        }),
      }
    } catch (error) {
      console.error("Error compiling MDX for:", document.title, error)
      console.error("Error details:", error.stack)
      throw error
    }
  },
})

export const IntegrationsPost = defineCollection({
  name: "IntegrationsPost",
  directory: "src/content/integrations",
  include: "*.mdx",
  schema: (z) => ({
    title: z.string(),
    publishedAt: z.string(),
    summary: z.string(),
    image: z.string(),
    company: z.string(),
    companyLogo: z.string(),
    companyUrl: z.string(),
    companyDescription: z.string(),
    integrationType: z.string(),
    slug: z.string().optional(),
  }),
  transform: async (document, context) => {
    try {
      const mdx = await compileMDX(context, document, {
        rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
        remarkPlugins: [remarkGfm],
      })
      console.log("MDX compilation successful for:", document.title)
      const computed = computedFields("integrations")
      return {
        ...document,
        slug: computed.slug(document),
        mdx,
        tableOfContents: computed.tableOfContents({
          ...document,
          body: { raw: mdx.raw },
        }),
        images: computed.images({ ...document, body: { raw: mdx.raw } }),
        tweetIds: computed.tweetIds({ ...document, body: { raw: mdx.raw } }),
        githubRepos: computed.githubRepos({
          ...document,
          body: { raw: mdx.raw },
        }),
      }
    } catch (error) {
      console.error("Error compiling MDX for:", document.title, error)
      console.error("Error details:", error.stack)
      throw error
    }
  },
})

export default defineConfig({
  collections: [
    BlogPost,
    ChangelogPost,
    CustomersPost,
    HelpPost,
    LegalPost,
    IntegrationsPost,
  ],
})
