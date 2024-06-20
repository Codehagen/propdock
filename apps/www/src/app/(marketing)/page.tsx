import Link from "next/link";
import Balancer from "react-wrap-balancer";

import { buttonVariants } from "@dingify/ui/components/button";

import { siteConfig } from "@/config/site";
import { cn, nFormatter } from "@/lib/utils";
import Particles from "@/components/ui/particles";
import { SphereMask } from "@/components/ui/sphere-mask";
import { GetStartedButton } from "@/components/buttons/GetStartedButton";
import { BeamSection } from "@/components/dashboard/beam-section";
import { BusinessLine } from "@/components/dashboard/businessline";
import CallToActionComponent from "@/components/dashboard/calltoaction";
import Featuressection from "@/components/dashboard/feautressection";
import HeroSection from "@/components/dashboard/herosection";
import HeroSection2 from "@/components/dashboard/herosection2";
import BottomSectionLanding from "@/components/landing/bottom-section-landing";
import CallToActionSection from "@/components/landing/cta-section";
import EventsSectionLanding from "@/components/landing/events-section-landing";
import HeroSectionNew2 from "@/components/landing/hero-section";
import { IntegrationsSectionLanding } from "@/components/landing/Integrations-section-landing";
import { Icons } from "@/components/shared/icons";

export default async function IndexPage() {
  return (
    <>
      <HeroSectionNew2 />
      <SphereMask />
      <BeamSection />
      <IntegrationsSectionLanding />
      <EventsSectionLanding />
      <CallToActionSection />
      <SphereMask reverse />
      <BottomSectionLanding />

      <Particles
        className="absolute inset-0 -z-10"
        quantity={50}
        ease={70}
        size={0.05}
        staticity={40}
        color={"#ffffff"}
      />
    </>
  );
}
