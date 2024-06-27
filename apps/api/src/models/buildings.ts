import { prisma } from "../lib/db";
import { Env } from "../env";
import { workspaceExtension } from "../lib/dbExtension";
import { BuildingData } from "./types";
import { User, Building } from "@prisma/client";


async function createBuilding(
    user: User,
    propertyId: string,
    buildingData: BuildingData,
    env: Env,
) {
    const db = prisma(env)
    try {
        const building = await db.building.create({
            data: {
                workspaceId: user.workspaceId!,
                propertyId: propertyId,
                ...buildingData
            }
        })
        return building
    } catch(error) {
        console.error(error);
        throw error;
    }
}


async function getAllWorkspaceBuildings(
    user: User,
    env: Env,
) {
    const _prisma = prisma(env)
    const db = _prisma.$extends(workspaceExtension(user))

    try {
        const buildings = await db.building.findMany()
        return buildings
    } catch(error) {
        console.error(error);
        throw error;
    }
}


async function getAllBuildingsByProperty(
    user: User,
    propertyId: string,
    env: Env,
) {
    const _prisma = prisma(env)
    const db = _prisma.$extends(workspaceExtension(user))

    try {
        const buildings = await db.building.findMany({
            where: {
                propertyId: propertyId,
            }
        })
        return buildings
    } catch(error) {
        console.error(error);
        throw error;
    }
}


async function getWorkspaceBuildingById(
    user: User,
    buildingId: string,
    env: Env,
) {
    const _prisma = prisma(env)
    const db = _prisma.$extends(workspaceExtension(user))

    try {
        const building = await db.building.findUnique({
            where: {
                id: buildingId,
            }
        })
        return building
    } catch(error) {
        console.error(error);
        throw error;
    }
}


async function editWorkspaceBuilding(
    user: User,
    buildingId: string,
    data: Partial<Building>,
    env: Env,
) {
    const _prisma = prisma(env)
    const db = _prisma.$extends(workspaceExtension(user))

    try {
        const building = await db.building.update({
            where: {
                id: buildingId,
            },
            data: data,
        })
        return building
    } catch(error) {
        console.error(error);
        throw error;
    }
}



export {
    createBuilding,
    getAllBuildingsByProperty,
    getWorkspaceBuildingById,
    editWorkspaceBuilding,
    getAllWorkspaceBuildings
}