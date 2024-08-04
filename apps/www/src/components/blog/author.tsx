import Link from "next/link"

import BlurImage from "@/lib/blog/blur-image"
import { timeAgo } from "@/lib/utils"

export default async function Author({
  username,
  updatedAt,
  imageOnly,
}: {
  username: string
  updatedAt?: string
  imageOnly?: boolean
}) {
  const authors = {
    christer: {
      name: "Christer",
      image: "https://d2vwwcvoksz7ty.cloudfront.net/author/steven.jpg",
    },
    fmerian: {
      name: "Flo Merian",
      image: "https://d2vwwcvoksz7ty.cloudfront.net/author/fmerian.jpg",
    },
  }

  if (!authors[username]) {
    console.error(`Author not found: ${username}`)
    return null
  }

  return imageOnly ? (
    <BlurImage
      src={authors[username].image}
      alt={authors[username].name}
      width={36}
      height={36}
      className="rounded-full transition-all group-hover:brightness-90"
    />
  ) : updatedAt ? (
    <div className="flex items-center space-x-3">
      <BlurImage
        src={authors[username].image}
        alt={authors[username].name}
        width={36}
        height={36}
        className="rounded-full"
      />
      <div className="flex flex-col">
        <p className="text-sm text-gray-500">
          Skrevet av {authors[username].name}
        </p>
        <time dateTime={updatedAt} className="text-sm font-light text-gray-400">
          Sist oppdatert {timeAgo(new Date(updatedAt))}
        </time>
      </div>
    </div>
  ) : (
    <Link
      href={`https://twitter.com/${username}`}
      className="group flex items-center space-x-3"
      target="_blank"
      rel="noopener noreferrer"
    >
      <BlurImage
        src={authors[username].image}
        alt={authors[username].name}
        width={40}
        height={40}
        className="rounded-full transition-all group-hover:brightness-90"
      />
      <div className="flex flex-col">
        <p className="font-semibold text-gray-700">{authors[username].name}</p>
        <p className="text-sm text-gray-500">@{username}</p>
      </div>
    </Link>
  )
}
