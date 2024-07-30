"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

export async function createTenant(tenantData) {
  const user = await getCurrentUser()
  const userId = user?.id

  if (!userId) {
    console.error("No user is currently logged in.")
    return { success: false, error: "User not authenticated" }
  }

  try {
    // Fetch the user's workspace to associate the tenant
    const workspace = await prisma.workspace.findFirst({
      where: { users: { some: { id: userId } } },
      select: { id: true },
    })

    if (!workspace) {
      throw new Error("No workspace found for this user")
    }

    // Create a new tenant within the found workspace
    const newTenant = await prisma.tenant.create({
      data: {
        name: tenantData.name,
        orgnr: tenantData.orgnr,
        numEmployees: tenantData.numEmployees,
        propertyId: tenantData.propertyId,
        buildingId: tenantData.buildingId,
      },
    })
    console.log(
      `Created tenant with ID: ${newTenant.id} for workspace ID: ${workspace.id}.`,
    )

    revalidatePath("/tenant")

    return { success: true, tenant: newTenant }
  } catch (error) {
    console.error(`Error creating tenant for user ID: ${userId}`, error)
    return { success: false, error: error.message }
  }
}
