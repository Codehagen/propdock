import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import axios from "axios"

export async function GET(request: NextRequest) {
  try {
    const response = await axios.get(
      "https://api.vegard.workers.dev/api/internal/oauth/fiken/onboarding-start",
      {
        headers: {
          "x-fe-key": "super-secret",
        },
      },
    )

    const { ok, message } = response.data
    console.debug("YYY:FIKEN onboarding-start API response:", ok, message)

    if (!ok) {
      return NextResponse.json(
        { error: "Failed to get onboarding URL" },
        { status: 500 },
      )
    }

    const authUrl = `${message}`
    return NextResponse.json({ url: authUrl }, { status: 200 })
  } catch (error) {
    console.error("Error initiating OAuth", {
      message: error.message,
      stack: error.stack,
      response: error.response ? error.response.data : "No response data",
    })
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}
