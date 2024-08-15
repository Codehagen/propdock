"use server"

import { revalidatePath } from "next/cache"

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
      where: { id: analysisId },
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

export async function addIncomeUnits(
  analysisId: string,
  incomeData: {
    typeDescription: string
    areaPerUnit: number
    valuePerUnit: number
    numberOfUnits: number
  },
) {
  const user = await getCurrentUser()
  const userId = user?.id

  if (!userId) {
    console.error("No user is currently logged in.")
    return { success: false, error: "User not authenticated" }
  }

  try {
    const newIncomeUnit = await prisma.financialAnalysisBuildingIncome.create({
      data: {
        financialAnalysisBuildingId: analysisId,
        typeDescription: incomeData.typeDescription,
        areaPerUnit: incomeData.areaPerUnit,
        valuePerUnit: incomeData.valuePerUnit,
      },
    })

    console.log(
      `Added new income unit with ID: ${newIncomeUnit.id} to analysis ID: ${analysisId}`,
    )
    revalidatePath(`/analytics/${analysisId}`)

    return { success: true, incomeUnit: newIncomeUnit }
  } catch (error) {
    console.error(
      `Error adding income unit for analysis ID: ${analysisId}`,
      error,
    )
    return { success: false, error: error.message }
  }
}
