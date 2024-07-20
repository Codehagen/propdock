import { User } from "@prisma/client"

import { honoFactory } from "../../lib/hono"
import {
  createBuilding,
  editWorkspaceBuilding,
  getAllBuildingsByProperty,
  getAllWorkspaceBuildings,
  getWorkspaceBuildingById,
} from "../../models/buildings"

const app = honoFactory()

app.post("/", async (c) => {
  const user: User = c.get("user")!
  const body = await c.req.json()

  let propertyId, buildingData
  try {
    ;({ propertyId, ...buildingData } = body)
  } catch (error) {
    console.error(error)
    return c.json(
      {
        ok: false,
        message:
          "Request body not in valid format or missing required attributes",
      },
      400,
    )
  }

  try {
    const building = await createBuilding(user, propertyId, buildingData, c.env)
    return c.json({ ok: true, details: building }, 201)
  } catch (error) {
    return c.json({ ok: false, message: error }, 500)
  }
})

app.get("/", async (c) => {
  const user: User = c.get("user")!

  try {
    const buildings = await getAllWorkspaceBuildings(user, c.env)
    return c.json({ ok: true, details: buildings }, 200)
  } catch (error) {
    return c.json({ ok: false, message: error }, 500)
  }
})

app.get("/property/:id", async (c) => {
  const user: User = c.get("user")!
  const id = c.req.param("id")

  try {
    const buildings = await getAllBuildingsByProperty(user, id, c.env)
    return c.json({ ok: true, details: buildings }, 200)
  } catch (error) {
    return c.json({ ok: false, message: error }, 500)
  }
})

app.get("/:id", async (c) => {
  const user: User = c.get("user")!
  const id = c.req.param("id")

  try {
    const building = await getWorkspaceBuildingById(user, id, c.env)
    return c.json({ ok: true, details: building }, 200)
  } catch (error) {
    return c.json({ ok: false, message: error }, 500)
  }
})

app.patch("/:id", async (c) => {
  const user: User = c.get("user")!
  const id = c.req.param("id")

  let data
  try {
    data = await c.req.json()
  } catch (error) {
    console.error(error)
    return c.json({ ok: false, message: error }, 500)
  }

  try {
    const building = await editWorkspaceBuilding(user, id, data, c.env)
    return c.json({ ok: true, details: building }, 200)
  } catch (error) {
    return c.json({ ok: false, message: error }, 500)
  }
})

export const buildings = app
