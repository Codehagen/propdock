"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function createProperty(propertyName: string) {
  const user = await getCurrentUser();
  const userId = user?.id;

  if (!userId) {
    console.error("No user is currently logged in.");
    return { success: false, error: "User not authenticated" };
  }

  try {
    // Fetch the user's workspace to associate the property
    const workspace = await prisma.workspace.findFirst({
      where: { users: { some: { id: userId } } },
      select: { id: true },
    });

    if (!workspace) {
      throw new Error("No workspace found for this user");
    }

    // Create a new property within the found workspace
    const newProperty = await prisma.property.create({
      data: {
        name: propertyName,
        workspaceId: workspace.id,
      },
    });
    console.log(
      `Created property with ID: ${newProperty.id} for workspace ID: ${workspace.id}.`,
    );

    revalidatePath("/dashboard"); // Updates the cache for the dashboard page

    return { success: true, property: newProperty };
  } catch (error) {
    console.error(`Error creating property for user ID: ${userId}`, error);
    return { success: false, error: error.message };
  }
}
