import { Suspense } from "react"
import Link from "next/link"
import { buttonVariants } from "@propdock/ui/components/button"

import { cn } from "@/lib/utils"
import { UserAuthForm } from "@/components/forms/user-auth-form"
import { Icons } from "@/components/shared/icons"

export const metadata = {
  title: "Opprett en konto",
  description: "Opprett en konto for å komme i gang.",
}

export default function RegisterPage() {
  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8",
        )}
      >
        Logg inn
      </Link>
      <div className="hidden h-full bg-muted lg:block" />
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Icons.logo className="mx-auto h-6 w-6" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Opprett en konto
            </h1>
            <p className="text-sm text-muted-foreground">
              Skriv inn e-postadressen din nedenfor for å opprette kontoen din
            </p>
          </div>
          <Suspense>
            <UserAuthForm type="register" />
          </Suspense>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Ved å klikke fortsett, godtar du våre{" "}
            <Link
              href="/terms"
              className="hover:text-brand underline underline-offset-4"
            >
              Vilkår for bruk
            </Link>{" "}
            og{" "}
            <Link
              href="/personvern"
              className="hover:text-brand underline underline-offset-4"
            >
              Personvernerklæring
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
