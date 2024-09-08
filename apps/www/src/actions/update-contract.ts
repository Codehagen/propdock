"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function updateContract(contractId, updateData) {
  const user = await getCurrentUser();
  const userId = user?.id;

  if (!userId) {
    console.error("No user is currently logged in.");
    return { success: false, error: "User not authenticated" };
  }

  try {
    const updatedContract = await prisma.contract.update({
      where: { id: contractId },
      data: {
        ...updateData
      }
    });

    console.log(`Updated contract with ID: ${updatedContract.id}.`);

    return { success: true, contract: updatedContract };
  } catch (error) {
    console.error(`Error updating contract for user ID: ${userId}`, error);
    return { success: false, error: error.message };
  }
}
