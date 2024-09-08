"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function generateDefaultAnalysis(propertyData: any) {
  try {
    const user = await getCurrentUser();
    const userId = user?.id;

    if (!userId) {
      console.error("No user is currently logged in.");
      return { success: false, error: "User not authenticated" };
    }

    const userWorkspace = await prisma.workspace.findFirst({
      where: {
        users: {
          some: {
            id: userId
          }
        }
      },
      select: {
        id: true
      }
    });

    if (!userWorkspace) {
      console.error("No workspace found for this user.");
      return { success: false, error: "No workspace found" };
    }

    const bra = propertyData.rentableArea || 0;
    const sumDriftsinntekter = propertyData.sumDriftsinntekter || 0;
    const ownerCostsManual = propertyData.ownerCostsManual || 0;

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
        kpi1: 0.01,
        kpi2: 0.02,
        kpi3: 0.03,
        kpi4: 0.04,
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
            costSum: 45000
          }
        },
        incomeUnits: {
          create: [
            {
              typeDescription: "Office Space",
              areaPerUnit: bra,
              valuePerUnit: sumDriftsinntekter
            }
          ]
        },
        tenants: {
          create: [
            {
              name: "Me Without The Boys AS",
              organizationNumber: "919415754",
              address: "123 Main St, City",
              NACEcode: "62.010",
              employees: 50,
              operatingIncome: 1000000,
              wagesCosts: 500000,
              totalOperatingCosts: 750000,
              operatingResult: 250000,
              netFinance: -50000,
              resultBeforeTax: 200000
            },
            {
              name: "Corponor AS",
              organizationNumber: "969026155",
              NACEcode: "70.220",
              employees: 30,
              operatingIncome: 750000,
              wagesCosts: 375000,
              totalOperatingCosts: 562500,
              operatingResult: 187500,
              netFinance: -37500,
              resultBeforeTax: 150000
            }
          ]
        }
      }
    });

    console.log(`Generated new analysis with ID: ${newAnalysis.id}`);

    // Update the revalidatePath call
    // revalidatePath(`/analytics/${newAnalysis.id}`)

    return { success: true, analysis: newAnalysis };
  } catch (error) {
    console.error("Error generating default analysis:", error);
    return { success: false, error: error.message };
  }
}
