import { Suspense } from "react";

import OpenCardSection from "@/components/open-page/OpenCardsSection";
import OpenMiddleSection from "@/components/open-page/OpenMiddleSection";
import { OpenSalaryTable } from "@/components/open-page/OpenSalaryTable";
import OpenStartupSection from "@/components/open-page/OpenStartupSection";
import { OpenTableTeam } from "@/components/open-page/OpenTableTeam";
import OpenUsersDiagram from "@/components/open-page/OpenUsersDiagram";
import OpenUsersFunding from "@/components/open-page/OpenUsersFunding";
import OpenUsersText from "@/components/open-page/OpenUsersText";
import { getCurrentUser } from "@/lib/session";
import { fetchGithubData } from "@/lib/utils";

export const metadata = {
  title: "Propdock Open - Alt åpent for alle",
  description:
    "Vi viser alt for vi har ingenting å skjule - Våre finanser, metrics og læring, alt i offentligheten."
};

export default async function PricingPage() {
  const user = await getCurrentUser();
  const Githubstats = await fetchGithubData();

  return (
    <div className="flex w-full flex-col gap-16 py-8 md:py-8">
      <OpenStartupSection />
      <OpenCardSection githubData={Githubstats} />
      <OpenTableTeam />
      <OpenSalaryTable />
      <OpenMiddleSection />
      <OpenUsersText />
      <OpenUsersDiagram />
      <OpenUsersFunding />
    </div>
  );
}
