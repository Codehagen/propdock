import { getBuildings } from "@/actions/get-buildings"

import { prisma } from "./__mocks__/prisma"

describe("getBuildings", () => {
  const propertyId = "123123vasdhj1b23"

  it("should return an array for a valid propertyId", async () => {
    const mockBuildings = [
      {
        id: "building-1",
        name: "Building 1",
        address: "123 Main St",
        gnr: 1,
        bnr: 2,
        snr: 3,
        fnr: 4,
        workspaceId: "workspace-1",
        propertyId: "property-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "building-2",
        name: "Building 2",
        address: "456 Main St",
        gnr: 5,
        bnr: 6,
        snr: 7,
        fnr: 8,
        workspaceId: "workspace-2",
        propertyId: "property-2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    prisma.building.findMany.mockResolvedValue(mockBuildings)

    const buildings = await getBuildings(propertyId)

    expect(Array.isArray(buildings)).toBe(true)
  })

  it("should return an empty array when an error occurs", async () => {
    prisma.building.findMany.mockRejectedValue(new Error("Database error"))

    const buildings = await getBuildings(propertyId)

    expect(buildings).toEqual([])
  })
})
