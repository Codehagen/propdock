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
    let updateData: any = {}

    if (tenantId === null || tenantId === "none") {
      updateData = {
        tenants: { disconnect: true },
        isRented: false,
      }
    } else {
      // Check if the tenant is already assigned to another office
      const existingAssignment = await prisma.officeSpace.findFirst({
        where: {
          tenants: {
            some: {
              id: tenantId,
            },
          },
        },
      })

      if (existingAssignment) {
        return {
          success: false,
          error: "Denne leietakeren er allerede tildelt et kontor.",
        }
      }

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
