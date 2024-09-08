import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"

import Footer from "./components/footer"

export default function WelcomeEmail({
  name = "John Doe",
  email = "welcome@propwrite.com",
}: {
  name: string | null
  email: string
}) {
  return (
    <Html>
      <Head />
      <Preview>Velkommen til Propdock </Preview>
      <Tailwind>
        <Body className="m-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[500px] rounded border border-solid border-gray-200 px-10 py-5">
            <Section className="mt-8"></Section>
            <Heading className="mx-0 my-7 p-0 text-center text-xl font-semibold text-black">
              Velkommen til Propdock
            </Heading>

            <Text className="text-sm leading-6 text-black">
              Takk for at du ønsker være med på laget {name && `, ${name}`}!
            </Text>
            <Text className="text-sm leading-6 text-black">
              Jeg er Christer, personen som laget Propdock. Vi ønsker å gjøre
              det enkelt for eiendomsbesittere å håndere sine verdier og
              leietakere. I'm Christer, the creator of P, your new AI assistant
              for Vi er glad for å ha deg med!
            </Text>
            <Text className="text-sm leading-6 text-black">
              Her er noen ting du kan starte med:
            </Text>
            <Text className="ml-1 text-sm leading-4 text-black">
              ◆ Legg til{" "}
              <Link
                href="https://propdock.no/dashboard"
                className="font-medium text-blue-600 no-underline"
              >
                din første eiendom
              </Link>
            </Text>
            <Text className="ml-1 text-sm leading-4 text-black">
              ◆ Importer inn{" "}
              <Link
                href="https://propdock.no/dashboard"
                className="font-medium text-blue-600 no-underline"
              >
                eksiterende bygg
              </Link>
            </Text>
            <Text className="ml-1 text-sm leading-4 text-black">
              ◆ Bla gjennom vårt{" "}
              <Link
                href="https://propdock.no/dashboard"
                className="font-medium text-blue-600 no-underline"
              >
                hjelpesenter
              </Link>
            </Text>
            <Text className="text-sm leading-6 text-black">
              Har du spørsmål eller feedback, er det bare å ta kontakt. Vi er
              her for å hjelpe deg!
            </Text>
            <Text className="text-sm font-light leading-6 text-gray-400">
              Christer fra Propdock
            </Text>

            <Footer email={email} marketing />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
