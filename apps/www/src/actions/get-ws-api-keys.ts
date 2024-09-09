// src/actions/get-api-keys.ts
"use server";

import { prisma } from "@/lib/db";

export async function getWsApiKeys(workspaceId: string) {
  try {
    const apiKeys = await prisma.wSApiKey.findMany({
      where: {
        workspaceId,
      },
      select: {
        id: true,
        serviceName: true,
        // secret: true,
        isActive: true,
      },
      orderBy: {
        serviceName: "asc",
      },
    });

    return { success: true, apiKeys };
  } catch (error) {
    console.error("Error fetching API keys:", error);
    return { success: false, error: error.message };
  }
}
