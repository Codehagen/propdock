import type { User } from "@prisma/client";
import { honoFactory } from "../../lib/hono";
import {
  createProperty,
  editWorkspaceProperty,
  getAllWorkspaceProperties,
  getWorkspacePropertyById,
} from "../../models/properties";

const app = honoFactory();

app.post("/", async (c) => {
  const user: User = c.get("user")!;
  const body = await c.req.json();

  let type;
  let name;
  try {
    ({ type, name } = body);
  } catch (error) {
    console.error("Invalid or incomplete `body`");
    return c.json(
      {
        ok: false,
        message:
          "Request body not in valid format or missing required attributes",
      },
      400,
    );
  }

  try {
    const property = await createProperty(user, name, type, c.env);
    return c.json({ ok: true, details: property }, 201);
  } catch (error) {
    return c.json({ ok: false, message: error }, 500);
  }
});

app.get("/", async (c) => {
  const user: User = c.get("user")!;
  try {
    const properties = await getAllWorkspaceProperties(user, c.env);
    return c.json({ ok: true, details: properties }, 200);
  } catch (error) {
    return c.json({ ok: false, message: error }, 500);
  }
});

app.get("/:id", async (c) => {
  const user: User = c.get("user")!;
  const id = c.req.param("id");

  try {
    const property = await getWorkspacePropertyById(user, id, c.env);
    return c.json({ ok: true, details: property }, 200);
  } catch (error) {
    return c.json({ ok: false, message: error }, 500);
  }
});

app.patch("/:id", async (c) => {
  const user: User = c.get("user")!;
  const id = c.req.param("id");

  let data;
  try {
    data = await c.req.json();
  } catch (error) {
    console.error(error);
    return c.json({ ok: false, message: error }, 500);
  }

  try {
    const property = await editWorkspaceProperty(user, id, data, c.env);
    return c.json({ ok: true, details: property }, 200);
  } catch (error) {
    return c.json({ ok: false, message: error }, 500);
  }
});

export const properties = app;
