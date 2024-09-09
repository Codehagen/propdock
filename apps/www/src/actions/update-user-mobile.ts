"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { userMobileSchema } from "@/lib/validations/user";

export interface FormData {
  phone: string;
}

export async function updateUserMobile(userId: string, data: FormData) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.id !== userId) {
      throw new Error("Unauthorized");
    }

    const { phone } = userMobileSchema.parse(data); // Use the new schema

    // Update the user mobile number.
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        phone: phone,
      },
    });

    revalidatePath("/dashboard/settings");
    return { status: "success" };
  } catch (error) {
    console.log(error);
    return { status: "error" };
  }
}
