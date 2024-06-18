// actions/create-building.ts
"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

interface BuildingData {
  name: string;
  address?: string;
  gnr?: number;
  bnr?: number;
  snr?: number;
  fnr?: number;
}

export async function createBuilding(propertyId: string, data: BuildingData) {
  const user = await getCurrentUser();
  const userId = user?.id;

  if (!userId) {
    console.error("No user is currently logged in.");
    return { success: false, error: "User not authenticated" };
  }

  try {
    // Fetch the property to get the workspaceId
    const property = await prisma.property.findUnique({
      where: { id: parseInt(propertyId) }, // Assuming propertyId is a string but is stored as an integer
      select: { workspaceId: true },
    });

    if (!property) {
      return { success: false, error: "Property not found" };
    }

    const newBuilding = await prisma.building.create({
      data: {
        name: data.name,
        propertyId: parseInt(propertyId),
        workspaceId: property.workspaceId,
        address: data.address ?? "Default Address",
        gnr: data.gnr ?? 0,
        bnr: data.bnr ?? 0,
        snr: data.snr ?? 0,
        fnr: data.fnr ?? 0,
      },
    });

    console.log(
      `Created building with ID: ${newBuilding.id} for property ID: ${propertyId}.`,
    );

    revalidatePath("/property"); // Updates the cache for the dashboard page

    return { success: true, building: newBuilding };
  } catch (error) {
    console.error(
      `Error creating building for property ID: ${propertyId}`,
      error,
    );
    return { success: false, error: error.message };
  }
}
