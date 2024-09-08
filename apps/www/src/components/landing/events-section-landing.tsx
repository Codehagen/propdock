"use client";

import { Button } from "@propdock/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@propdock/ui/components/command";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useInView } from "framer-motion";
import { FileInputIcon } from "lucide-react";
import { useRef } from "react";

import { BentoCard } from "../ui/bento-grid";

export default function EventsSectionLanding() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative mx-auto mt-32 max-w-[80rem] px-6 text-center md:px-8">
      <h2 className="translate-y-[-1rem] animate-fade-in text-balance bg-gradient-to-br from-30% from-black to-black/40 bg-clip-text py-6 font-medium text-5xl text-transparent leading-none tracking-tighter opacity-0 [--animation-delay:200ms] sm:text-6xl md:text-7xl lg:text-8xl dark:from-white dark:to-white/40">
        Informasjonen du trenger
        <br className="hidden md:block" /> når du trenger den
      </h2>
      <div
        ref={ref}
        className="relative mx-auto mt-20 w-full max-w-[80%] animate-fade-up opacity-0 [--animation-delay:800ms]"
      >
        <BentoCard
          name="Søk raskt og finn informasjonen enkelt"
          className="h-[500px] w-full" // Adjust the height here
          Icon={FileInputIcon}
          description=""
          href="/"
          cta="Learn more"
          background={
            <Command className="group-hover:-translate-x-10 absolute top-10 right-10 w-[70%] origin-top translate-x-0 border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)]">
              <CommandInput placeholder="Type a command or search..." />
              <CommandList>
                <CommandEmpty>Ingen resultat.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                  <CommandItem>Dronningens gate 18</CommandItem>
                  <CommandItem>Kontrakt If Skadeforsriking</CommandItem>
                  <CommandItem>Analyse Akersgata 16</CommandItem>
                  <CommandItem>Send faktura til Biltema</CommandItem>
                  <CommandItem>Se alle leietakere</CommandItem>
                  <CommandItem>Send tilbud til Gjensidige</CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          }
        />
      </div>
      <p className="mt-12 mb-12 translate-y-[-1rem] animate-fade-in text-balance text-gray-400 text-lg tracking-tight opacity-0 [--animation-delay:400ms] md:text-xl">
        Unlock the power of Propdock
        <br className="hidden md:block" /> All informasjonen du trenger på en
        plass
      </p>
    </section>
  );
}
