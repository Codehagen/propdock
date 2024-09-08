// actions/assign-tenant.js
"use server";

import { prisma } from "@/lib/db";

export async function assignTenantToOfficeSpace(officeSpaceId, tenantId) {
  try {
    const officeSpace = await prisma.officeSpace.update({
      where: { id: officeSpaceId },
      data: { tenants: { connect: { id: tenantId } } },
    });

    return { success: true, officeSpace };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
