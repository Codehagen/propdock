import { getAPIKey } from "@/models/apiKeyService"
import { User } from "@prisma/client"

import { Env } from "@/env" // Ensure you import Env
import { prisma } from "@/lib/db" // Ensure prisma is correctly imported
import { honoFactory } from "@/lib/hono"

const app = honoFactory()

// Helper function to validate workspaceId
function validateWorkspaceId(workspaceId: string | null): string {
  if (!workspaceId) {
    throw new Error("Workspace ID is required")
  }
  return workspaceId
}

// Endpoint to get all customers
app.get("/getcustomer", async (c) => {
  const user: User = c.get("user")!
  const env: Env = c.env as Env

  try {
    const workspaceId = validateWorkspaceId(user.workspaceId)
    const apiKey = await getAPIKey(prisma(env), workspaceId, "poweroffice")
    const url = `https://goapi.poweroffice.net/demo/v2/Customers`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`, // Use the fetched API key
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      const customers = (await response.json()) as unknown as any[]
      return c.json(customers, 200)
    } else {
      console.error(`Error: ${response.statusText}`)
      return c.json(
        {
          message: `Failed to fetch customers`,
          error: response.statusText,
        },
        { status: response.status },
      )
    }
  } catch (error: any) {
    console.error(`Network error: ${error.message}`)
    return c.json({ error: `Network error: ${error.message}` }, 500)
  }
})

// Endpoint to get a customer by ID
app.get("/getcustomer/:id", async (c) => {
  const user: User = c.get("user")!
  const env: Env = c.env as Env
  const id = c.req.param("id")

  try {
    const workspaceId = validateWorkspaceId(user.workspaceId)
    const apiKey = await getAPIKey(prisma(env), workspaceId, "poweroffice")
    const url = `https://goapi.poweroffice.net/demo/v2/Customers/${id}`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      const customer = (await response.json()) as unknown as any
      return c.json(customer, 200)
    } else {
      console.error(`Error: ${response.statusText}`)
      return c.json(
        {
          message: `Failed to fetch customer`,
          error: response.statusText,
        },
        { status: response.status },
      )
    }
  } catch (error: any) {
    console.error(`Network error: ${error.message}`)
    return c.json({ error: `Network error: ${error.message}` }, 500)
  }
})

// Endpoint to get all products
app.get("/getproduct", async (c) => {
  const user: User = c.get("user")!
  const env: Env = c.env as Env

  try {
    const workspaceId = validateWorkspaceId(user.workspaceId)
    const apiKey = await getAPIKey(prisma(env), workspaceId, "poweroffice")
    const url = `https://goapi.poweroffice.net/demo/v2/Products`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      const products = (await response.json()) as unknown as any[]
      return c.json(products, 200)
    } else {
      console.error(`Error: ${response.statusText}`)
      return c.json(
        {
          message: `Failed to fetch products`,
          error: response.statusText,
        },
        { status: response.status },
      )
    }
  } catch (error: any) {
    console.error(`Network error: ${error.message}`)
    return c.json({ error: `Network error: ${error.message}` }, 500)
  }
})

// Endpoint to get a product by ID
app.get("/getproduct/:id", async (c) => {
  const user: User = c.get("user")!
  const env: Env = c.env as Env
  const id = c.req.param("id")

  try {
    const workspaceId = validateWorkspaceId(user.workspaceId)
    const apiKey = await getAPIKey(prisma(env), workspaceId, "poweroffice")
    const url = `https://goapi.poweroffice.net/demo/v2/Products/${id}`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      const product = (await response.json()) as unknown as any
      return c.json(product, 200)
    } else {
      console.error(`Error: ${response.statusText}`)
      return c.json(
        {
          message: `Failed to fetch product`,
          error: response.statusText,
        },
        { status: response.status },
      )
    }
  } catch (error: any) {
    console.error(`Network error: ${error.message}`)
    return c.json({ error: `Network error: ${error.message}` }, 500)
  }
})

// Endpoint to create a supplier invoice
app.post("/createinvoice", async (c) => {
  const user: User = c.get("user")!
  const env: Env = c.env as Env // Cast to Env type
  const invoiceData = await c.req.json()

  try {
    const workspaceId = validateWorkspaceId(user.workspaceId)
    const apiKey = await getAPIKey(prisma(env), workspaceId, "poweroffice")
    const url = `https://goapi.poweroffice.net/demo/v2/JournalEntryVouchers/SupplierInvoices`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`, // Use the fetched API key
        "Content-Type": "application/json-patch+json",
      },
      body: JSON.stringify(invoiceData),
    })

    if (response.ok) {
      const createdInvoice = (await response.json()) as unknown as any
      return c.json(createdInvoice, 201)
    } else {
      console.error(`Error: ${response.statusText}`)
      return c.json(
        {
          message: `Failed to create supplier invoice`,
          error: response.statusText,
        },
        { status: response.status },
      )
    }
  } catch (error: any) {
    console.error(`Network error: ${error.message}`)
    return c.json({ error: `Network error: ${error.message}` }, 500)
  }
})

export const poweroffice = app
