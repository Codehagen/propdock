// actions/Dingify/get-property-details.ts
import { prisma } from "@/lib/db";

export async function getPropertyDetails(propertyId: string) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        buildings: true,
        tenants: true,
        contracts: true,
      },
    });

    return property;
  } catch (error) {
    console.error("Error fetching property details:", error);
    return null;
  }
}
