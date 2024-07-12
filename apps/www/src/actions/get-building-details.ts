// src/actions/get-building-details.ts
import { prisma } from "@/lib/db"

export async function getBuildingDetails(buildingId: string) {
  try {
    const building = await prisma.building.findUnique({
      where: { id: buildingId },
      include: {
        floors: {
          include: {
            officeSpaces: {
              include: {
                tenants: {
                  include: {
                    contacts: true,
                  },
                },
              },
            },
          },
        },
        // Add other related models if needed, e.g., tenants, contracts, etc.
      },
    })

    if (!building) {
      return null
    }

    return building
  } catch (error) {
    console.error("Error fetching building details:", error)
    throw new Error("Unable to fetch building details")
  }
}
