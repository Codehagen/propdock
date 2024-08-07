import type { ReactNode } from "react"
import { Suspense } from "react"

import { marketingConfig } from "@/config/marketing"
import { getCurrentUser } from "@/lib/session"
import BlogLayoutHero from "@/components/blog/blog-layout-hero"
import MaxWidthWrapper from "@/components/blog/max-width-wrapper"
import { NavBar } from "@/components/layout/navbar"
import { SiteFooter } from "@/components/layout/site-footer"

export default async function BlogLayout({
  children,
}: {
  children: ReactNode
}) {
  const user = await getCurrentUser()

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Suspense fallback="...">
        <NavBar user={user} items={marketingConfig.mainNav} scroll={true} />
      </Suspense>
      <main className="flex-1">
        <BlogLayoutHero />
        <div className="border-t border-border bg-background/50 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur-lg dark:bg-background/30">
          <MaxWidthWrapper className="grid grid-cols-1 gap-8 py-10 md:grid-cols-2">
            {children}
          </MaxWidthWrapper>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
