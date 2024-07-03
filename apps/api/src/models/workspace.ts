import { prisma } from "../lib/db";
import { Workspace } from "@prisma/client"



async function saveAPIKey(workspaceId: string, key: string, serviceName: string): Promise<void> {
    // TODO:
}

export {
    saveAPIKey
}