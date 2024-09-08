"use client";

import va from "@vercel/analytics";
import { Command, useCommandState } from "cmdk";
import { allHelpPosts } from "content-collections";
import Fuse from "fuse.js";
import { useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDebouncedCallback } from "use-debounce";

import { APP_HOSTNAMES, HOME_DOMAIN } from "@/lib/blog/constructMetadata";
import { POPULAR_ARTICLES } from "@/lib/blog/content";

import ExpandingArrow from "./icons/expanding-arrow";
import Magic from "./icons/magic";
import Modal from "./modal";

function CMDKHelper({
  showCMDK,
  setShowCMDK
}: {
  showCMDK: boolean;
  setShowCMDK: Dispatch<SetStateAction<boolean>>;
}) {
  const commandListRef = useRef<HTMLDivElement>(null);
  const debouncedTrackSearch = useDebouncedCallback((query: string) => {
    va.track("CMDK Search", {
      query
    });
  }, 1000);

  return (
    <Modal
      showModal={showCMDK}
      setShowModal={setShowCMDK}
      className="sm:max-w-xl"
    >
      <Command label="CMDK" loop shouldFilter={false}>
        <Command.Input
          autoFocus
          onInput={e => {
            // hack to scroll to top of list when input changes (for some reason beyond my comprehension, setTimeout is needed)
            setTimeout(() => {
              commandListRef.current?.scrollTo(0, 0);
            }, 0);
            debouncedTrackSearch(e.currentTarget.value);
          }}
          placeholder="Søk etter artikler, guider og mer..."
          className="w-full border-none bg-background p-4 font-normal text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
        />
        <Command.List
          ref={commandListRef}
          className="scrollbar-hide h-[50vh] max-h-[360px] min-h-[250px] overflow-scroll border-border border-t bg-background p-2 transition-all sm:h-[calc(var(--cmdk-list-height)+10rem)]"
        >
          <Command.Empty className="flex cursor-not-allowed items-center space-x-2 rounded-md bg-muted px-4 py-2 text-muted-foreground text-sm">
            <Magic className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col space-y-1">
              <p className="font-medium text-primary text-sm">
                Ask AI (Coming soon)
              </p>
              <p className="text-muted-foreground text-xs">
                Use our AI to find answers to your questions
              </p>
            </div>
          </Command.Empty>
          <CommandResults setShowCMDK={setShowCMDK} />
        </Command.List>
      </Command>
    </Modal>
  );
}

const CommandResults = ({
  setShowCMDK
}: {
  setShowCMDK: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const popularArticles = POPULAR_ARTICLES.map(
    slug => allHelpPosts.find(post => post.slug === slug)!
  );

  const allItems = [
    ...allHelpPosts.map(post => ({
      ...post,
      description: post.summary
    })),
    // get all table of contents headings too
    ...allHelpPosts.flatMap(post => {
      if (post.excludeHeadingsFromSearch) {
        return [];
      }
      return post.tableOfContents.map(
        (toc: { title: string; slug: string }) => ({
          slug: `${post.slug}#${toc.slug}`,
          title: toc.title,
          description: null, // omit description since we don't want to search it
          summary: `In: "${post.title}"`
        })
      );
    })
  ];

  const fuse = useMemo(
    () =>
      new Fuse(allItems, {
        keys: ["title", "description"]
      }),
    [allItems]
  );

  const search = useCommandState(state => state.search);

  const results = useMemo(() => {
    if (search.length === 0) {
      return popularArticles.filter(article => article?.slug);
    }
    return fuse
      .search(search)
      .map(r => r.item)
      .filter(item => item?.slug);
  }, [search, popularArticles]);

  return results.map(({ slug, title, summary }) => (
    <Command.Item
      key={slug}
      value={title}
      onSelect={() => {
        va.track("CMDK Search Selected", {
          query: search,
          slug
        });
        if (APP_HOSTNAMES.has(window.location.hostname)) {
          // this is from the app, open in new tab
          window.open(`${HOME_DOMAIN}/help/article/${slug}`);
        } else {
          router.push(`/help/article/${slug}`);
        }
        setShowCMDK(false);
      }}
      className="group flex cursor-pointer items-center justify-between space-x-2 rounded-md px-4 py-2 hover:bg-muted active:bg-muted/70 aria-selected:bg-muted"
    >
      <div className="flex flex-col space-y-1">
        <Highlighter
          highlightClassName="underline bg-transparent text-purple-500 dark:text-purple-400"
          searchWords={search.split(" ")}
          autoEscape={true}
          textToHighlight={title}
          className="font-medium text-foreground text-sm group-aria-selected:text-purple-600 sm:group-hover:text-purple-600 dark:group-aria-selected:text-purple-400 dark:sm:group-hover:text-purple-400"
        />
        <Highlighter
          highlightClassName="underline bg-transparent text-purple-500 dark:text-purple-400"
          searchWords={search.split(" ")}
          autoEscape={true}
          textToHighlight={summary}
          className="line-clamp-1 text-muted-foreground text-xs"
        />
      </div>
      <ExpandingArrow className="-ml-4 invisible h-4 w-4 text-purple-600 group-aria-selected:visible sm:group-hover:visible dark:text-purple-400" />
    </Command.Item>
  ));
};

export default function useCMDK() {
  const [showCMDK, setShowCMDK] = useState(false);

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const existingModalBackdrop = document.getElementById("modal-backdrop");
      if (e.key === "k" && (e.metaKey || e.ctrlKey) && !existingModalBackdrop) {
        e.preventDefault();
        setShowCMDK(showCMDK => !showCMDK);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const CMDK = useCallback(() => {
    return <CMDKHelper showCMDK={showCMDK} setShowCMDK={setShowCMDK} />;
  }, [showCMDK, setShowCMDK]);

  return useMemo(
    () => ({ showCMDK, setShowCMDK, CMDK }),
    [showCMDK, setShowCMDK, CMDK]
  );
}
