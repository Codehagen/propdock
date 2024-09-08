"use server";

import { prisma } from "@/lib/db";

export async function getTenants(workspaceId: string) {
  try {
    const tenants = await prisma.tenant.findMany({
      where: {
        property: {
          workspaceId
        }
      },
      select: {
        id: true,
        name: true,
        orgnr: true,
        numEmployees: true,
        building: {
          select: {
            name: true
          }
        },
        floor: {
          select: {
            number: true
          }
        },
        officeSpace: {
          select: {
            name: true,
            isRented: true
          }
        },
        contracts: {
          select: {
            baseRent: true,
            startDate: true,
            endDate: true,
            contact: {
              select: {
                name: true,
                email: true,
                phone: true
              }
            }
          },
          orderBy: {
            startDate: "desc"
          },
          take: 1
        }
      },
      orderBy: {
        name: "asc"
      }
    });

    return {
      success: true,
      tenants: tenants.map(tenant => ({
        ...tenant,
        isRenting: tenant.officeSpace?.isRented ?? false,
        currentRent: tenant.contracts[0]?.baseRent ?? null,
        contractStartDate: tenant.contracts[0]?.startDate ?? null,
        contractEndDate: tenant.contracts[0]?.endDate ?? null,
        contactPerson: tenant.contracts[0]?.contact ?? null
      }))
    };
  } catch (error) {
    console.error("Error fetching tenants:", error);
    return { success: false, error: error.message };
  }
}
