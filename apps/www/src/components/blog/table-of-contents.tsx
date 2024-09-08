"use client";

import Link from "next/link";

import useCurrentAnchor from "@/lib/blog/use-current-anchor";
import { cn } from "@/lib/utils";

export default function TableOfContents({
  items
}: {
  items: {
    title: string;
    slug: string;
  }[];
}) {
  const currentAnchor = useCurrentAnchor();

  return (
    <div className="grid gap-4 border-gray-200 border-l-2">
      {items.map((item, idx) => (
        <Link
          key={item.slug}
          href={`#${item.slug}`}
          className={cn("-ml-0.5 pl-4 text-gray-500 text-sm", {
            "border-black border-l-2 text-black": currentAnchor
              ? currentAnchor === item.slug
              : idx === 0
          })}
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
}
