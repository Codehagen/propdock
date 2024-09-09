"use client";

import { Button, buttonVariants } from "@propdock/ui/components/button";

import { useLanguageModal } from "@/hooks/use-language-modal";
import { useSigninModal } from "@/hooks/use-signin-modal";
import { cn } from "@/lib/utils";

export function LanugageButton({ userId }) {
  const signInModal = useLanguageModal();

  return (
    <Button
      className={cn(buttonVariants({ size: "lg" }))}
      onClick={signInModal.onOpen}
    >
      Select language
    </Button>
  );
}
