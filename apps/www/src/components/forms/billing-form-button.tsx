"use client";

import { generateUserStripe } from "@/actions/create-user-stripe";
import type { SubscriptionPlan, UserSubscriptionPlan } from "@/types";
import { Button } from "@propdock/ui/components/button";
import { useTransition } from "react";

import { Icons } from "@/components/shared/icons";

interface BillingFormButtonProps {
  offer: SubscriptionPlan;
  subscriptionPlan: UserSubscriptionPlan;
  year: boolean;
}

export function BillingFormButton({
  year,
  offer,
  subscriptionPlan,
}: BillingFormButtonProps) {
  const [isPending, startTransition] = useTransition();
  const generateUserStripeSession = generateUserStripe.bind(
    null,
    // @ts-expect-error
    offer.stripeIds[year ? "yearly" : "monthly"],
  );

  const stripeSessionAction = () =>
    // @ts-expect-error
    startTransition(async () => await generateUserStripeSession());

  return (
    <Button
      variant="default"
      className="w-full"
      disabled={isPending}
      onClick={stripeSessionAction}
    >
      {isPending ? (
        <>
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Loading...
        </>
      ) : (
        <>
          {subscriptionPlan.stripePriceId ===
          offer.stripeIds[year ? "yearly" : "monthly"]
            ? "Manage Subscription"
            : "Upgrade"}
        </>
      )}
    </Button>
  );
}
