"use server"

import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

export async function updateAnalysis(analysisId, updateData) {
  const user = await getCurrentUser()
  const userId = user?.id

  if (!userId) {
    console.error("No user is currently logged in.")
    return { success: false, error: "User not authenticated" }
  }

  try {
    const updatedAnalysis = await prisma.financialAnalysisBuilding.update({
      where: { id: parseInt(analysisId, 10) },
      data: {
        ...updateData,
      },
    })

    console.log(`Updated analysis with ID: ${updatedAnalysis.id}.`)

    return { success: true, analysis: updatedAnalysis }
  } catch (error) {
    console.error(`Error updating analysis for user ID: ${userId}`, error)
    return { success: false, error: error.message }
  }
}
