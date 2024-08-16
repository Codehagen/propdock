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
    const newIncomeUnits =
      await prisma.financialAnalysisBuildingIncome.createMany({
        data: Array(incomeData.numberOfUnits).fill({
          financialAnalysisBuildingId: analysisId,
          typeDescription: incomeData.typeDescription,
          areaPerUnit: incomeData.areaPerUnit,
          valuePerUnit: incomeData.valuePerUnit,
        }),
      })

    console.log(
      `Added ${newIncomeUnits.count} new income units to analysis ID: ${analysisId}`,
    )
    revalidatePath(`/analyse/${analysisId}`)

    return { success: true, count: newIncomeUnits.count }
  } catch (error) {
    console.error(
      `Error adding income units for analysis ID: ${analysisId}`,
      error,
    )
    return { success: false, error: error.message }
  }
}

export async function updateIncomeUnit(
  incomeUnitId: string,
  updateData: Partial<{
    typeDescription: string
    areaPerUnit: number
    valuePerUnit: number
    numberOfUnits: number
  }>,
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
        if (["areaPerUnit", "valuePerUnit", "numberOfUnits"].includes(key)) {
          acc[key] = Number(value)
        } else {
          acc[key] = value
        }
        return acc
      },
      {},
    )

    const updatedIncomeUnit =
      await prisma.financialAnalysisBuildingIncome.update({
        where: { id: incomeUnitId },
        data: processedData,
      })

    console.log(`Updated income unit with ID: ${updatedIncomeUnit.id}.`)
    revalidatePath(`/analyse/${updatedIncomeUnit.financialAnalysisBuildingId}`)

    return { success: true, incomeUnit: updatedIncomeUnit }
  } catch (error) {
    console.error(`Error updating income unit with ID: ${incomeUnitId}`, error)
    return { success: false, error: error.message }
  }
}

export async function deleteIncomeUnit(incomeUnitId: string) {
  const user = await getCurrentUser()
  const userId = user?.id

  if (!userId) {
    console.error("No user is currently logged in.")
    return { success: false, error: "User not authenticated" }
  }

  try {
    const deletedIncomeUnit =
      await prisma.financialAnalysisBuildingIncome.delete({
        where: { id: incomeUnitId },
      })

    console.log(`Deleted income unit with ID: ${deletedIncomeUnit.id}.`)
    revalidatePath(`/analyse/${deletedIncomeUnit.financialAnalysisBuildingId}`)

    return { success: true, incomeUnit: deletedIncomeUnit }
  } catch (error) {
    console.error(`Error deleting income unit with ID: ${incomeUnitId}`, error)
    return { success: false, error: error.message }
  }
}
