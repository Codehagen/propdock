"use server"

import { prisma } from "@/lib/db"

export async function getWorkspaceTenants(workspaceId: string) {
  console.log("Fetching tenants for workspace:", workspaceId)
  try {
    const tenants = await prisma.tenant.findMany({
      where: {
        property: {
          workspaceId: workspaceId,
        },
      },
      select: {
        id: true,
        name: true,
        orgnr: true,
        numEmployees: true,
        property: {
          select: {
            name: true,
          },
        },
        building: {
          select: {
            name: true,
          },
        },
        floor: {
          select: {
            number: true,
          },
        },
        officeSpace: {
          select: {
            name: true,
            isRented: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    console.log("Fetched tenants:", tenants)

    return {
      success: true,
      tenants: tenants.map((tenant) => ({
        id: tenant.id,
        name: tenant.name,
        orgnr: tenant.orgnr,
        numEmployees: tenant.numEmployees,
        propertyName: tenant.property.name,
        buildingName: tenant.building?.name,
        floorNumber: tenant.floor?.number,
        officeName: tenant.officeSpace?.name,
        isRenting: tenant.officeSpace?.isRented ?? false,
      })),
    }
  } catch (error) {
    console.error("Error fetching workspace tenants:", error)
    return { success: false, error: error.message }
  }
}
