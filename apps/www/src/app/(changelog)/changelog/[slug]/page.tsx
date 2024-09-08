import { allChangelogPosts } from "content-collections";
import { Facebook, Linkedin, Twitter } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Author from "@/components/blog/author";
import MaxWidthWrapper from "@/components/blog/max-width-wrapper";
import { MDX } from "@/components/blog/mdx";
import BlurImage from "@/lib/blog/blur-image";
import { constructMetadata } from "@/lib/blog/constructMetadata";
import { getBlurDataURL } from "@/lib/blog/images";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  return allChangelogPosts.map(post => ({
    slug: post.slug
  }));
}

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  const post = allChangelogPosts.find(post => post.slug === params.slug);
  if (!post) {
    return;
  }

  const { title, summary: description, image } = post;

  return constructMetadata({
    title,
    description,
    image
  });
}

export default async function ChangelogPost({
  params
}: {
  params: { slug: string };
}) {
  const post = allChangelogPosts.find(post => post.slug === params.slug);
  if (!post) {
    notFound();
  }

  return (
    <MaxWidthWrapper className="my-20 grid px-0 md:grid-cols-4">
      <div className="sticky top-10 hidden self-start md:col-span-1 md:block">
        <Link
          href="/changelog"
          className="text-gray-500 text-sm transition-colors hover:text-gray-800"
        >
          ← Tilbake til Endringslogg
        </Link>
      </div>
      <div className="flex flex-col space-y-8 md:col-span-3">
        <div className="mx-5 grid gap-5 md:mx-0">
          <div className="flex flex-col">
            <Link
              href="/changelog"
              className="my-5 text-gray-500 text-sm md:hidden"
            >
              ← Tilbake til Endringslogg
            </Link>
            <time
              dateTime={post.publishedAt}
              className="flex items-center text-gray-500 text-sm md:text-base"
            >
              {formatDate(post.publishedAt)}
            </time>
          </div>
          <h1 className="font-bold font-display text-3xl text-gray-800 tracking-tight sm:text-4xl">
            {post.title}
          </h1>
        </div>
        <BlurImage
          src={post.image}
          alt={post.title}
          width={1200}
          height={630}
          priority // since it's above the fold
          placeholder="blur"
          blurDataURL={await getBlurDataURL(post.image)}
          className="aspect-video border border-gray-100 object-cover md:rounded-2xl"
        />
        <div className="mx-5 mb-10 flex items-center justify-between md:mx-0">
          <Author username={post.author} />
          <div className="flex items-center space-x-6">
            <Link
              href={`https://twitter.com/intent/tweet?text=${post.title}&url=https://propdock.no/changelog/${post.slug}&via=${post.author}`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all hover:scale-110"
            >
              <Twitter className="h-6 w-6" />
            </Link>
            <Link
              href={`
            http://www.linkedin.com/shareArticle?mini=true&url=https://propdock.no/changelog/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all hover:scale-110"
            >
              <Linkedin className="h-6 w-6" fill="black" />
            </Link>
            <Link
              href={`https://www.facebook.com/sharer/sharer.php?u=https://propdock.no/changelog/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all hover:scale-110"
            >
              <Facebook className="h-6 w-6" fill="black" />
            </Link>
          </div>
        </div>
        <MDX code={post.mdx} className="sm:prose-lg mx-5 md:mx-0" />
        <div className="mt-10 flex justify-end border-gray-200 border-t pt-5">
          <Link
            href={`https://github.com/codehagen/propdock/blob/main/apps/www/src/content/changelog/${params.slug}.mdx`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 text-sm transition-colors hover:text-gray-800"
          >
            <p>Fant du en skrivefeil? Rediger denne siden →</p>
          </Link>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
