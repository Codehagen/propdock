"use client";

import { Search } from "lucide-react";
import { useContext } from "react";

import { AppContext } from "@/components/providers";

export default function SearchButton() {
  const { setShowCMDK } = useContext(AppContext);
  return (
    <button
      onClick={() => setShowCMDK(true)}
      className="group relative flex focus:outline-none"
    >
      <Search className="absolute inset-y-0 left-4 z-10 my-auto h-4 w-4 text-muted-foreground" />
      <div className="w-full rounded-xl border border-border bg-background p-3 pl-12 text-left text-muted-foreground transition-colors group-active:bg-muted">
        Søk etter artikler...
      </div>
      <span className="absolute inset-y-0 right-4 my-auto h-5 text-muted-foreground text-sm">
        ⌘K
      </span>
    </button>
  );
}
