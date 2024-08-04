// content-collections.ts
import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import GithubSlugger from "github-slugger";
var BlogPost = defineCollection({
  name: "BlogPost",
  directory: "src/content/blog",
  include: "*.mdx",
  schema: (z) => ({
    title: z.string(),
    categories: z.array(z.enum(["company", "engineering", "education", "customers"])).default(["company"]),
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
    tweetIds: z.array(z.string()).optional()
  }),
  transform: async (document, context) => {
    const slugger = new GithubSlugger();
    try {
      console.log("Starting MDX compilation for:", document.title);
      console.log("MDX content:", document.content.substring(0, 500) + "...");
      const mdx = await compileMDX(context, document);
      console.log("MDX compilation successful for:", document.title);
      return {
        ...document,
        slug: slugger.slug(document.title),
        mdx
      };
    } catch (error) {
      console.error("Error compiling MDX for:", document.title, error);
      console.error("Error details:", error.stack);
      throw error;
    }
  }
});
var ChangelogPost = defineCollection({
  name: "ChangelogPost",
  directory: "src/content/changelog",
  include: "*.mdx",
  schema: (z) => ({
    title: z.string(),
    publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    summary: z.string(),
    image: z.string(),
    author: z.string()
  }),
  transform: async (document, context) => {
    const slugger = new GithubSlugger();
    const mdx = await compileMDX(context, document);
    return {
      ...document,
      slug: slugger.slug(document.title),
      mdx
    };
  }
});
var CustomersPost = defineCollection({
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
    plan: z.string()
  }),
  transform: async (document, context) => {
    const slugger = new GithubSlugger();
    const mdx = await compileMDX(context, document);
    return {
      ...document,
      slug: slugger.slug(document.title),
      mdx
    };
  }
});
var HelpPost = defineCollection({
  name: "HelpPost",
  directory: "src/content/help",
  include: "*.mdx",
  schema: (z) => ({
    title: z.string(),
    updatedAt: z.string(),
    summary: z.string(),
    author: z.string(),
    categories: z.array(
      z.enum([
        "overview",
        "getting-started",
        "link-management",
        "custom-domains",
        "migrating",
        "saml-sso",
        "api"
      ])
    ).default(["overview"]),
    related: z.array(z.string()).optional(),
    excludeHeadingsFromSearch: z.boolean().optional()
  }),
  transform: async (document, context) => {
    const slugger = new GithubSlugger();
    const mdx = await compileMDX(context, document);
    return {
      ...document,
      slug: slugger.slug(document.title),
      mdx
    };
  }
});
var content_collections_default = defineConfig({
  collections: [BlogPost, ChangelogPost, CustomersPost, HelpPost]
});
export {
  CustomersPost,
  HelpPost,
  content_collections_default as default
};
