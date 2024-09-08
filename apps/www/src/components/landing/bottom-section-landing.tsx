"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";

import { GetStartedButton } from "../buttons/GetStartedButton";

export default function BottomSectionLanding() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="-mt-20 relative mx-auto mb-20 max-w-[80rem] px-6 text-center md:px-8">
      <h2 className="translate-y-[-1rem] animate-fade-in text-balance bg-gradient-to-br from-30% from-black to-black/40 bg-clip-text py-6 font-medium text-5xl text-transparent leading-none tracking-tighter opacity-0 [--animation-delay:200ms] sm:text-6xl md:text-7xl lg:text-8xl dark:from-white dark:to-white/40">
        Prøv Propdock
        <br className="hidden md:block" /> Available today.
      </h2>
      <div className="mt-10 space-x-4">
        <GetStartedButton />
      </div>
    </section>
  );
}
