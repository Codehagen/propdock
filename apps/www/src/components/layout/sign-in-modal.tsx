"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

import { Button } from "@dingify/ui/components/button";

import { siteConfig } from "@/config/site";
import { useSigninModal } from "@/hooks/use-signin-modal";
import { Icons } from "@/components/shared/icons";
import { Modal } from "@/components/shared/modal";

export const SignInModal = () => {
  const signInModal = useSigninModal();
  const [signInClicked, setSignInClicked] = useState(false);

  return (
    <Modal showModal={signInModal.isOpen} setShowModal={signInModal.onClose}>
      <div className="w-full">
        <div className="flex flex-col items-center justify-center space-y-3 border-b bg-background px-4 py-6 pt-8 text-center md:px-16">
          <a href={siteConfig.url}>
            <Icons.logo className="h-10 w-10" />
          </a>
          <h3 className="font-urban text-2xl font-bold">Sign In</h3>
          <p className="text-sm text-gray-500">
            Join our community and unlock the full potential of Dingify. Sign in
            effortlessly with Google to start managing your alerts.
          </p>
        </div>

        <div className="flex flex-col space-y-4 bg-secondary/50 px-4 py-8 md:px-16">
          <Button
            variant="default"
            disabled={signInClicked}
            onClick={() => {
              setSignInClicked(true);
              signIn("google", { callbackUrl: "/dashboard" }).then(() =>
                // TODO: fix this without setTimeOut(), modal closes too quickly. Idea: update value before redirect
                setTimeout(() => {
                  signInModal.onClose();
                }, 1000),
              );
            }}
          >
            {signInClicked ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.google className="mr-2 h-4 w-4" />
            )}{" "}
            Sign In with Google
          </Button>
        </div>
      </div>
    </Modal>
  );
};
