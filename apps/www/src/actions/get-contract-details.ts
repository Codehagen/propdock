"use server"

import { prisma } from "@/lib/db"

export async function getContractDetails(tenantId: number) {
  try {
    const contracts = await prisma.contract.findMany({
      where: { tenantId: tenantId },
      include: {
        building: true,
        floor: true,
        officeSpace: true,
        property: true,
      },
    })

    return contracts
  } catch (error) {
    console.error("Error fetching contract details:", error)
    return null
  }
}
