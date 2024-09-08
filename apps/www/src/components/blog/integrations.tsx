"use client";

import Link from "next/link";
import Tilt from "react-parallax-tilt";

import useMediaQuery from "@/hooks/use-media-query";
import BlurImage from "@/lib/blog/blur-image";

import ExpandingArrow from "./icons/expanding-arrow";

export const Integration = ({
  slug,
  site,
  description
}: {
  slug: string;
  site?: string;
  description?: string;
}) => {
  const { isDesktop } = useMediaQuery();
  return (
    <Tilt
      glareEnable={true}
      glareMaxOpacity={0.3}
      glareColor="#ffffff"
      glarePosition="all"
      glareBorderRadius="16px"
      tiltEnable={isDesktop}
      tiltMaxAngleX={16}
      tiltMaxAngleY={16}
    >
      <Link
        href={site || `/integrations/${slug}`}
        {...(site ? { target: "_blank", rel: "noreferrer noopener" } : {})}
        className={`group flex flex-col items-center justify-between rounded-2xl border border-gray-300 bg-white/10 backdrop-blur-sm ${
          description ? "h-full space-y-4 p-8 sm:p-10" : "h-1/2 p-4 sm:p-6"
        }`}
      >
        <BlurImage
          src={`/_static/integrations/${slug}.svg`}
          alt={slug.toUpperCase()}
          width={520}
          height={182}
          className={`grayscale transition-all group-hover:grayscale-0 ${
            description ? "max-h-16" : "max-h-12"
          }`}
        />
        {description && (
          <>
            <hr className="w-full border-gray-200 border-t" />
            <p className="text-center text-gray-600 text-sm">{description}</p>
          </>
        )}
        <div className="flex space-x-1">
          <p className="font-medium text-gray-500 text-sm group-hover:text-green-500">
            {site ? "Gå til nettside" : "Les om integrasjon"}
          </p>
          <ExpandingArrow className="text-gray-500 group-hover:text-green-500" />
        </div>
      </Link>
    </Tilt>
  );
};
