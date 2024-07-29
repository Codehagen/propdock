import Link from "next/link"
import { compileMDX, MDXRemote } from "next-mdx-remote/rsc"

const components = {
  h1: (props: any) => (
    <h1 className="mb-4 mt-8 text-3xl font-bold" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="mb-3 mt-6 text-2xl font-semibold" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="mb-2 mt-4 text-xl font-medium" {...props} />
  ),
  p: (props: any) => <p className="mb-4" {...props} />,
  ul: (props: any) => <ul className="mb-4 list-disc pl-6" {...props} />,
  ol: (props: any) => <ol className="mb-4 list-decimal pl-6" {...props} />,
  li: (props: any) => <li className="mb-1" {...props} />,
  a: (props: any) => (
    <Link className="text-blue-500 hover:underline" {...props} />
  ),
  code: (props: any) => (
    <code className="rounded bg-gray-100 px-1 py-0.5" {...props} />
  ),
  pre: (props: any) => (
    <pre className="mb-4 overflow-x-auto rounded bg-gray-100 p-4" {...props} />
  ),
}

export async function MDXComponent({ code }: { code: string }) {
  const { content } = await compileMDX({
    source: code,
    components,
    options: {
      parseFrontmatter: true,
    },
  })

  return content
}
