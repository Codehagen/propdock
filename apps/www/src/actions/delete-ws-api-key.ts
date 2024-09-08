"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";

export async function deleteWsApiKey(workspaceId: string, serviceName: string) {
  try {
    const apiKey = await prisma.wSApiKey.findFirst({
      where: {
        workspaceId,
        serviceName
      }
    });

    if (!apiKey) {
      throw new Error("API key not found for the given service.");
    }

    await prisma.wSApiKey.delete({
      where: {
        id: apiKey.id
      }
    });

    // Revalidate the path after the API key is deleted
    revalidatePath("/settings/import");

    return { success: true };
  } catch (error) {
    console.error("Error disconnecting service:", error);
    return { success: false, error: error.message };
  }
}
