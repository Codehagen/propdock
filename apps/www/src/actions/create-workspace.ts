// actions/create-workspace.ts
"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function createWorkspace(workspaceName: string) {
  const user = await getCurrentUser();
  const userId = user?.id;

  if (!userId) {
    console.error("No user is currently logged in.");
    return { success: false, error: "User not authenticated" };
  }

  try {
    // Create a new workspace for the user
    const newWorkspace = await prisma.workspace.create({
      data: {
        name: workspaceName,
        users: {
          connect: { id: userId },
        },
      },
    });

    console.log(
      `Created workspace with ID: ${newWorkspace.id} for user ID: ${userId}.`,
    );
    revalidatePath("/dashboard"); // Updates the cache for the dashboard page

    return { success: true, workspace: newWorkspace };
  } catch (error) {
    console.error(`Error creating workspace for user ID: ${userId}`, error);
    return { success: false, error: error.message };
  }
}
