"use client";

import { motion } from "framer-motion";
import { Check, List } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import { BLOG_CATEGORIES } from "@/lib/blog/content";
import { cn } from "@/lib/utils";

import MaxWidthWrapper from "./max-width-wrapper";
import Popover from "./popover";

export default function BlogLayoutHero() {
  const { slug } = useParams() as { slug?: string };

  const data = BLOG_CATEGORIES.find(category => category.slug === slug);

  const [openPopover, setOpenPopover] = useState(false);

  return (
    <>
      <MaxWidthWrapper>
        <div className="max-w-screen-sm py-16">
          <h1 className="font-display font-extrabold text-3xl text-foreground sm:text-4xl">
            {data?.title || "Blogg"}
          </h1>
          <p className="mt-4 text-muted-foreground text-xl">
            {data?.description ||
              "Siste nyheter og oppdateringer fra Propdock."}
          </p>
          <nav className="mt-6 hidden w-fit items-center space-x-2 rounded-full border border-border bg-background p-2 md:flex">
            <CategoryLink title="Oversikt" href="/blog" active={!slug} />
            {BLOG_CATEGORIES.map(category => (
              <CategoryLink
                key={category.slug}
                title={category.title}
                href={`/blog/category/${category.slug}`}
                active={category.slug === slug}
              />
            ))}
            <CategoryLink title="Kundehistorier" href="/customers" />
            <CategoryLink title="Endringslogg" href="/changelog" />
          </nav>
        </div>
      </MaxWidthWrapper>
      <Popover
        content={
          <div className="w-full p-4">
            <CategoryLink
              title="Oversikt"
              href="/blog"
              active={!slug}
              mobile
              setOpenPopover={setOpenPopover}
            />
            {BLOG_CATEGORIES.map(category => (
              <CategoryLink
                key={category.slug}
                title={category.title}
                href={`/blog/category/${category.slug}`}
                active={category.slug === slug}
                mobile
                setOpenPopover={setOpenPopover}
              />
            ))}
            <CategoryLink title="Kundehistorier" href="/customers" mobile />
            <CategoryLink title="Endringslogg" href="/changelog" mobile />
          </div>
        }
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
        mobileOnly
      >
        <button
          onClick={() => {
            setOpenPopover(!openPopover);
          }}
          className="flex w-full items-center space-x-2 border-border border-t px-2.5 py-4 text-foreground text-sm"
        >
          <List size={16} />
          <p>Kategorier</p>
        </button>
      </Popover>
    </>
  );
}

const CategoryLink = ({
  title,
  href,
  active,
  mobile,
  setOpenPopover
}: {
  title: string;
  href: string;
  active?: boolean;
  mobile?: boolean;
  setOpenPopover?: (open: boolean) => void;
}) => {
  if (mobile) {
    return (
      <Link
        href={href}
        {...(setOpenPopover && {
          onClick: () => setOpenPopover(false)
        })}
        className="flex w-full items-center justify-between rounded-md p-2 transition-colors hover:bg-muted active:bg-muted/80"
      >
        <p className="text-muted-foreground text-sm">{title}</p>
        {active && <Check size={16} className="text-muted-foreground" />}
      </Link>
    );
  }
  return (
    <Link href={href} className="relative z-10">
      <div
        className={cn(
          "rounded-full px-4 py-2 text-sm transition-all",
          active
            ? "text-primary-foreground"
            : "text-muted-foreground hover:bg-muted active:bg-muted/80"
        )}
      >
        {title}
      </div>
      {active && (
        <motion.div
          layoutId="indicator"
          className="absolute top-0 left-0 h-full w-full rounded-full bg-gradient-to-tr from-primary via-primary/80 to-primary"
          style={{ zIndex: -1 }}
        />
      )}
    </Link>
  );
};
