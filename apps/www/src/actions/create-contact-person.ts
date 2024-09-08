"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

interface ContactPersonData {
  name: string;
  email: string;
  phone?: string;
}

export async function createContactPerson(
  tenantId: string,
  data: ContactPersonData,
  currentPath: string
) {
  const user = await getCurrentUser();
  const userId = user?.id;

  if (!userId) {
    console.error("No user is currently logged in.");
    return { success: false, error: "User not authenticated" };
  }

  try {
    const newContactPerson = await prisma.contactPerson.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        tenantId: tenantId
      }
    });

    revalidatePath(currentPath);

    console.log(
      `Created contact person with ID: ${newContactPerson.id} for tenant ID: ${tenantId}.`
    );

    revalidatePath("/tenant"); // Updates the cache for the tenant page

    return { success: true, contactPerson: newContactPerson };
  } catch (error) {
    console.error(
      `Error creating contact person for tenant ID: ${tenantId}`,
      error
    );
    return { success: false, error: error.message };
  }
}
