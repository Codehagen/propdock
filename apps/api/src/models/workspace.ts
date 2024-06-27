import { prisma } from "../lib/db";
import { Workspace } from "@prisma/client"



function saveAPIKey(workspaceId: string, key: string, serviceName: string): void {
    // TODO:
}

export {
    saveAPIKey
}