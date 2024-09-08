"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function getDashboardData() {
  const user = await getCurrentUser();
  const userId = user?.id;

  if (!userId) {
    console.error("No user is currently logged in.");
    return { success: false, error: "User not authenticated" };
  }

  try {
    const workspace = await prisma.workspace.findFirst({
      where: { users: { some: { id: userId } } },
      include: {
        properties: {
          include: {
            buildings: {
              include: {
                floors: {
                  include: {
                    officeSpaces: true,
                  },
                },
                contracts: {
                  include: {
                    tenant: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!workspace) {
      throw new Error("No workspace found for this user");
    }

    const totalValue = workspace.properties.reduce((sum, property) => {
      // Calculate property value based on your business logic
      // This is a placeholder calculation
      return sum + property.buildings.length * 1000000;
    }, 0);

    const totalIncome = workspace.properties.reduce((sum, property) => {
      return (
        sum +
        property.buildings.reduce((buildingSum, building) => {
          return (
            buildingSum +
            building.contracts.reduce((contractSum, contract) => {
              return contractSum + (contract.baseRent || 0);
            }, 0)
          );
        }, 0)
      );
    }, 0);

    const totalUnits = workspace.properties.reduce((sum, property) => {
      return (
        sum +
        property.buildings.reduce((buildingSum, building) => {
          return (
            buildingSum +
            building.floors.reduce((floorSum, floor) => {
              return floorSum + floor.officeSpaces.length;
            }, 0)
          );
        }, 0)
      );
    }, 0);

    const rentedUnits = workspace.properties.reduce((sum, property) => {
      return (
        sum +
        property.buildings.reduce((buildingSum, building) => {
          return (
            buildingSum +
            building.floors.reduce((floorSum, floor) => {
              return (
                floorSum +
                floor.officeSpaces.filter((space) => space.isRented).length
              );
            }, 0)
          );
        }, 0)
      );
    }, 0);

    const expiringContracts = workspace.properties.reduce((sum, property) => {
      return (
        sum +
        property.buildings.reduce((buildingSum, building) => {
          const sixMonthsFromNow = new Date();
          sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
          return (
            buildingSum +
            building.contracts.filter(
              (contract) =>
                contract.endDate &&
                new Date(contract.endDate) <= sixMonthsFromNow,
            ).length
          );
        }, 0)
      );
    }, 0);

    return {
      success: true,
      data: {
        totalValue,
        totalIncome,
        totalUnits,
        rentedUnits,
        expiringContracts,
        properties: workspace.properties,
      },
    };
  } catch (error) {
    console.error(
      `Error fetching dashboard data for user ID: ${userId}`,
      error,
    );
    return { success: false, error: error.message };
  }
}
