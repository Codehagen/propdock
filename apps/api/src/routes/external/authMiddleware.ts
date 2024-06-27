import { Context } from "hono";
import { prisma } from "../../lib/db";
import { Env } from "../../env";
import { CustomContext } from "../../types";
import { verifyApiKey } from "../../auth/handler";
import { User } from "@prisma/client";

//const ENV_DEBUG: string | undefined = process.env?.DEBUG_MODE; // TODO: investigate if this can be made to work with wrangler
const DEBUG: boolean = true; // NB! Change to false before committing.


export default async function authMiddleware(
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

  // Skip API key check for user registration endpoint
  if (c.req.path === "/api/users" && c.req.method === "POST") {
    return next();
  }

  // Extract API key from headers & verify that it exists
  const apiKey = c.req.header("x-api-key");
  if (DEBUG) { console.debug("Middleware debug - API key header:", apiKey) }

  if (!apiKey) {
    return c.json({ ok: false, message: "API key is required" }, 400);
  }

  // Verify API key
  const apiKeyVerified = await verifyApiKey(apiKey);
  if (DEBUG) { console.debug("Middleware debug - API key was verified:", apiKeyVerified) }

  if (!apiKeyVerified) {
    return c.json({ ok: false, message: "Invalid API key" }, 401)
  }

  // User look-up
  const res = await prisma(c.env).user.findUnique({
    where: { apiKey },
  });

  if (DEBUG) { console.debug("Middleware debug - db response:", JSON.stringify(res)) }

  if (!res) {
    return
  }

  const user: User = res
  if (DEBUG) { console.debug("Middleware debug - user:", user.id, user.email, user.workspaceId) }

  if (!user) {
    return c.json({ ok: false, message: "User did not exist" }, 401);
  }

  // Insert the user object into request context
  c.set("user", user) 

  // Proceed to the route handler
  return next();
}



async function superAsyncAuthMiddleware(
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

  // Skip API key check for user registration endpoint
  if (c.req.path === "/api/users" && c.req.method === "POST") {
    return next();
  }

  // Extract API key from headers & verify that it exists
  const apiKey = c.req.header("x-api-key");
  if (DEBUG) { console.debug("Middleware debug - API key header:", apiKey) }

  if (!apiKey) {
    return c.json({ ok: false, message: "API key is required" }, 400);
  }

  // Start async operations to verify the key and look up the user
  const apiKeyVerifiedPromise: Promise<boolean> = verifyApiKey(apiKey);
  const userPromise = prisma(c.env).user.findUnique({
    where: { apiKey },
  });

  // Finish key verification
  const apiKeyVerified = await apiKeyVerifiedPromise;
  if (DEBUG) { console.debug("Middleware debug - API key was verified:", apiKeyVerified) }

  if (!apiKeyVerified) {
    return c.json({ ok: false, message: "Invalid API key" }, 401)
  }

  // Finish user look-up
  const user = await userPromise;
  if (DEBUG) { console.debug("Middleware debug - User:", user) }

  if (!user) {
    return c.json({ ok: false, message: "User did not exist" }, 401);
  }

  // Insert the user object into request context
  c.set("user", user) 

  // Proceed to the route handler
  return next();
}