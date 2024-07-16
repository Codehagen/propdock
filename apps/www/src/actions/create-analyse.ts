"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

export async function createAnalysis(analysisData) {
  const user = await getCurrentUser()
  const userId = user?.id

  if (!userId) {
    console.error("No user is currently logged in.")
    return { success: false, error: "User not authenticated" }
  }

  try {
    // Fetch the user's workspace to associate the analysis
    const workspace = await prisma.workspace.findFirst({
      where: { users: { some: { id: userId } } },
      select: { id: true },
    })

    if (!workspace) {
      throw new Error("No workspace found for this user")
    }

    // Create a new financial analysis for the selected building
    const newAnalysis = await prisma.financialAnalysisBuilding.create({
      data: {
        buildingId: analysisData.buildingId,
        name: analysisData.name, // Include the name field
        rentableArea: 1000,
        ratioAreaOffice: 0.5,
        ratioAreaMerch: 0.3,
        ratioAreaMisc: 0.2,
        rentPerArea: 500,
        avgExpiryPeriod: 12,
        appreciationDate: new Date(),
        lastDayOfYear: new Date(new Date().getFullYear(), 11, 31),
        lastBalanceDate: new Date(),
        numMonthsOfYear: 12,
        sumValueNow: 1000000,
        sumValueExit: 1200000,
        vacancyPerYear: JSON.stringify({ "2024": "10.5", "2025": "9.8" }),
        ownerCostsMethod: true,
        ownerCostsManual: 50000,
        costMaintenance: 10000,
        costInsurance: 5000,
        costRevision: 3000,
        costAdm: 2000,
        costOther: 1000,
        costNegotiation: 2000,
        costLegalFees: 1000,
        costConsultFees: 1500,
        costAssetMgmt: 2500,
        costSum: 45000,
        costBigExpenses: JSON.stringify({ "2024": "100000", "2025": "20500" }),
        useCalcROI: true,
        roiWeightedYield: 0.05,
        roiInflation: 0.02,
        roiCalculated: 0.07,
        roiManual: 0.06,
        marketRentOffice: 600,
        marketRentMerch: 400,
        marketRentMisc: 300,
        usePrimeYield: true,
        manYieldOffice: 0.05,
        manYieldMerch: 0.04,
        manYieldMisc: 0.03,
        manYieldWeighted: 0.045,
        kpi1: 0,
        kpi2: 0,
        kpi3: 0,
        kpi4: 0,
      },
    })
    console.log(
      `Created analysis with ID: ${newAnalysis.id} for building ID: ${analysisData.buildingId}.`,
    )

    revalidatePath("/analytics")

    return { success: true, analysis: newAnalysis }
  } catch (error) {
    console.error(`Error creating analysis for user ID: ${userId}`, error)
    return { success: false, error: error.message }
  }
}