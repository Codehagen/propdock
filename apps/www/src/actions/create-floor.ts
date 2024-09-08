// actions/create-floor.ts
"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function createFloor(
  buildingId: string,
  data: {
    number: number;
    maxTotalKvm: number;
    maxOfficeKvm: number;
    maxCommonKvm: number;
  }
) {
  const user = await getCurrentUser();
  const userId = user?.id;

  if (!userId) {
    console.error("No user is currently logged in.");
    return { success: false, error: "User not authenticated" };
  }

  try {
    const newFloor = await prisma.floor.create({
      data: {
        number: data.number,
        maxTotalKvm: data.maxTotalKvm,
        maxOfficeKvm: data.maxOfficeKvm,
        maxCommonKvm: data.maxCommonKvm,
        buildingId: buildingId
      }
    });

    console.log(
      `Created floor with ID: ${newFloor.id} for building ID: ${buildingId}.`
    );
    revalidatePath(`/property/[id]/building/${buildingId}`); // Updates the cache for the building page

    return { success: true, floor: newFloor };
  } catch (error) {
    console.error(`Error creating floor for building ID: ${buildingId}`, error);
    return { success: false, error: error.message };
  }
}
