import { prisma } from "../lib/db";
import { Env } from "../env";
import { BuildingData } from "./types";


const DEBUG: boolean = true; // NB! Change to false before committing.


async function createBuilding(
    workspaceId: string,
    propertyId: string,
    buildingData: BuildingData,
    env: Env,
) {
    if (DEBUG) { console.debug("Middleware debug - creating building:", workspaceId, propertyId) }
    const db = prisma(env)
    try {
        const building = await db.building.create({
            data: {
                workspaceId: workspaceId,
                propertyId: propertyId,
                ...buildingData
            }
        })
        return building
    } catch(error) {
        console.error(error);
        return null
    }
}


export {
    createBuilding
}