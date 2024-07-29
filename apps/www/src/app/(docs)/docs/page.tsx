import Link from "next/link"

import { getPages } from "@/app/source"

export default function DocsLandingPage() {
  const pages = getPages()

  return (
    <div className="mx-auto max-w-3xl py-10">
      <h1 className="mb-4 text-3xl font-bold">Documentation</h1>
      <ul>
        {pages.map((page) => (
          <li key={page.slugs.join("/")} className="mb-2">
            <Link
              href={`/docs/${page.slugs.join("/")}`}
              className="text-blue-500 hover:underline"
            >
              {page.data.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
