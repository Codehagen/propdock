import type { PrismaClient } from "@prisma/client";

// Function to get API key from the database
async function getAPIKey(
  db: PrismaClient,
  workspaceId: string,
  serviceName: string
): Promise<string> {
  const apiKey = await db.wSApiKey.findFirst({
    where: {
      workspaceId: workspaceId,
      serviceName: serviceName,
      isActive: true
    },
    select: {
      secret: true
    }
  });

  if (!apiKey) {
    throw new Error(`API key for service "${serviceName}" not found`);
  }

  return apiKey.secret;
}

export { getAPIKey };
