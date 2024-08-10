async function saveAPIKey(db, workspaceId, key, serviceName) {
    await db.wSApiKey.create({
        data: {
            workspaceId: workspaceId,
            serviceName: serviceName,
            secret: key,
        },
    });
}
export { saveAPIKey };
