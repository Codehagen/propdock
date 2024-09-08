import { NextRequest } from "next/server"
import { ImageResponse } from "@vercel/og"

import { truncate } from "@/lib/blog/constructMetadata"

export const config = {
  runtime: "edge",
}

const satoshiBold = fetch(
  new URL("../../../styles/Satoshi-Bold.ttf", import.meta.url),
).then((res) => res.arrayBuffer())

const interMedium = fetch(
  new URL("../../../styles/Inter-Medium.ttf", import.meta.url),
).then((res) => res.arrayBuffer())

export default async function (req: NextRequest) {
  const [satoshiBoldData, interMediumData] = await Promise.all([
    satoshiBold,
    interMedium,
  ])

  const { searchParams } = new URL(req.url)

  const title = searchParams.get("title") || "Hjelpesenter"
  const summary =
    searchParams.get("summary") || "Lær hvordan du bruker Propdock"

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: 80,
          backgroundColor: "#030303",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          backgroundPosition: "-30px -10px",
          fontWeight: 600,
          color: "white",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 70,
            left: 80,
            display: "flex",
            alignItems: "center",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-building"
            style={{ marginRight: 8 }}
          >
            <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
            <path d="M9 22v-4h6v4" />
            <path d="M8 6h.01" />
            <path d="M16 6h.01" />
            <path d="M12 6h.01" />
            <path d="M12 10h.01" />
            <path d="M12 14h.01" />
            <path d="M16 10h.01" />
            <path d="M16 14h.01" />
            <path d="M8 10h.01" />
            <path d="M8 14h.01" />
          </svg>
          <h2
            style={{
              margin: 0,
              fontSize: 30,
              fontFamily: "Inter Medium",
              letterSpacing: -1,
            }}
          >
            Propdock
          </h2>
        </div>
        <h1
          style={{
            fontSize: 82,
            fontFamily: "Satoshi Bold",
            margin: "0 0 40px -2px",
            lineHeight: 1.1,
            textShadow: "0 2px 30px #000",
            letterSpacing: -4,
            backgroundImage: "linear-gradient(90deg, #fff 40%, #aaa)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          {truncate(title, 100)}
        </h1>
        <p
          style={{
            position: "absolute",
            bottom: 70,
            left: 80,
            margin: 0,
            fontSize: 30,
            fontFamily: "Inter Medium",
            letterSpacing: -1,
          }}
        >
          {truncate(summary, 140)}
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Satoshi Bold",
          data: satoshiBoldData,
        },
        {
          name: "Inter Medium",
          data: interMediumData,
        },
      ],
    },
  )
}
