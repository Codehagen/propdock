"use server"

import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

export async function assignTenantToOffice(
  officeId: string,
  tenantId: string | null,
  currentPath: string,
) {
  const user = await getCurrentUser()
  const userId = user?.id

  if (!userId) {
    console.error("No user is currently logged in.")
    return { success: false, error: "User not authenticated" }
  }

  try {
    // First, check if the office space exists
    const officeSpace = await prisma.officeSpace.findUnique({
      where: { id: officeId },
      include: { tenants: true },
    })

    if (!officeSpace) {
      return { success: false, error: "Office space not found" }
    }

    let updateData: any = {}

    if (tenantId === null) {
      // Remove all tenants from office
      updateData = {
        tenants: { set: [] },
        isRented: false,
      }
    } else {
      // Check if the tenant exists
      const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
      })

      if (!tenant) {
        return { success: false, error: "Tenant not found" }
      }

      // Assign tenant to office
      updateData = {
        tenants: { connect: { id: tenantId } },
        isRented: true,
      }
    }

    const updatedOffice = await prisma.officeSpace.update({
      where: { id: officeId },
      data: updateData,
      include: { tenants: true },
    })

    console.log("Updated office:", updatedOffice)

    return { success: true, office: updatedOffice }
  } catch (error) {
    console.error(
      `Error assigning tenant to office with ID: ${officeId}`,
      error,
    )
    return { success: false, error: error.message }
  }
}
