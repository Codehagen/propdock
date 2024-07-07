"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"

import { GetStartedButton } from "../buttons/GetStartedButton"

export default function BottomSectionLanding() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="relative mx-auto -mt-20 mb-20 max-w-[80rem] px-6 text-center md:px-8">
      <h2 className="translate-y-[-1rem] animate-fade-in text-balance bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text py-6 text-5xl font-medium leading-none tracking-tighter text-transparent opacity-0 [--animation-delay:200ms] dark:from-white dark:to-white/40 sm:text-6xl md:text-7xl lg:text-8xl">
        Prøv Propdock
        <br className="hidden md:block" /> Available today.
      </h2>
      <div className="mt-10 space-x-4">
        <GetStartedButton />
      </div>
    </section>
  )
}
