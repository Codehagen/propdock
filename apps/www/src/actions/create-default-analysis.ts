"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

export async function generateDefaultAnalysis(propertyData: any) {
  try {
    const user = await getCurrentUser()
    const userId = user?.id

    if (!userId) {
      console.error("No user is currently logged in.")
      return { success: false, error: "User not authenticated" }
    }

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
      return { success: false, error: "No workspace found" }
    }

    const bra = propertyData.rentableArea || 0
    const sumDriftsinntekter = propertyData.sumDriftsinntekter || 0
    const ownerCostsManual = propertyData.ownerCostsManual || 0

    const newAnalysis = await prisma.financialAnalysisBuilding.create({
      data: {
        name: `Analyse for ${propertyData.name || "Ukjent eiendom"}`,
        workspaceId: userWorkspace.id,
        buildingId: propertyData.buildingId,
        rentableArea: bra,
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
        useCalcROI: true,
        roiWeightedYield: 0.05,
        roiInflation: 0.03,
        roiCalculated: 0.08,
        roiManual: 0.06,
        marketRentOffice: 600,
        marketRentMerch: 400,
        marketRentMisc: 300,
        usePrimeYield: true,
        manYieldOffice: 0.05,
        manYieldMerch: 0.04,
        manYieldMisc: 0.03,
        manYieldWeighted: 0.045,
        kpi1: 1,
        kpi2: 2,
        kpi3: 3,
        kpi4: 4,
        costs: {
          create: {
            ownerCostsMethod: true,
            ownerCostsManual: ownerCostsManual,
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
          },
        },
        incomeUnits: {
          create: [
            {
              typeDescription: "Office Space",
              areaPerUnit: bra,
              valuePerUnit: sumDriftsinntekter,
            },
          ],
        },
      },
    })

    console.log(`Generated new analysis with ID: ${newAnalysis.id}`)

    revalidatePath("/analytics")

    return { success: true, analysis: newAnalysis }
  } catch (error) {
    console.error("Error generating default analysis:", error)
    return { success: false, error: error.message }
  }
}
