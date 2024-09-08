import { nFormatter } from "@/lib/utils";

import MaxWidthWrapper from "./max-width-wrapper";
import TestimonialsMobile from "./testimonials-mobile";

// Placeholder testimonial data
const testimonials = [
  { id: 1, content: "Eksempel på tilbakemelding 1" },
  { id: 2, content: "Eksempel på tilbakemelding 2" },
  { id: 3, content: "Eksempel på tilbakemelding 3" },
  // ... legg til flere eksempler på tilbakemeldinger etter behov
];

export default async function Testimonials() {
  const userCount = 100;

  return (
    <MaxWidthWrapper className="pt-20">
      <div className="mx-auto max-w-md text-center sm:max-w-xl">
        <h2 className="font-display font-extrabold text-4xl text-black leading-tight sm:text-5xl sm:leading-tight">
          Elsket av{" "}
          <span className="bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
            {nFormatter(userCount)} brukere
          </span>
        </h2>
        <p className="mt-5 text-gray-600 sm:text-lg">
          Ikke ta vårt ord for det – her er hva våre brukere sier om Propdock.
        </p>
      </div>
      <TestimonialsMobile testimonials={testimonials} />
      <div className="hidden space-y-6 py-8 sm:block sm:columns-2 sm:gap-6 xl:columns-3">
        {testimonials.map((testimonial, idx) => (
          <div
            key={testimonial.id}
            className={`rounded-lg border p-4 ${
              idx <= 5 || idx >= 13 ? "relative lg:top-12" : ""
            }`}
          >
            <p>{testimonial.content}</p>
          </div>
        ))}
      </div>
    </MaxWidthWrapper>
  );
}
