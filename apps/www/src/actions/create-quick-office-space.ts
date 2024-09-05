"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/db"

export async function quickAddOfficeSpace(
  floorId: string,
  officeData: {
    name: string
    sizeKvm: number
    exclusiveAreaKvm: number
    commonAreaKvm: number
    isRented: boolean
  },
  currentPath: string,
) {
  try {
    const newOffice = await prisma.officeSpace.create({
      data: {
        ...officeData,
        floorId: floorId,
      },
    })

    revalidatePath(currentPath)

    return { success: true, office: newOffice }
  } catch (error) {
    console.error("Error quick adding office space:", error)
    return { success: false, error: error.message }
  }
}

export async function quickDeleteOfficeSpace(
  officeId: number,
  currentPath: string,
) {
  try {
    await prisma.officeSpace.delete({
      where: {
        id: officeId,
      },
    })

    revalidatePath(currentPath)

    return { success: true }
  } catch (error) {
    console.error("Error quick deleting office space:", error)
    return { success: false, error: error.message }
  }
}
