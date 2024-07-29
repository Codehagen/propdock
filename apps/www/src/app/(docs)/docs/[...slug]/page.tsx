import { MDXComponent } from "@/components/content/mdx-components"
import { getPage } from "@/app/source"

export default function DocPage({ params }: { params: { slug: string[] } }) {
  const page = getPage(params.slug)

  if (!page) {
    return <div>Page not found</div>
  }

  return (
    <div className="mx-auto max-w-3xl py-10">
      <h1 className="mb-4 text-3xl font-bold">{page.data.title}</h1>
      <MDXComponent code={page.data.body} />
    </div>
  )
}
