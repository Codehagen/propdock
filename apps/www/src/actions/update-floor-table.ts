"use server"

import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

export async function updateFloor(
  floorId: string,
  updateData: {
    maxTotalKvm?: number
    maxOfficeKvm?: number
    maxCommonKvm?: number
  },
) {
  const user = await getCurrentUser()
  const userId = user?.id

  if (!userId) {
    console.error("No user is currently logged in.")
    return { success: false, error: "User not authenticated" }
  }

  try {
    const updatedFloor = await prisma.floor.update({
      where: { id: floorId },
      data: updateData,
    })

    console.log(`Updated floor with ID: ${updatedFloor.id}.`)

    return { success: true, floor: updatedFloor }
  } catch (error) {
    console.error(`Error updating floor with ID: ${floorId}`, error)
    return { success: false, error: error.message }
  }
}
