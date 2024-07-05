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


export {
    saveAPIKey
}