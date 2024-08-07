"use client"

import type { ImageProps } from "next/image"
import Zoom from "react-medium-image-zoom"

import BlurImage from "@/lib/blog/blur-image"
import useMediaQuery from "@/hooks/use-media-query"

import "react-medium-image-zoom/dist/styles.css"

export default function ZoomImage(
  props: ImageProps & { blurDataURL?: string; hideCaption?: boolean },
) {
  const { width, height, isDesktop } = useMediaQuery()
  return (
    <figure className="not-prose flex flex-col items-center justify-center space-y-3">
      <Zoom
        zoomMargin={isDesktop ? 45 : undefined}
        zoomImg={{
          src: props.src as string,
          alt: props.alt,
          ...(width && height ? { width, height } : {}),
        }}
      >
        <BlurImage
          {...props}
          className="rounded-lg border border-gray-200"
          placeholder="blur"
          blurDataURL={
            props.blurDataURL ||
            "data:image/webp;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="
          }
        />
      </Zoom>
      {!props?.hideCaption && (
        <figcaption className="text-center text-sm italic text-gray-500">
          {props.alt}
        </figcaption>
      )}
    </figure>
  )
}
