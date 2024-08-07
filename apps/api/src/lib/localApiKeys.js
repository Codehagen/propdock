import { prisma } from "../lib/db";
async function getUserApiKeyFull(env, userId, serviceName) {
    const db = prisma(env);
    let apiKey;
    try {
        apiKey = await db.userApiKey.findFirst({
            where: {
                userId: userId,
                serviceName: serviceName,
            }
        });
    }
    catch (error) {
        console.log("Error fetching user API key:", error);
        return null;
    }
    return apiKey;
}
async function getUserApiKey(env, userId, serviceName) {
    const fullKey = await getUserApiKeyFull(env, userId, serviceName);
    let res = null;
    if (fullKey) {
        res = fullKey.secret;
    }
    return res;
}
async function getWSApiKeyFull(env, workspaceId, serviceName) {
    const db = prisma(env);
    let apiKey;
    try {
        apiKey = await db.wSApiKey.findFirst({
            where: {
                workspaceId: workspaceId,
                serviceName: serviceName,
            }
        });
    }
    catch (error) {
        console.log("Error fetching user API key:", error);
        return null;
    }
    return apiKey;
}
async function getWorkspaceApiKey(env, workspaceId, serviceName) {
    const fullKey = await getWSApiKeyFull(env, workspaceId, serviceName);
    let res = null;
    if (fullKey) {
        res = fullKey.secret;
    }
    return res;
}
async function storeWorkspaceAccessToken(db, workspaceId, serviceName, token, expiry) {
    const now = new Date();
    const expiryTime = (expiry * 1000) - 5000; // Shave 5 seconds off of the duration to compensate for roundtrip + db latency
    const saveTime = new Date(now.getTime() + expiryTime);
    try {
        await db.workspaceAccessToken.upsert({
            where: {
                workspaceId_serviceName: {
                    workspaceId: workspaceId,
                    serviceName: serviceName,
                }
            },
            update: {
                secret: token,
                validTo: saveTime,
            },
            create: {
                workspaceId: workspaceId,
                serviceName: serviceName,
                secret: token,
                validTo: saveTime,
            }
        });
    }
    catch (error) {
        console.log(`Error saving access token (${serviceName}:${workspaceId}):`, error);
    }
}
async function getWorkspaceAccessToken(db, workspaceId, serviceName) {
    let accessToken = await db.workspaceAccessToken.findFirst({
        where: {
            workspaceId: workspaceId,
            serviceName: serviceName,
        }
    });
    if (!accessToken) {
        console.debug("Returning null");
        return null;
    }
    const now = new Date();
    const adjustedTime = new Date(now.getTime() + 5000);
    if (accessToken.validTo > adjustedTime) {
        return accessToken;
    }
    return null;
}
export { getUserApiKey, getWorkspaceApiKey, getWorkspaceAccessToken, storeWorkspaceAccessToken, };
