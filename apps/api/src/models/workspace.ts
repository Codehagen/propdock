import { PrismaClient } from "@dingify/db";


async function saveAPIKey(db: PrismaClient, workspaceId: string, key: string, serviceName: string): Promise<void> {
    await db.wSApiKey.create({
        data: {
            workspaceId: workspaceId,
            serviceName: serviceName,
            secret: key,
        },
    });
}


async function saveAccessToken(db: PrismaClient, workspaceId: string, token: string, expiry: any, serviceName: string): Promise<void> {
    const validTo = new Date(Date.now() + (expiry - 10) * 1000); // Is expiry given in seconds or ms? Currently assuming seconds, and converting to ms

    await db.workspaceAccessToken.create({
        data: {
            workspaceId: workspaceId,
            serviceName: serviceName,
            secret: token,
            validTo: validTo,
        },
    });
}

export {
    saveAPIKey,
    saveAccessToken
}