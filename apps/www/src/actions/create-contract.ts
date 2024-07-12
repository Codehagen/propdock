"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function createContract(contractData) {
  const user = await getCurrentUser();
  const userId = user?.id;

  if (!userId) {
    console.error("No user is currently logged in.");
    return { success: false, error: "User not authenticated" };
  }

  try {
    // Fetch the user's workspace to associate the contract
    const workspace = await prisma.workspace.findFirst({
      where: { users: { some: { id: userId } } },
      select: { id: true },
    });

    if (!workspace) {
      throw new Error("No workspace found for this user");
    }

    // Create a new contract
    const newContract = await prisma.contract.create({
      data: {
        tenantId: contractData.tenantId,
        propertyId: contractData.property,
        buildingId: contractData.building,
        floors: {
          connect: { id: contractData.floor },
        },
        officeSpaces: {
          connect: { id: contractData.officeSpace },
        },
        workspaceId: workspace.id,
        contactId: parseInt(contractData.contactId), // Ensure contactId is passed correctly
        contactName: contractData.contactName,
        contactEmail: contractData.contactEmail,
        contactPhone: contractData.contactPhone,
        landlordOrgnr: contractData.landlordOrgnr,
        landlordName: contractData.landlordName,
        contractType: contractData.contractType,
        startDate: contractData.startDate,
        endDate: contractData.endDate,
        negotiationDate: contractData.negotiationDate,
        isRenewable: contractData.isRenewable,
        renewablePeriod: contractData.renewablePeriod,
        indexationType: contractData.indexationType,
        indexValue: contractData.indexValue,
        indexationDate: contractData.indexationDate,
        baseRent: contractData.baseRent,
        rentPeriod: contractData.rentPeriod,
        vatTerms: contractData.vatTerms,
        businessCategory: contractData.businessCategory,
        collateral: contractData.collateral,
      },
    });

    console.log(
      `Created contract with ID: ${newContract.id} for workspace ID: ${workspace.id}.`
    );

    return { success: true, contract: newContract };
  } catch (error) {
    console.error(`Error creating contract for user ID: ${userId}`, error);
    return { success: false, error: error.message };
  }
}
