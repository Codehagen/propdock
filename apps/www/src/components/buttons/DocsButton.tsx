import Link from "next/link"
import { buttonVariants } from "@propdock/ui/components/button"

import { cn } from "@/lib/utils"

export function DocsButton() {
  return (
    <Link
      href="https://docs.propdock.no/"
      className={cn(buttonVariants({ variant: "outline" }), "px-4")}
    >
      Explore Docs
    </Link>
  )
}
