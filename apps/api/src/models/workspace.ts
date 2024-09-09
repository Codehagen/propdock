import type { PrismaClient } from "@dingify/db";

async function saveAPIKey(
  db: PrismaClient,
  workspaceId: string,
  key: string,
  serviceName: string,
): Promise<void> {
  await db.wSApiKey.create({
    data: {
      workspaceId: workspaceId,
      serviceName: serviceName,
      secret: key,
    },
  });
}

async function upsertAPIKey(
  db: PrismaClient,
  workspaceId: string,
  key: string,
  serviceName: string,
): Promise<void> {
  await db.wSApiKey.upsert({
    where: {
      workspaceId_serviceName: {
        workspaceId: workspaceId,
        serviceName: serviceName,
      },
    },
    update: {
      secret: key,
    },
    create: {
      workspaceId: workspaceId,
      serviceName: serviceName,
      secret: key,
    },
  });
}

async function saveAccessToken(
  db: PrismaClient,
  workspaceId: string,
  token: string,
  expiry: any,
  serviceName: string,
): Promise<void> {
  const validTo = new Date(Date.now() + (expiry - 10) * 1000);

  await db.workspaceAccessToken.create({
    data: {
      workspaceId: workspaceId,
      serviceName: serviceName,
      secret: token,
      validTo: validTo,
    },
  });
}

async function upsertAccessToken(
  db: PrismaClient,
  workspaceId: string,
  token: string,
  expiry: any,
  serviceName: string,
): Promise<void> {
  const validTo = new Date(Date.now() + (expiry - 10) * 1000);

  await db.workspaceAccessToken.upsert({
    where: {
      workspaceId_serviceName: {
        workspaceId: workspaceId,
        serviceName: serviceName,
      },
    },
    update: {
      secret: token,
      validTo: validTo,
    },
    create: {
      workspaceId: workspaceId,
      serviceName: serviceName,
      secret: token,
      validTo: validTo,
    },
  });
}

export { saveAPIKey, saveAccessToken, upsertAPIKey, upsertAccessToken };
