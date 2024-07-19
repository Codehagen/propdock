import { User } from "@prisma/client"

import { Env } from "@/env"
import { honoFactory } from "@/lib/hono"
import { getWorkspaceApiKey } from "@/lib/localApiKeys"
import { getRequestHeaders } from "@/lib/poweroffice"

const app = honoFactory()

// Endpoint to get all customers
app.get("/getcustomer", async (c) => {
  const user: User = c.get("user")!
  const env: Env = c.env as Env
  const poHeaders = await getRequestHeaders(c.env, user.workspaceId!)

  console.log("User object:", user)
  console.log("Environment object:", env)

  try {
    console.log("Fetching API key for workspace ID:", user.workspaceId)
    const apiKey = await getWorkspaceApiKey(
      env,
      user.workspaceId!,
      "poweroffice",
    )
    console.log("API Key fetched:", apiKey)

    const url = `https://goapi.poweroffice.net/demo/v2/Customers`

    const response = await fetch(url, {
      method: "GET",
      headers: poHeaders,
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
  const poHeaders = await getRequestHeaders(c.env, user.workspaceId!)
  const id = c.req.param("id")

  try {
    const apiKey = await getWorkspaceApiKey(
      env,
      user.workspaceId!,
      "poweroffice",
    )
    const url = `https://goapi.poweroffice.net/demo/v2/Customers/${id}`

    const response = await fetch(url, {
      method: "GET",
      headers: poHeaders,
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
  const poHeaders = await getRequestHeaders(c.env, user.workspaceId!)

  try {
    const apiKey = await getWorkspaceApiKey(
      env,
      user.workspaceId!,
      "poweroffice",
    )
    const url = `https://goapi.poweroffice.net/demo/v2/Products`

    const response = await fetch(url, {
      method: "GET",
      headers: poHeaders,
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
  const poHeaders = await getRequestHeaders(c.env, user.workspaceId!)
  const id = c.req.param("id")

  try {
    const apiKey = await getWorkspaceApiKey(
      env,
      user.workspaceId!,
      "poweroffice",
    )
    const url = `https://goapi.poweroffice.net/demo/v2/Products/${id}`

    const response = await fetch(url, {
      method: "GET",
      headers: poHeaders,
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
  const env: Env = c.env as Env
  const invoiceData = await c.req.json()

  try {
    console.log("Fetching API key for workspace ID:", user.workspaceId)
    const poHeaders = await getRequestHeaders(c.env, user.workspaceId!)
    console.log("Headers fetched:", poHeaders)

    const url = `https://goapi.poweroffice.net/demo/v2/JournalEntryVouchers/SupplierInvoices`

    const response = await fetch(url, {
      method: "POST",
      headers: poHeaders,
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
