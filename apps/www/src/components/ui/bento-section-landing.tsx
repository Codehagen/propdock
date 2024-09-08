import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@propdock/ui/components/command";
import { CalendarIcon, FileTextIcon, InputIcon } from "@radix-ui/react-icons";
import { BellIcon, MapIcon, Share2Icon } from "lucide-react";

import { cn } from "@/lib/utils";

import { AnimatedBeamMultipleOutputDemo } from "./animated-beam-multiple-outputs";
import { AnimatedListLanding } from "./animated-list-landing";
import { BentoCard, BentoGrid } from "./bento-grid";
import Marquee from "./marquee";

const files = [
  {
    name: "Karl Johans gate 5",
    body: "Karl Johans gate 5 er en eiendom som ligger i hjertet av Oslo. Denne eiendommen er kjent for sin historiske betydning.",
  },
  {
    name: "Akersgata 16",
    body: "Akersgata 16 er en moderne eiendom i Oslo. Den er kjent for sin arkitektoniske stil og sentrale beliggenhet.",
  },
  {
    name: "Storgata 10",
    body: "Storgata 10 er en eiendom som ligger i et livlig område av Oslo. Denne eiendommen er populær blant både lokale og turister.",
  },
  {
    name: "Prinsens gate 8",
    body: "Prinsens gate 8 er en historisk eiendom i Oslo. Denne eiendommen er kjent for sin gamle verden sjarm og eleganse.",
  },
  {
    name: "Rådhusgata 2",
    body: "Rådhusgata 2 er en eiendom som ligger i nærheten av Oslo rådhus. Denne eiendommen er kjent for sin nærhet til byens viktigste landemerker.",
  },
];

interface Item {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
}

const features = [
  {
    Icon: MapIcon,
    name: "Se alle dine eiendommer",
    description: "Få bedre oversikt over dine eiendommer",
    href: "/features/verdsettelse",
    cta: "Les mer",
    className: "col-span-3 lg:col-span-1",
    background: (
      <Marquee
        pauseOnHover
        className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] "
      >
        {files.map((f, idx) => (
          <figure
            key={idx}
            className={cn(
              "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
              "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
              "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
              "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none",
            )}
          >
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-col">
                <figcaption className="font-medium text-sm dark:text-white ">
                  {f.name}
                </figcaption>
              </div>
            </div>
            <blockquote className="mt-2 text-xs">{f.body}</blockquote>
          </figure>
        ))}
      </Marquee>
    ),
  },
  {
    Icon: InputIcon,
    name: "Få informasjonen du trenger",
    description: "Se over leiekontrakter, fakturaer og finansielle analyser",
    href: "/blog/introduserer-propdock",
    cta: "Les mer",
    className: "col-span-3 lg:col-span-2",
    background: (
      <Command className="group-hover:-translate-x-10 absolute top-10 right-10 w-[70%] origin-top translate-x-0 border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)]">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>Ingen resultat.</CommandEmpty>
          <CommandGroup heading="Forslag">
            <CommandItem>Dronningens gate 18</CommandItem>
            <CommandItem>Kontrakt If Skadeforsriking</CommandItem>
            <CommandItem>Analyse Akersgata 16</CommandItem>
            <CommandItem>Send faktura til Biltema</CommandItem>
            <CommandItem>Se alle leietakere</CommandItem>
            <CommandItem>Send tilbud til Gjensidige</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    ),
  },
  {
    Icon: Share2Icon,
    name: "Integrasjoner",
    description: "Kan integrere med over 100+ integrasjoner and counting.",
    href: "/integrations",
    cta: "Les mer",
    className: "col-span-3 lg:col-span-2",
    background: (
      <AnimatedBeamMultipleOutputDemo className="absolute top-4 right-2 h-[300px] w-[600px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
    ),
  },
  {
    Icon: BellIcon,
    name: "Varslinger",
    description: "Få varslinger på viktige hendelser",
    className: "col-span-3 lg:col-span-1",
    href: "/help",
    cta: "Se mer",
    background: (
      <AnimatedListLanding className="absolute top-4 right-2 h-[300px] w-[600px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105 md:h-[150px] md:w-[300px]" />
    ),
  },
];

export function BentoSectionLanding() {
  return (
    <BentoGrid>
      {features.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
  );
}
