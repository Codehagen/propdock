// actions/create-office-space.ts
"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

interface OfficeSpaceData {
  name: string;
  sizeKvm: number;
  isRented: boolean;
}

export async function createOfficeSpace(
  floorId: string,
  data: OfficeSpaceData,
) {
  const user = await getCurrentUser();
  const userId = user?.id;

  if (!userId) {
    console.error("No user is currently logged in.");
    return { success: false, error: "User not authenticated" };
  }

  try {
    const newOfficeSpace = await prisma.officeSpace.create({
      data: {
        floorId: parseInt(floorId),
        name: data.name,
        sizeKvm: data.sizeKvm,
        isRented: data.isRented,
      },
    });

    return { success: true, officeSpace: newOfficeSpace };
  } catch (error) {
    console.error(
      `Error creating office space for floor ID: ${floorId}`,
      error,
    );
    return { success: false, error: error.message };
  }
}
