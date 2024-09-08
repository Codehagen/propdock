"use server";

import { revalidatePath } from "next/cache";

import { currencies } from "@/lib/currencies"; // Added this import
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function updateContractDetails(
  contractId: string | null,
  data: any,
  currentPath: string
) {
  const user = await getCurrentUser();
  const userId = user?.id;

  if (!userId) {
    console.error("No user is currently logged in.");
    return { success: false, error: "No user is currently logged in." };
  }

  try {
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
      return { success: false, error: "No workspace found for this user." };
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: data.tenantId },
      include: {
        building: true,
        property: true
      }
    });

    if (!tenant || !tenant.building || !tenant.property) {
      console.error("Tenant or associated building/property not found.");
      return {
        success: false,
        error: "Tenant or associated building/property not found."
      };
    }

    const contractData = {
      contractType: data.contractType,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      baseRent: data.baseRent,
      indexationType: data.indexationType,
      indexValue: data.indexValue,
      currencyIso: data.currencyIso,
      currency:
        currencies.find(c => c.code === data.currencyIso)?.name ||
        data.currencyIso
    };

    let contract;

    if (contractId && contractId !== "0") {
      // Update existing contract
      contract = await prisma.contract.update({
        where: { id: contractId },
        data: contractData
      });
    } else {
      // Create new contract
      contract = await prisma.contract.create({
        data: {
          ...contractData,
          tenantId: data.tenantId,
          buildingId: tenant.building.id,
          workspaceId: userWorkspace.id,
          propertyId: tenant.property.id
        }
      });
    }

    revalidatePath(currentPath);

    return { success: true, contract };
  } catch (error) {
    console.error("Error updating contract details:", error);
    return { success: false, error: error.message };
  }
}
