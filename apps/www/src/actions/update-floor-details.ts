"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";

export async function updateFloorDetails(floorId, data, currentPath) {
  try {
    const updatedFloor = await prisma.floor.update({
      where: { id: floorId },
      data: {
        number: data.number, // Ensure this matches your field name
        maxTotalKvm: data.maxTotalKvm,
      },
    });

    revalidatePath(currentPath);

    return { success: true, floor: updatedFloor };
  } catch (error) {
    console.error("Error updating floor details:", error);
    return { success: false, error: error.message };
  }
}

export async function quickDeleteFloor(floorId, currentPath) {
  try {
    await prisma.floor.delete({
      where: {
        id: floorId,
      },
    });

    revalidatePath(currentPath);

    return { success: true };
  } catch (error) {
    console.error("Error quick deleting floor:", error);
    return { success: false, error: error.message };
  }
}
