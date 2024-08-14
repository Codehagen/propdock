import { User } from "@prisma/client"

import { Env } from "@/env" // Ensure you import Env
import { honoFactory } from "@/lib/hono"

const app = honoFactory()

/**
 * Developer Note:
 *
 * The flow to send an invoice using the Fiken API involves several steps to gather the necessary information.
 * Here is a step-by-step guide:
 *
 * 1. Get the User Company:
 *    Endpoint: /getcompanies
 *    Description: Retrieves the list of companies associated with the user.
 *
 * 2. Get User Contacts:
 *    Endpoint: /companies/:companySlug/contacts
 *    Description: Retrieves the list of contacts for a specific company. These contacts can be invoiced.
 *    - Requires the companySlug obtained from the first step.
 *
 * 3. Get User Products:
 *    Endpoint: /companies/:companySlug/products
 *    Description: Retrieves the list of products associated with the user's company. You will need the productId, net price, unit price, and VAT for the invoice.
 *    - Requires the companySlug obtained from the first step.
 *
 * 4. Create Invoice:
 *    Endpoint: /companies/:companySlug/invoices
 *    Description: Creates an invoice using the gathered information. Requires productId, customerId, and other invoice details.
 *    - Requires the companySlug obtained from the first step.
 *    - Requires customerId from the contacts obtained in the second step.
 *    - Requires productId and other product details from the third step.
 */

// Function to get request headers for Fiken API
function getFikenRequestHeaders(apiToken: string) {
  return {
    Authorization: `Bearer ${apiToken}`,
    "Content-Type": "application/json",
  }
}

// Endpoint to get all companies from Fiken API
app.get("/getcompanies", async (c) => {
  const user: User = c.get("user")!
  const env: Env = c.env as Env

  try {
    const apiToken = "6335334480.uj8eYFVeprVVhIuK0KrC9ZzoTsmaogHv" // Replace with your actual API token
    const headers = getFikenRequestHeaders(apiToken)
    const url = `https://api.fiken.no/api/v2/companies`

    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    })

    if (response.ok) {
      const companies = (await response.json()) as unknown as any[]
      return c.json(companies, 200)
    } else {
      console.error(`Error: ${response.statusText}`)
      return c.json(
        {
          message: `Failed to fetch companies`,
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

// Endpoint to get accounts for a company using a hardcoded slug
app.get("/companies/:companySlug/contacts", async (c) => {
  const user: User = c.get("user")!
  const env: Env = c.env as Env
  const companySlug = c.req.param("companySlug") || "fiken-demo-mulig-hytte-as2"

  try {
    const apiToken = "6335334480.uj8eYFVeprVVhIuK0KrC9ZzoTsmaogHv" // Replace with your actual API token
    const headers = getFikenRequestHeaders(apiToken)
    const url = `https://api.fiken.no/api/v2/companies/${companySlug}/contacts`

    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    })

    if (response.ok) {
      const contacts = (await response.json()) as unknown as any[]
      return c.json(contacts, 200)
    } else {
      console.error(`Error: ${response.statusText}`)
      return c.json(
        {
          message: `Failed to fetch contacts`,
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

// Endpoint to get products for a company using a hardcoded slug
app.get("/companies/:companySlug/products", async (c) => {
  const user: User = c.get("user")!
  const env: Env = c.env as Env
  const companySlug = c.req.param("companySlug") || "fiken-demo-mulig-hytte-as2"

  try {
    const apiToken = "6335334480.uj8eYFVeprVVhIuK0KrC9ZzoTsmaogHv" // Replace with your actual API token
    const headers = getFikenRequestHeaders(apiToken)
    const url = `https://api.fiken.no/api/v2/companies/${companySlug}/products`

    const response = await fetch(url, {
      method: "GET",
      headers: headers,
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

// Endpoint to get bank accounts for a company using a hardcoded slug
app.get("/companies/:companySlug/bankAccounts", async (c) => {
  const user: User = c.get("user")!
  const env: Env = c.env as Env
  const companySlug = c.req.param("companySlug") || "fiken-demo-mulig-hytte-as2"

  try {
    const apiToken = "6335334480.uj8eYFVeprVVhIuK0KrC9ZzoTsmaogHv" // Replace with your actual API token
    const headers = getFikenRequestHeaders(apiToken)
    const url = `https://api.fiken.no/api/v2/companies/${companySlug}/bankAccounts`

    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    })

    if (response.ok) {
      const bankAccounts = (await response.json()) as unknown as any[]
      return c.json(bankAccounts, 200)
    } else {
      console.error(`Error: ${response.statusText}`)
      return c.json(
        {
          message: `Failed to fetch bank accounts`,
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

// Endpoint to create an invoice for a company
app.post("/companies/:companySlug/invoices", async (c) => {
  const user: User = c.get("user")!
  const env: Env = c.env as Env
  const companySlug = c.req.param("companySlug") || "fiken-demo-mulig-hytte-as2"
  const invoiceData = await c.req.json()

  try {
    const apiToken = "6335334480.uj8eYFVeprVVhIuK0KrC9ZzoTsmaogHv" // Replace with your actual API token
    const headers = getFikenRequestHeaders(apiToken)
    const url = `https://api.fiken.no/api/v2/companies/${companySlug}/invoices`

    console.log("Sending request to Fiken API with data:", invoiceData)

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(invoiceData),
    })

    const responseBody = await response.text()

    if (response.ok) {
      const locationHeader = response.headers.get("location")
      return c.json(
        { message: "Invoice created successfully", location: locationHeader },
        201,
      )
    } else {
      console.error(`Error: ${response.statusText}`)
      return c.json(
        {
          message: `Failed to create invoice`,
          error: response.statusText,
          responseBody,
        },
        { status: response.status },
      )
    }
  } catch (error: any) {
    console.error(`Network error: ${error.message}`)
    return c.json({ error: `Network error: ${error.message}` }, 500)
  }
})

export const fiken = app
