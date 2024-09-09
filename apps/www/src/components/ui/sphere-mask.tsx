import { cn } from "@/lib/utils";

export const SphereMask = ({ reverse = false }: { reverse?: boolean }) => {
  return (
    <div
      className={cn(
        // color
        "[--color:var(--color-one)]",
        "-z-[2] pointer-events-none relative mx-auto h-[50rem] overflow-hidden",

        // sphere mask
        "[mask-image:radial-gradient(ellipse_at_center_center,#000,transparent_50%)]",

        // reverse
        reverse ? "mt-[-18.8rem] rotate-180" : "my-[-18.8rem] md:mt-[-30rem]",

        // before
        "before:absolute before:inset-0 before:h-full before:w-full before:opacity-40 before:[background-image:radial-gradient(circle_at_bottom_center,var(--color),transparent_70%)]",

        // after
        "after:-left-1/2 after:absolute after:top-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[50%] after:border-[hsl(var(--border))] after:border-t after:bg-background",
      )}
    />
  );
};
