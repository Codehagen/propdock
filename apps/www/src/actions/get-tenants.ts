// actions/get-tenants.ts
import { prisma } from "@/lib/db";

export async function getTenants(workspaceId: number) {
  try {
    const tenants = await prisma.tenant.findMany({
      where: {
        property: {
          workspaceId,
        },
      },
      select: {
        id: true,
        name: true,
        orgnr: true,
        numEmployees: true,
        building: {
          select: {
            name: true,
          },
        },
        floor: {
          select: {
            number: true,
          },
        },
        officeSpace: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return { success: true, tenants };
  } catch (error) {
    console.error("Error fetching tenants:", error);
    return { success: false, error: error.message };
  }
}
