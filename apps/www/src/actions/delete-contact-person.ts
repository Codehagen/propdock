// actions/delete-contact-person.ts
"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";

export async function deleteContactPerson(contactPersonId, currentPath) {
  try {
    await prisma.contactPerson.delete({
      where: { id: contactPersonId }
    });

    revalidatePath(currentPath);

    return { success: true };
  } catch (error) {
    console.error("Error deleting contact person:", error);
    return { success: false, error: error.message };
  }
}
