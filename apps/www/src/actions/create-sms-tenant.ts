"use server"

import axios from "axios"

import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

export async function createSmsTenant(tenantId, message) {
  const user = await getCurrentUser()
  const userId = user?.id

  if (!userId) {
    console.error("No user is currently logged in.")
    return { success: false, error: "User not authenticated" }
  }

  try {
    // Fetch the current user's phone number
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { phone: true },
    })

    console.log("Current user:", currentUser)

    if (!currentUser?.phone) {
      throw new Error("Current user does not have a phone number")
    }

    const originator = `47${currentUser.phone}`

    // Fetch tenant details to get contact phone number
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        contacts: true,
      },
    })

    console.log("Tenant details:", tenant)

    if (!tenant || tenant.contacts.length === 0) {
      throw new Error("No contact person found for this tenant")
    }

    const contactPhone = `47${tenant.contacts[0]?.phone}`
    if (!contactPhone) {
      throw new Error("Contact person does not have a phone number")
    }

    const payload = {
      user: "sailsdock",
      password: "ch5433",
      simulate: 0,
      messages: [
        {
          originator: originator,
          msisdn: parseInt(contactPhone, 10),
          message: message,
          dlrurl: "dlrtest.php",
        },
      ],
    }

    console.log("Payload to be sent:", payload)

    const response = await axios.post(
      "https://api.eurobate.com/json_api.php",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    console.log("Response from SMS API:", response.data)

    if (response.data && response.data.error === 0) {
      console.log(`SMS sent to ${contactPhone}: ${message}`)
      return { success: true }
    } else {
      throw new Error(response.data.REASON || "Failed to send SMS")
    }
  } catch (error) {
    console.error("Error sending SMS:", error)
    return { success: false, error: error.message }
  }
}
