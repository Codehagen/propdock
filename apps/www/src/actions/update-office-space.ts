"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

export async function updateOfficeSpace(
  officeId: string,
  updateData: Partial<{
    name: string
    sizeKvm: number
    exclusiveAreaKvm: number
    commonAreaKvm: number
    isRented: boolean
  }>,
  currentPath: string,
) {
  const user = await getCurrentUser()
  const userId = user?.id

  if (!userId) {
    console.error("No user is currently logged in.")
    return { success: false, error: "User not authenticated" }
  }

  try {
    // Ensure numeric fields are converted to numbers
    const processedData = Object.entries(updateData).reduce(
      (acc, [key, value]) => {
        if (["sizeKvm", "exclusiveAreaKvm", "commonAreaKvm"].includes(key)) {
          acc[key] = Number(value)
        } else if (key === "isRented") {
          acc[key] = Boolean(value)
        } else {
          acc[key] = value
        }
        return acc
      },
      {} as Record<string, any>,
    )

    const updatedOfficeSpace = await prisma.officeSpace.update({
      where: { id: officeId },
      data: processedData,
    })

    console.log(`Updated office space with ID: ${updatedOfficeSpace.id}.`)
    revalidatePath(currentPath)

    return { success: true, officeSpace: updatedOfficeSpace }
  } catch (error) {
    console.error(`Error updating office space with ID: ${officeId}`, error)
    return { success: false, error: error.message }
  }
}
