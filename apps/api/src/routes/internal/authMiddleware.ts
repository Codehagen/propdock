import { User } from "@prisma/client"
import { Context } from "hono"

import { verifyFrontend } from "../../auth/handler"
import { Env } from "../../env"
import { prisma } from "../../lib/db"
import { CustomContext } from "../../types"

const DEBUG: boolean = false // NB! Change to false before committing.

export default async function internalAuthMiddleware(
  c: Context<{
    Bindings: Env
    Variables: CustomContext
  }>,
  next: any,
) {
  // Skip all checks for the test endpoint and webhook
  if (
    c.req.path === "/api/test" ||
    c.req.path === "/api/internal/esign/webhook"
  ) {
    if (DEBUG) {
      console.debug("Middleware debug - skipping auth for test or webhook")
    }
    return next()
  }

  const FEKey = c.req.header("x-fe-key")
  if (DEBUG) {
    console.debug("Middleware debug - API key header:", FEKey)
  }

  if (!FEKey) {
    return c.json({ ok: false, message: "API key is required" }, 400)
  }

  const apiKeyVerified = await verifyFrontend(FEKey)
  if (!apiKeyVerified) {
    return c.json({ ok: false, message: "Invalid API key" }, 401)
  }

  const userId = c.req.header("x-user-id")
  if (userId) {
    const user = await prisma(c.env).user.findUnique({
      where: {
        id: userId,
      },
    })

    if (user) {
      c.set("user", user)
    }
  }

  return next()
}
