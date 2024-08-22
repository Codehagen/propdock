"use client"

import { Button, buttonVariants } from "@propdock/ui/components/button"

import { cn } from "@/lib/utils"
import { useLanguageModal } from "@/hooks/use-language-modal"
import { useSigninModal } from "@/hooks/use-signin-modal"

export function LanugageButton({ userId }) {
  const signInModal = useLanguageModal()

  return (
    <Button
      className={cn(buttonVariants({ size: "lg" }))}
      onClick={signInModal.onOpen}
    >
      Select language
    </Button>
  )
}
