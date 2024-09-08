"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function updateTenant(
  tenantId: string,
  tenantData: {
    name: string;
    orgnr?: number | null;
    numEmployees: number;
    buildingId: string;
    floorId?: string | null;
    officeSpaceId?: string | null;
    propertyId: string;
  }
) {
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

    // Check if the user has permission to update this tenant
    const userWorkspace = await prisma.workspace.findFirst({
      where: { users: { some: { id: userId } } },
      include: { properties: true }
    });

    if (
      !userWorkspace ||
      !userWorkspace.properties.some(p => p.id === tenant.propertyId)
    ) {
      throw new Error("You don't have permission to update this tenant");
    }

    // Update the tenant
    const updatedTenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        name: tenantData.name,
        orgnr: tenantData.orgnr,
        numEmployees: tenantData.numEmployees,
        buildingId: tenantData.buildingId,
        floorId: tenantData.floorId,
        officeSpaceId: tenantData.officeSpaceId,
        propertyId: tenantData.propertyId
      }
    });

    console.log(`Updated tenant with ID: ${tenantId}`);

    revalidatePath("/tenant");

    return { success: true, tenant: updatedTenant };
  } catch (error) {
    console.error(`Error updating tenant with ID: ${tenantId}`, error);
    return { success: false, error: error.message };
  }
}
