import { prisma } from "../lib/db";
import { Env } from "../env";


const DEBUG: boolean = true; // NB! Change to false before committing.


async function createProperty(
    workspaceId: string,
    name: string,
    type: string,
    env: Env,
) {
    if (DEBUG) { console.debug("Middleware debug - creating property:", workspaceId, name, type) }
    const db = prisma(env)
    try {
        const property = await db.property.create({
            data: {
                workspaceId: workspaceId,
                type: type,
                name: name,
            }
        })
        return property
    } catch(error) {
        console.error(error);
        return null
    }
}


export {
    createProperty
}