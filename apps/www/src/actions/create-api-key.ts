// actions/generate-api-key.js
"use server";

import { Unkey } from "@unkey/api";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function createApiKey(serviceName) {
  const user = await getCurrentUser();
  const userId = user?.id;

  if (!process.env.UNKEY_ROOT_KEY) {
    console.error("UNKEY_ROOT_KEY environment variable is not set.");
    return {
      success: false,
      error: "UNKEY_ROOT_KEY environment variable is not set."
    };
  }

  const unkey = new Unkey({ rootKey: process.env.UNKEY_ROOT_KEY });

  if (!userId) {
    console.error("No user is currently logged in.");
    return { success: false, error: "User not authenticated" };
  }

  const { result } = await unkey.keys.create({
    apiId: "api_3azqbDoLvTb4avtZHJf3SUqaXZSs",
    prefix: "prop",
    ownerId: userId,
    ratelimit: {
      type: "fast",
      limit: 10,
      duration: 60000, // Duration in milliseconds, e.g., 1 minute
      refillRate: 1,
      refillInterval: 1000
    },
    enabled: true
  });

  if (!result) {
    console.error("Error creating API key.");
    return { success: false, error: "Error creating API key." };
  }

  const apiKey = result.key;

  console.log(`Generated API key for user ID: ${userId}. API Key: ${apiKey}`);

  try {
    const newApiKey = await prisma.userApiKey.create({
      data: {
        userId,
        serviceName,
        secret: apiKey
      }
    });
    console.log(`API key saved successfully for user ID: ${userId}.`);

    revalidatePath("/settings/api");

    return {
      success: true,
      apiKey: newApiKey.secret
    };
  } catch (error) {
    console.error(`Error saving API key for user ID: ${userId}`, error);
    return { success: false, error: error.message };
  }
}
