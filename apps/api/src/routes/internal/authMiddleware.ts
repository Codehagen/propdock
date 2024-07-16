import { Context } from "hono";
import { CustomContext } from "../../types";
import { Env } from "../../env";
import { verifyFrontend } from "../../auth/handler";

const DEBUG: boolean = false; // NB! Change to false before committing.


export default async function internalAuthMiddleware(
    c: Context<{
      Bindings: Env;
      Variables: CustomContext;
    }>,
    next: any,
  ) {
    // Skip all checks for the test endpoint
    if (c.req.path === '/api/test') {
      if (DEBUG) { console.debug("Middleware debug - inserting test variable into request context") }
      c.set("test", true)
      return next();
    }

    const FEKey = c.req.header("x-fe-key");
    if (DEBUG) { console.debug("Middleware debug - API key header:", FEKey) }

    if (!FEKey) {
        return c.json({ ok: false, message: "API key is required" }, 400);
    }

    const apiKeyVerified = await verifyFrontend(FEKey);
    if (!apiKeyVerified) {
        return c.json({ ok: false, message: "Invalid API key" }, 401)
    }

    return next();
}