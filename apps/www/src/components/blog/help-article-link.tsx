import Link from "next/link"
import { HelpPost } from "content-collections"

import ExpandingArrow from "./icons/expanding-arrow"

export default function HelpArticleLink({ article }: { article: HelpPost }) {
  return (
    <Link
      href={`/help/article/${article.slug}`}
      className="group flex items-center justify-between rounded-lg px-2 py-3 transition-colors hover:bg-muted active:bg-muted/70 sm:px-4"
    >
      <h3 className="text-sm font-medium text-foreground group-hover:text-primary sm:text-base">
        {article.title}
      </h3>
      <ExpandingArrow className="-ml-4 h-4 w-4 text-muted-foreground group-hover:text-primary" />
    </Link>
  )
}
