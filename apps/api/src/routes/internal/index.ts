import { createAPIKey } from "../../auth/unkey";
import { honoFactory } from "../../lib/hono";
import internalAuthMiddleware from "../../routes/internal/authMiddleware";
import { ESignApp } from "./esign";
import { fiken } from "./fiken";
import { FikenInternalApp } from "./oauth/fiken";
import { POInternalApp } from "./oauth/poweroffice";
import { poweroffice } from "./poweroffice"; // Import the new route

const internal = honoFactory();

internal.use(internalAuthMiddleware);

// Routes
internal.all("/test", c => {
  return c.text("GET /api/internal/test");
});

// OAuth
internal.route("/oauth/poweroffice", POInternalApp);
internal.route("/oauth/fiken", FikenInternalApp);

// Esign
internal.route("/esign", ESignApp);

// PowerOffice
internal.route("/poweroffice", poweroffice);

// Fiken API routes
internal.route("/fiken", fiken);

// API key management
internal.post("/workspace/api/create", async c => {
  let workspaceId;
  let serviceName;
  let prefix;

  try {
    const body = await c.req.json();
    workspaceId = body.workspace;
    serviceName = body.serviceName ? body.serviceName : "";
    prefix = body.prefix ? body.prefix : "";

    if (!workspaceId) {
      return c.json(
        { ok: false, message: "Supply an ID for the workspace" },
        400
      );
    }
  } catch (error) {
    console.error(error);
  }

  try {
    const res = await createAPIKey(workspaceId, serviceName, prefix);
    if (res) {
      return c.json({ ok: true, message: res }, 201);
    }
  } catch (error) {
    console.error(error);
  }

  return c.json({ ok: false, message: "Something went wrong" }, 500);
});

export default internal;
