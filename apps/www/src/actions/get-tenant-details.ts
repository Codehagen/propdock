"use server"

import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

export async function getTenantDetails(tenantId) {
  const user = await getCurrentUser()
  const userId = user?.id

  if (!userId) {
    console.error("No user is currently logged in.")
    return null
  }

  try {
    // Fetch the workspace associated with the user
    const userWorkspace = await prisma.workspace.findFirst({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
      },
    })

    if (!userWorkspace) {
      console.error("No workspace found for this user.")
      return null
    }

    // Fetch tenant details
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        building: true,
        property: true,
        floor: true,
        officeSpace: true,
        contacts: true,
        contracts: true,
      },
    })

    if (!tenant) {
      return null
    }

    // Verify tenant's property and building belong to the current user's workspace
    const property = await prisma.property.findFirst({
      where: {
        id: tenant.propertyId,
        workspaceId: userWorkspace.id,
      },
    })

    const building = await prisma.building.findFirst({
      where: {
        id: tenant.buildingId,
        workspaceId: userWorkspace.id,
      },
    })

    if (!property || !building) {
      console.error(
        "Tenant's property or building does not belong to the user's workspace.",
      )
      return null
    }

    // Fetch available floors and office spaces
    const floors = await prisma.floor.findMany({
      where: {
        buildingId: building.id,
      },
      include: {
        officeSpaces: {
          where: {
            isRented: false,
          },
        },
      },
    })

    return { ...tenant, floors }
  } catch (error) {
    console.error("Error fetching tenant details:", error)
    return null
  }
}
