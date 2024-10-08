import { saveAPIKey } from "@/models/workspace"

import { prisma } from "@/lib/db"
import { honoFactory } from "@/lib/hono"
import {
  exchangeCodeForKey,
  getAccessToken,
  getAuthHeaders,
  getOnboardingBody,
  getOnboardingHeaders,
  PO_ONBOARDING_START,
} from "@/lib/poweroffice/auth"

const app = honoFactory()

app.get("/onboarding-start", async (c) => {
  const headers = getOnboardingHeaders(c.env)
  const body = getOnboardingBody(c.env)

  const url = PO_ONBOARDING_START

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    })

    if (response.ok) {
      const responseData: any = await response.json()
      const temporaryUrl = responseData["TemporaryUrl"]
      return c.json({ ok: true, message: temporaryUrl }, 200)
    } else {
      console.error(`Error: ${response.statusText}`)
      return c.json(
        {
          ok: false,
          message: `Failed to start onboarding`,
          error: response.statusText,
        },
        { status: response.status },
      )
    }
  } catch (error: any) {
    console.error(`Network error: ${error.message}`)
    return c.json({ error: `Network error: ${error.message}` }, 500)
  }
})

// TODO: remove
app.get("/callback-test", async (c) => {
  const { success, token } = c.req.query()
  return c.json({ ok: true, success: success, token: token }, 200)
})

app.post("/onboarding-finalize", async (c) => {
  const body = await c.req.json()
  const db = prisma(c.env)

  // Get request.body params
  let workspaceId, token, serviceName
  try {
    ({ workspaceId, token, serviceName } = body)
  } catch (error) {
    console.error("Invalid or incomplete `body`")
    return c.json(
      {
        ok: false,
        message:
          "Request body not in valid format or missing required attributes",
      },
      400,
    )
  }

  // Exchange the onboarding code for client's key
  let clientKey
  try {
    clientKey = await exchangeCodeForKey(c.env, token)

    // Save key to db
    await saveAPIKey(db, workspaceId, clientKey, serviceName)
  } catch (error) {
    console.error(`Error: ${error}`)
    return c.json({ ok: false, error: error }, 500)
  }

  return c.json({ ok: true }, 200)
})

app.get("/token-test", async (c) => {
  const user = c.get("user")

  if (!user) {
    return c.json(
      { ok: false, message: "x-user-id header was not supplied" },
      400,
    )
  }

  let token
  try {
    token = await getAccessToken(c.env, user.workspaceId!)
  } catch (error: any) {
    console.error(error)
    return c.json({ ok: false, error: error }, 500)
  }

  return c.json({ ok: true, user: user, message: token }, 200)
})


app.get("/dev", async (c) => {
  const user = c.get("user")

  if (!user) {
    return c.json(
      { ok: false, message: "x-user-id header was not supplied" },
      400,
    )
  }

  const headers = getAuthHeaders(c.env, user.workspaceId!)

  return c.json({ ok: true, user: user, message: headers }, 200)
})


export const POInternalApp = app