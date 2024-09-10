import { Skeleton } from "@propdock/ui/components/skeleton"

import { getCurrentUser } from "@/lib/session"
import { getUserSubscriptionPlan } from "@/lib/subscription"
import { PricingCards } from "@/components/pricing-cards"
import { PricingFaq } from "@/components/pricing-faq"

export const metadata = {
  title: "Propdock Priser",
  description:
    "Utforsk konkurransedyktige prisplaner for Propdock. Finn den perfekte pakken for å forbedre din eiendomsforvaltning, leietakersporing og eiendomsanalyse.",
}

export default async function PricingPage() {
  const user = await getCurrentUser()
  let subscriptionPlan

  if (user) {
    subscriptionPlan = await getUserSubscriptionPlan(user.id)
  }

  return (
    <div className="flex w-full flex-col gap-16 py-8 md:py-8">
      <PricingCards userId={user?.id} subscriptionPlan={subscriptionPlan} />
      <hr className="container" />
      <PricingFaq />
    </div>
  )
}
