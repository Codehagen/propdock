import { prisma } from "../lib/db";
import { workspaceExtension } from "../lib/dbExtension";
const DEBUG = false; // NB! Change to false before committing.
async function createProperty(user, name, type, env) {
    const db = prisma(env);
    try {
        const property = await db.property.create({
            data: {
                workspaceId: user.workspaceId,
                type: type,
                name: name,
            }
        });
        return property;
    }
    catch (error) {
        throw error;
    }
}
async function getAllWorkspaceProperties(user, env) {
    const _prisma = prisma(env);
    const db = _prisma.$extends(workspaceExtension(user));
    try {
        const properties = await db.property.findMany({});
        return properties;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
async function getWorkspacePropertyById(user, propertyId, env) {
    const _prisma = prisma(env);
    const db = _prisma.$extends(workspaceExtension(user));
    try {
        const property = await db.property.findUnique({
            where: {
                id: propertyId,
            }
        });
        return property;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
async function editWorkspaceProperty(user, propertyId, data, env) {
    const _prisma = prisma(env);
    const db = _prisma.$extends(workspaceExtension(user));
    try {
        const property = await db.property.update({
            where: {
                id: propertyId,
            },
            data: data,
        });
        return property;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
export { createProperty, getAllWorkspaceProperties, getWorkspacePropertyById, editWorkspaceProperty };
