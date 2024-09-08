// src/actions/get-properties.ts
"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function getProperties() {
  const user = await getCurrentUser();
  const userId = user?.id;

  if (!userId) {
    console.error("No user is currently logged in.");
    return [];
  }

  try {
    // Fetch the workspace associated with the user
    const userWorkspace = await prisma.workspace.findFirst({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!userWorkspace) {
      console.error("No workspace found for this user.");
      return [];
    }

    const properties = await prisma.property.findMany({
      where: {
        workspaceId: userWorkspace.id,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return properties;
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
}
