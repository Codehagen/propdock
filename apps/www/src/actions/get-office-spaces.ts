// src/actions/get-office-spaces.ts
"use server";

import { prisma } from "@/lib/db";

export async function getOfficeSpaces(floorId: number) {
  try {
    const officeSpaces = await prisma.officeSpace.findMany({
      where: { floorId },
      select: {
        id: true,
        name: true,
      },
    });
    return officeSpaces;
  } catch (error) {
    console.error("Error fetching office spaces:", error);
    return [];
  }
}
