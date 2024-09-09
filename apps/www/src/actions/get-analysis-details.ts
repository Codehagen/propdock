"use server";

import { prisma } from "@/lib/db";

export async function getAnalysisDetails(analysisId: string) {
  try {
    if (!analysisId) {
      throw new Error("Invalid analysis ID");
    }

    const analysisDetails = await prisma.financialAnalysisBuilding.findUnique({
      where: { id: analysisId },
      include: {
        building: {
          select: {
            name: true,
          },
        },
        costs: true,
        incomeUnits: true,
        tenants: true,
      },
    });

    if (!analysisDetails) {
      throw new Error("Analysis not found");
    }

    return { success: true, analysisDetails };
  } catch (error) {
    console.error("Error fetching analysis details:", error);
    return { success: false, error: error.message };
  }
}
