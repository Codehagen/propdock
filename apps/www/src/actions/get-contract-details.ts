"use server";

import { prisma } from "@/lib/db";

export async function getContractDetails(tenantId: string) {
  try {
    const contracts = await prisma.contract.findMany({
      where: { tenantId },
      include: {
        building: true,
        floors: true,
        officeSpaces: true,
        property: true,
      },
    });

    return contracts;
  } catch (error) {
    console.error("Error fetching contract details:", error);
    return null;
  }
}
