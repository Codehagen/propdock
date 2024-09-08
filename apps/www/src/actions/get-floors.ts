// src/actions/get-floors.ts
"use server";

import { prisma } from "@/lib/db";

export async function getFloors(buildingId: number) {
  try {
    const floors = await prisma.floor.findMany({
      where: { buildingId },
      select: {
        id: true,
        number: true
      }
    });
    return floors;
  } catch (error) {
    console.error("Error fetching floors:", error);
    return [];
  }
}
