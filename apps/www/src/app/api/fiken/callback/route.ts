import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import axios from "axios"

import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")

  if (!token) {
    return new NextResponse("Token is missing", { status: 400 })
  }

  try {
    // Fetch the current user dynamically
    const user = await getCurrentUser()
    const userId = user?.id

    if (!userId) {
      return new NextResponse("User not authenticated", { status: 401 })
    }

    // Fetch the workspace associated with the user
    const userWorkspace = await prisma.workspace.findFirst({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
      },
    })

    if (!userWorkspace) {
      return new NextResponse("No workspace found for this user.", {
        status: 400,
      })
    }

    const workspaceId = userWorkspace.id
    const serviceName = "fiken"

    await axios.post(
      "https://api.vegard.workers.dev/api/internal/oauth/fiken/onboarding-finalize",
      {
        workspaceId,
        token,
        serviceName,
      },
      {
        headers: {
          "x-fe-key": "super-secret",
        },
      },
    )

    // Construct absolute URL for redirection
    const redirectUrl = new URL(request.url)
    redirectUrl.pathname = "/settings/import"
    return NextResponse.redirect(redirectUrl.toString())
  } catch (error) {
    console.error("Error handling callback", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
