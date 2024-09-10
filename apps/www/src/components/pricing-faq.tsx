import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@propdock/ui/components/accordion"
import Balancer from "react-wrap-balancer"

const pricingFaqData = [
  {
    id: "item-1",
    question:
      "Hvordan hjelper Propdock med sanntidsovervåking og analyse av eiendomsporteføljen?",
    answer:
      "Propdock tilbyr omfattende sanntidsovervåking og analyse ved å fange opp kritiske forretningshendelser, spore leietakernes reiser, og tilby detaljerte KPIer og innsikt. Ta datadrevne beslutninger for å optimalisere ytelsen til din eiendomsportefølje.",
  },
  {
    id: "item-2",
    question:
      "Kan jeg integrere Propdock med mine eksisterende forretningsverktøy?",
    answer:
      "Absolutt! Propdock er bygget med integrasjon i tankene. Vår omfattende API tillater deg å koble sømløst til dine eksisterende forretningsverktøy, som Poweroffice, Fiken, og Tripletex, og sikrer en smidig tilføyelse til din nåværende arbeidsflyt.",
  },
  {
    id: "item-3",
    question: "Hvilken type support kan jeg forvente med Propdock?",
    answer:
      "Vi tilbyr dedikert support for alle våre brukere. Uansett om du er på en gratis eller betalt plan, er vårt team klart til å hjelpe deg med eventuelle spørsmål eller problemer du måtte støte på. Premium supportalternativer er tilgjengelige for våre Pro-planabonnenter.",
  },
  {
    id: "item-4",
    question: "Er dataene mine sikre med Propdock?",
    answer:
      "Datasikkerhet er vår høyeste prioritet. Vi bruker SSL-kryptering og følger bransjens beste praksis for å sikre at alle dine data, fra hendelsesporing til kundeinformasjon, er sikkert lagret og beskyttet.",
  },
  {
    id: "item-5",
    question: "Hvordan skiller gratisplanen seg fra de betalte planene?",
    answer:
      "Gratisplanen tilbyr grunnleggende funksjoner som lar deg oppleve fordelene med Propdocks sanntidsovervåking av eiendomsporteføljen. Våre betalte planer gir tilgang til mer avanserte funksjoner, inkludert detaljert analyse, prioritert support, og økt hendelsesvolum.",
  },
  {
    id: "item-6",
    question: "Hvilke tilleggsfunksjoner inkluderer Pro-planen?",
    answer:
      "Pro-planen inkluderer alt i Basic-planen pluss avansert analyse, prioritert support, høyere hendelsesvolum, tilpassede API-integrasjoner, og tilgang til nye funksjoner før de blir offentlig tilgjengelige.",
  },
]

export function PricingFaq() {
  return (
    <section className="container max-w-4xl py-2">
      <div className="mb-14 space-y-6 text-center">
        <h1 className="text-center font-heading text-3xl md:text-5xl">
          <Balancer>Frequently Asked Questions</Balancer>
        </h1>
        <p className="text-md text-muted-foreground">
          <Balancer>
            Explore our comprehensive FAQ to find quick answers to common
            inquiries. If you need further assistance, don&apos;t hesitate to
            contact us for personalized help.
          </Balancer>
        </p>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {pricingFaqData.map((faqItem) => (
          <AccordionItem key={faqItem.id} value={faqItem.id}>
            <AccordionTrigger>{faqItem.question}</AccordionTrigger>
            <AccordionContent>{faqItem.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
