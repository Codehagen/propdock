import {
  allBlogPosts,
  allChangelogPosts,
  allCustomersPosts,
  allHelpPosts,
} from "content-collections";
import type { MetadataRoute } from "next";

import { BLOG_CATEGORIES, HELP_CATEGORIES } from "@/lib/blog/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const domain = "propdock.no"; // Replace with your actual domain

  const staticPages = [
    {
      url: `https://${domain}/`,
      lastModified: new Date(),
    },
    {
      url: `https://${domain}/pricing`,
      lastModified: new Date(),
    },
    {
      url: `https://${domain}/blog`,
      lastModified: new Date(),
    },
    {
      url: `https://${domain}/customers`,
      lastModified: new Date(),
    },
    {
      url: `https://${domain}/help`,
      lastModified: new Date(),
    },
    {
      url: `https://${domain}/changelog`,
      lastModified: new Date(),
    },
  ];

  const blogPosts = allBlogPosts.map((post) => ({
    url: `https://${domain}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
  }));

  const blogCategories = BLOG_CATEGORIES.map((category) => ({
    url: `https://${domain}/blog/category/${category.slug}`,
    lastModified: new Date(),
  }));

  const customersPosts = allCustomersPosts.map((post) => ({
    url: `https://${domain}/customers/${post.slug}`,
    lastModified: new Date(post.publishedAt),
  }));

  const helpPosts = allHelpPosts.map((post) => ({
    url: `https://${domain}/help/article/${post.slug}`,
    lastModified: new Date(post.updatedAt),
  }));

  const helpCategories = HELP_CATEGORIES.map((category) => ({
    url: `https://${domain}/help/category/${category.slug}`,
    lastModified: new Date(),
  }));

  const changelogPosts = allChangelogPosts.map((post) => ({
    url: `https://${domain}/changelog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
  }));

  return [
    ...staticPages,
    ...blogPosts,
    ...blogCategories,
    ...customersPosts,
    ...helpPosts,
    ...helpCategories,
    ...changelogPosts,
  ];
}
