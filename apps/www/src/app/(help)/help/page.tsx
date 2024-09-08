import CategoryCard from "@/components/blog/category-card";
import HelpArticleLink from "@/components/blog/help-article-link";
import MaxWidthWrapper from "@/components/blog/max-width-wrapper";
import SearchButton from "@/components/blog/search-button";
import { constructMetadata } from "@/lib/blog/constructMetadata";
import { HELP_CATEGORIES, getPopularArticles } from "@/lib/blog/content";

export const metadata = constructMetadata({
  title: "Hjelpesenter – Propdock",
  description: "Et samlet sted for alle dine Propdock-relaterte spørsmål."
});

export default function HelpCenter() {
  const popularArticles = getPopularArticles();
  return (
    <>
      <MaxWidthWrapper className="max-w-screen-lg">
        <div className="flex flex-col space-y-4 py-10">
          <h1 className="font-bold font-display text-foreground text-xl sm:text-3xl">
            👋 Hvordan kan vi hjelpe deg i dag?
          </h1>
          <SearchButton />
        </div>
      </MaxWidthWrapper>

      <div className="relative">
        <div className="absolute top-28 h-full w-full border border-border bg-background/50 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur-lg dark:bg-background/30" />
        <MaxWidthWrapper className="max-w-screen-lg pb-20">
          <div className="relative mb-10 rounded-xl border border-border bg-card px-4 py-6">
            <h2 className="px-4 font-bold font-display text-2xl text-foreground">
              Populære Artikler
            </h2>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {popularArticles.map(article => (
                <HelpArticleLink
                  key={article.slug || article.title}
                  article={article}
                />
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {HELP_CATEGORIES.map(category => (
              <CategoryCard
                key={category.slug}
                href={`/help/category/${category.slug}`}
                name={category.title}
                description={category.description}
                icon={category.icon}
                pattern={{
                  y: 16,
                  squares: [
                    [0, 1],
                    [1, 3]
                  ]
                }}
              />
            ))}
          </div>
        </MaxWidthWrapper>
      </div>
    </>
  );
}
