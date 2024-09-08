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
    // Fetch the workspace associated with the user
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
    });

    if (!userWorkspace) {
      console.error("No workspace found for this user.");
      return { success: false, error: "No workspace found" };
    }

    // Create a new contract
    const newContract = await prisma.contract.create({
      data: {
        workspace: {
          connect: { id: userWorkspace.id },
        },
        tenant: {
          connect: { id: contractData.tenantId },
        },
        property: {
          connect: { id: contractData.propertyId },
        },
        building: {
          connect: { id: contractData.buildingId },
        },
        floors: contractData.floors,
        officeSpaces: contractData.officeSpaces,
        contact: {
          connect: { id: contractData.contactId },
        },
        landlordOrgnr: contractData.landlordOrgnr,
        landlordName: contractData.landlordName,
        contractType: contractData.contractType,
        contactName: contractData.contactName,
        contactEmail: contractData.contactEmail,
        contactPhone: contractData.contactPhone,
        startDate: contractData.startDate,
        endDate: contractData.endDate,
        negotiationDate: contractData.negotiationDate,
        isRenewable: contractData.isRenewable,
        renewablePeriod: contractData.renewablePeriod,
        indexationType: contractData.indexationType,
        indexValue: contractData.indexValue,
        indexationDate: contractData.indexationDate,
        baseRent: contractData.baseRent,
        currency: contractData.currency || "NOK", // Default to NOK if not provided
        currencyIso: contractData.currencyIso || "NOK", // Default to NOK if not provided
        rentPeriod: contractData.rentPeriod,
        vatTerms: contractData.vatTerms,
        businessCategory: contractData.businessCategory,
        collateral: contractData.collateral,
        isContinuousRent: contractData.isContinuousRent || false,
      },
    });

    console.log(
      `Created contract with ID: ${newContract.id} for workspace ID: ${userWorkspace.id}.`,
    );

    return { success: true, contract: newContract };
  } catch (error) {
    console.error(`Error creating contract for user ID: ${userId}`, error);
    return { success: false, error: error.message };
  }
}
