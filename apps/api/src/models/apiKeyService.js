// Function to get API key from the database
async function getAPIKey(db, workspaceId, serviceName) {
    const apiKey = await db.wSApiKey.findFirst({
        where: {
            workspaceId: workspaceId,
            serviceName: serviceName,
            isActive: true,
        },
        select: {
            secret: true,
        },
    });
    if (!apiKey) {
        throw new Error(`API key for service "${serviceName}" not found`);
    }
    return apiKey.secret;
}
export { getAPIKey };
