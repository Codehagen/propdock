import { prisma } from "../lib/db";
import { workspaceExtension } from "../lib/dbExtension";
async function createBuilding(user, propertyId, buildingData, env) {
    const db = prisma(env);
    try {
        const building = await db.building.create({
            data: {
                workspaceId: user.workspaceId,
                propertyId: propertyId,
                ...buildingData
            }
        });
        return building;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
async function getAllWorkspaceBuildings(user, env) {
    const _prisma = prisma(env);
    const db = _prisma.$extends(workspaceExtension(user));
    try {
        const buildings = await db.building.findMany();
        return buildings;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
async function getAllBuildingsByProperty(user, propertyId, env) {
    const _prisma = prisma(env);
    const db = _prisma.$extends(workspaceExtension(user));
    try {
        const buildings = await db.building.findMany({
            where: {
                propertyId: propertyId,
            }
        });
        return buildings;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
async function getWorkspaceBuildingById(user, buildingId, env) {
    const _prisma = prisma(env);
    const db = _prisma.$extends(workspaceExtension(user));
    try {
        const building = await db.building.findUnique({
            where: {
                id: buildingId,
            }
        });
        return building;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
async function editWorkspaceBuilding(user, buildingId, data, env) {
    const _prisma = prisma(env);
    const db = _prisma.$extends(workspaceExtension(user));
    try {
        const building = await db.building.update({
            where: {
                id: buildingId,
            },
            data: data,
        });
        return building;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
export { createBuilding, getAllBuildingsByProperty, getWorkspaceBuildingById, editWorkspaceBuilding, getAllWorkspaceBuildings };
