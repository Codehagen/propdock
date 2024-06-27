import authMiddleware from "./authMiddleware";
import users from "../../routes/users";
import { createProperty } from "../../models/properties";
import { createBuilding } from "../../models/buildings";
import { User } from "@prisma/client"
import { honoFactory } from "../../lib/hono";


const external = honoFactory();

external.use(authMiddleware);

// Routes
external.route("/users", users);

external.all('/test', (c) => {
  return c.text('GET /api/external/test 200')
})

// **********
// Properties
// **********

external.post("/properties", async (c) => {
  const user: User = c.get("user")!
  const workspaceId = user.workspaceId


  if (workspaceId == null || workspaceId == undefined) {
    return c.json({ ok: false, message: "Cannot create property, user does not belong to a workspace" }, 400);
  }

  const body = await c.req.json()
  const type = body.type
  const name = body.name

  const property = await createProperty(workspaceId, name, type, c.env)

  return c.json({ ok: true, message: "Property created", details: property }, 201);
})
external.get("/properties")


// **********
// Buildings
// **********

external.post("/buildings", async (c) => {
  const user: User = c.get("user")!
  const workspaceId = user.workspaceId

  if (workspaceId == null || workspaceId == undefined) {
    return c.json({ ok: false, message: "Cannot create building, user does not belong to a workspace" }, 400);
  }

  const body = await c.req.json()
  const { propertyId, ...buildingData } = body;

  const building = await createBuilding(workspaceId, propertyId, buildingData, c.env)

  if (building) {
    return c.json({ ok: true, message: "Building created", details: building }, 201);
  }

  return c.json({ok: false, message: "Something went wrong."}, 500)
})


external.get("/buildings")

export default external