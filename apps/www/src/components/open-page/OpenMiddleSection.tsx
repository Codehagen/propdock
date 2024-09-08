import { Separator } from "@propdock/ui/components/separator";

export default function OpenMiddleSection() {
  return (
    <section className="container flex flex-col items-center text-center">
      <div className="mx-auto mb-10 flex w-full flex-col gap-5">
        {/* <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Open startup
        </p> */}
        <h2 className="font-heading text-3xl leading-[1.1] md:text-5xl">
          Funding
        </h2>
        <p className="font-medium text-large text-muted-foreground">
          Vi har ikke noe funding, bør vi?
        </p>
      </div>
      <Separator />
    </section>
  );
}
