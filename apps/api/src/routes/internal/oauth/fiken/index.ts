import { upsertAPIKey, upsertAccessToken } from "@/models/workspace";

import { prisma } from "@/lib/db";
import { honoFactory } from "@/lib/hono";

import {
  exchangeCodeForKey,
  getAccessToken,
  getOnboardingStartUrl
} from "@/lib/fiken/auth";

const app = honoFactory();

app.get("/onboarding-start", async c => {
  const url = getOnboardingStartUrl(c.env);
  return c.json({ ok: true, message: url }, 200);
});

app.post("/onboarding-finalize", async c => {
  const body = await c.req.json();
  const db = prisma(c.env);
  const serviceName = "fiken";

  // Get request.body params
  let workspaceId;
  let token;
  let state;
  try {
    ({ workspaceId, token, state } = body);
  } catch (error: any) {
    console.error("Invalid or incomplete `body`");
    return c.json(
      {
        ok: false,
        message:
          "Request body not in valid format or missing required attributes"
      },
      400
    );
  }

  // Exchange the onboarding code for client's key
  let clientKey;
  let accessToken;
  try {
    const clientKeyResponse = await exchangeCodeForKey(c.env, token, state);
    clientKey = clientKeyResponse.refresh_token.toString();
    accessToken = clientKeyResponse.access_token.toString();

    // Save refresh token as secret key in db
    await upsertAPIKey(db, workspaceId, clientKey, "fiken");

    // Save access token to db
    await upsertAccessToken(
      db,
      workspaceId,
      accessToken,
      clientKeyResponse.expires_in,
      serviceName
    );
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    return c.json({ ok: false, error: error }, 500);
  }

  return c.json(
    { ok: true, tokens: { access: accessToken, refresh: clientKey } },
    200
  );
});

app.get("/callback-test", async c => {
  const { code, state } = c.req.query();
  return c.json({ ok: true, code: code, state: state }, 200);
});

app.get("/token-test", async c => {
  const user = c.get("user");

  if (!user) {
    return c.json(
      { ok: false, message: "x-user-id header was not supplied" },
      400
    );
  }

  let token;
  try {
    token = await getAccessToken(c.env, user.workspaceId!);
  } catch (error: any) {
    console.error(error.message);
    return c.json({ ok: false, error: error.message }, 500);
  }

  return c.json({ ok: true, user: user, message: token }, 200);
});

app.get("/dev", async c => {
  const user = c.get("user");

  if (!user) {
    return c.json(
      { ok: false, message: "x-user-id header was not supplied" },
      400
    );
  }

  return c.json({ ok: true, user: user }, 200);
});

export const FikenInternalApp = app;
