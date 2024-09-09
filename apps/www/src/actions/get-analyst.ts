"use server";

import { prisma } from "@/lib/db";

export async function getAnalyses(workspaceId: string) {
  try {
    const analyses = await prisma.financialAnalysisBuilding.findMany({
      where: {
        workspaceId: workspaceId,
      },
      select: {
        id: true,
        name: true,
        rentableArea: true,
        rentPerArea: true,
        sumValueNow: true,
        sumValueExit: true,
        appreciationDate: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return { success: true, analyses };
  } catch (error) {
    console.error("Error fetching analyses:", error);
    return { success: false, error: error.message };
  }
}
