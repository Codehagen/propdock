import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@propdock/ui/components/command";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface FeatureCardProps {
  Icon: ReactNode;
  name: string;
  description: string;
  href: string;
  cta: string;
  background: ReactNode;
}

export function FeatureCard({
  Icon,
  name,
  description,
  href,
  cta,
  background,
}: FeatureCardProps) {
  return (
    <div className="relative flex flex-col rounded-lg border bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center">
        <div className="mr-4">{Icon}</div>
        <div>
          <h2 className="font-semibold text-xl">{name}</h2>
          <p className="text-gray-600 text-sm dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
      <div className="flex-grow">{background}</div>
      <a href={href} className="mt-4 text-blue-500 hover:underline">
        {cta}
      </a>
    </div>
  );
}
