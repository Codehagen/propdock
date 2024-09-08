"use client";

import React, { forwardRef, useRef } from "react";

import { BentoSectionLanding } from "../ui/bento-section-landing";

export function BeamSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="pricing">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-8 px-4 py-14 md:px-8">
        <div className="mx-auto max-w-5xl text-center">
          {/* <h4 className="text-xl font-bold tracking-tight text-black dark:text-white">
            Pricing
          </h4> */}

          <h2 className="font-bold text-5xl text-black tracking-tight sm:text-6xl dark:text-white">
            Oversikten du trenger
          </h2>

          <p className="mt-6 text-black/80 text-xl leading-8 dark:text-white">
            Ta styringen på dine <strong>finansielle</strong> beslutninger.
            Propdock gjør det enkelt å holde oversikt over dine eiendommer og ta
            de rette besluttningene.
          </p>
        </div>
      </div>

      <div className="container mt-4 mb-14 flex items-center justify-center px-4 md:px-6">
        <div
          className="relative flex w-full max-w-[1000px] items-center justify-center overflow-hidden rounded-lg bg-background md:shadow-xl"
          ref={containerRef}
        >
          <BentoSectionLanding />
        </div>
      </div>
    </section>
  );
}
