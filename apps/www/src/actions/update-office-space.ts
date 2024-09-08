"use server";

import { prisma } from "@/lib/db";

export async function updateOfficeSpace(
  officeId: number,
  newName: string,
  sizeKvm: number,
  isRented: boolean
) {
  try {
    const updatedOffice = await prisma.officeSpace.update({
      where: { id: officeId },
      data: { name: newName, sizeKvm, isRented }
    });

    return { success: true, office: updatedOffice };
  } catch (error) {
    console.error("Error updating office space:", error);
    return { success: false, error: error.message };
  }
}
