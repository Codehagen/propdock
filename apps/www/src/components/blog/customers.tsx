"use client"

import Link from "next/link"
import Tilt from "react-parallax-tilt"

import BlurImage from "@/lib/blog/blur-image"
import useMediaQuery from "@/hooks/use-media-query"

import ExpandingArrow from "./icons/expanding-arrow"

export const Customer = ({ slug, site }: { slug: string; site?: string }) => {
  const { isDesktop } = useMediaQuery()
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
        href={site || `/customers/${slug}`}
        {...(site ? { target: "_blank", rel: "noreferrer noopener" } : {})}
        className="group flex flex-col items-center justify-center space-y-2 rounded-2xl border border-gray-300 bg-white/10 p-8 backdrop-blur-sm sm:p-10"
      >
        <BlurImage
          src={`/_static/clients/${slug}.svg`}
          alt={slug.toUpperCase()}
          width={520}
          height={182}
          className="max-h-16 grayscale transition-all group-hover:grayscale-0"
        />
        <div className="flex space-x-1">
          <p className="text-sm font-medium text-gray-500 group-hover:text-green-500">
            {site ? "Besøk nettsted" : "Les mer"}
          </p>
          <ExpandingArrow className="text-gray-500 group-hover:text-green-500" />
        </div>
      </Link>
    </Tilt>
  )
}
