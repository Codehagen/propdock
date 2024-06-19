// src/actions/get-buildings.ts
"use server";

import { prisma } from "@/lib/db";

export async function getBuildings(propertyId: number) {
  try {
    const buildings = await prisma.building.findMany({
      where: { propertyId },
      select: {
        id: true,
        name: true,
      },
    });
    return buildings;
  } catch (error) {
    console.error("Error fetching buildings:", error);
    return [];
  }
}
