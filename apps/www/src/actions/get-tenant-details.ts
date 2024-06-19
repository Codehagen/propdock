import { prisma } from "@/lib/db";

export async function getTenantDetails(tenantId: number) {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        building: true,
        floor: true,
        officeSpace: true,
      },
    });

    return tenant;
  } catch (error) {
    console.error("Error fetching tenant details:", error);
    return null;
  }
}
