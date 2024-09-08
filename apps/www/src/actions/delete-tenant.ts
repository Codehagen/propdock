"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function deleteTenant(tenantId: string) {
  const user = await getCurrentUser();
  const userId = user?.id;

  if (!userId) {
    console.error("No user is currently logged in.");
    return { success: false, error: "User not authenticated" };
  }

  try {
    // Check if the tenant exists
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: { property: true }
    });

    if (!tenant) {
      throw new Error("Tenant not found");
    }

    // Check if the user has permission to delete this tenant
    const userWorkspace = await prisma.workspace.findFirst({
      where: { users: { some: { id: userId } } },
      include: { properties: true }
    });

    if (
      !userWorkspace ||
      !userWorkspace.properties.some(p => p.id === tenant.propertyId)
    ) {
      throw new Error("You don't have permission to delete this tenant");
    }

    // Delete related records first
    await prisma.$transaction([
      // Delete contracts first
      prisma.contract.deleteMany({ where: { tenantId } }),
      // Then delete other related records
      prisma.customerInvoice.deleteMany({ where: { tenantId } }),
      prisma.tenantCommunications.deleteMany({ where: { tenantId } }),
      prisma.contactPerson.deleteMany({ where: { tenantId } }),
      // Finally, delete the tenant
      prisma.tenant.delete({ where: { id: tenantId } })
    ]);

    console.log(`Deleted tenant with ID: ${tenantId}`);

    revalidatePath("/tenant");

    return { success: true };
  } catch (error) {
    console.error(`Error deleting tenant with ID: ${tenantId}`, error);
    return { success: false, error: error.message };
  }
}
