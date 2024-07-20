import { Env } from "@/env" // Ensure you import Env
import { honoFactory } from "@/lib/hono"

const app = honoFactory()

let sessionToken: string | null = null

/**
 * Developer Note:
 *
 * This function creates a session token for the Tripletex API.
 *
 * Important points to consider:
 * - The consumerToken and employeeToken are necessary and should be valid.
 * - The expirationDate must be provided in the format YYYY-MM-DD.
 * - The request is made using a PUT method with the tokens and expiration date passed as a JSON body.
 * - The response should contain the session token which is used for subsequent API requests.
 */

// Endpoint to create a session token for Tripletex API
app.post("/create-session-token", async (c) => {
  const env: Env = c.env as Env

  const consumerToken =
    "eyJ0b2tlbklkIjozNTQ1LCJ0b2tlbiI6InRlc3QtNWY2MjE0YmEtZDc5Zi00YzgyLWJlYzktMGRkZDhiOWRiYjU1In0="
  const employeeToken =
    "eyJ0b2tlbklkIjo1NzQxLCJ0b2tlbiI6InRlc3QtZGNkN2JhYzktZjAxYi00OTc1LTlhNGYtZTcwNGM0OGQzMWQ2In0="

  const expirationDate = new Date()
  expirationDate.setDate(expirationDate.getDate() + 1) // Set expiration date to one day in the future
  const formattedExpirationDate = expirationDate.toISOString().split("T")[0] // Format date as YYYY-MM-DD

  const url = `https://api.tripletex.io/v2/token/session/:create?consumerToken=${consumerToken}&employeeToken=${employeeToken}&expirationDate=${formattedExpirationDate}`

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const responseText = await response.text()
    console.log("Response from session token endpoint:", responseText)

    if (response.ok) {
      const data = JSON.parse(responseText)
      sessionToken = data.value.token // Store the session token in the variable
      console.log("Session token created:", data)
      return c.json(data as any, 200)
    } else {
      console.error(`Error: ${response.statusText}, ${responseText}`)
      return c.json(
        {
          message: `Failed to create session token`,
          error: `${response.statusText}, ${responseText}`,
        },
        { status: response.status },
      )
    }
  } catch (error: any) {
    console.error(`Network error: ${error.message}`)
    return c.json({ error: `Network error: ${error.message}` }, 500)
  }
})

/**
 * Endpoint to get all customers from Tripletex API.
 *
 * This endpoint uses the stored session token.
 */
app.get("/customer", async (c) => {
  if (!sessionToken) {
    return c.json({ error: "Session token is not available" }, 500)
  }

  try {
    const headers = {
      Authorization: `Basic ${btoa(`0:${sessionToken}`)}`,
      "Content-Type": "application/json",
      "If-None-Match": "*", // Ensure we get the full response
    }
    const url = `https://api.tripletex.io/v2/customer`

    console.log("Fetching customers with URL:", url)
    console.log("Fetching customers with headers:", headers)

    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    })

    const customersResponseText = await response.text()
    console.log("Response from customers endpoint:", customersResponseText)

    if (response.ok) {
      const customers = JSON.parse(customersResponseText)
      return c.json(customers as any, 200)
    } else {
      console.error(`Error: ${response.statusText}, ${customersResponseText}`)
      return c.json(
        {
          message: `Failed to fetch customers`,
          error: `${response.statusText}, ${customersResponseText}`,
        },
        { status: response.status },
      )
    }
  } catch (error: any) {
    console.error(`Network error: ${error.message}`)
    return c.json({ error: `Network error: ${error.message}` }, 500)
  }
})

/**
 * Endpoint to get all products from Tripletex API.
 *
 * This endpoint uses the stored session token.
 */
app.get("/product", async (c) => {
  if (!sessionToken) {
    return c.json({ error: "Session token is not available" }, 500)
  }

  try {
    const headers = {
      Authorization: `Basic ${btoa(`0:${sessionToken}`)}`,
      "Content-Type": "application/json",
      "If-None-Match": "*", // Ensure we get the full response
    }
    const url = `https://api.tripletex.io/v2/product`

    console.log("Fetching products with URL:", url)
    console.log("Fetching products with headers:", headers)

    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    })

    const productsResponseText = await response.text()
    console.log("Response from products endpoint:", productsResponseText)

    if (response.ok) {
      const products = JSON.parse(productsResponseText)
      return c.json(products as any, 200)
    } else {
      console.error(`Error: ${response.statusText}, ${productsResponseText}`)
      return c.json(
        {
          message: `Failed to fetch products`,
          error: `${response.statusText}, ${productsResponseText}`,
        },
        { status: response.status },
      )
    }
  } catch (error: any) {
    console.error(`Network error: ${error.message}`)
    return c.json({ error: `Network error: ${error.message}` }, 500)
  }
})

/**
 * Endpoint to create an invoice in Tripletex API.
 *
 * This endpoint uses the stored session token.
 *
 * Developer Note:
 * To create an invoice, you need to gather product details such as id, priceExcludingVat, and priceIncludingVat from the /product endpoint.
 *
 * Example Payload for Testing:
 * {
 *   "invoiceDate": "2024-07-19",
 *   "invoiceDueDate": "2024-08-19",
 *   "comment": "Invoice for services rendered",
 *   "orders": [
 *     {
 *       "customer": {
 *         "id": 12345,
 *         "name": "Customer Name"
 *       },
 *       "orderDate": "2024-07-19",
 *       "deliveryDate": "2024-07-20",
 *       "orderLines": [
 *         {
 *           "product": {
 *             "id": 21691004
 *           },
 *           "description": "Testprodukt for API",
 *           "count": 1,
 *           "priceExcludingVat": 100,
 *           "priceIncludingVat": 125,
 *           "vatType": {
 *             "id": 3
 *           }
 *         }
 *       ]
 *     }
 *   ]
 * }
 */
app.post("/invoice", async (c) => {
  if (!sessionToken) {
    return c.json({ error: "Session token is not available" }, 500)
  }

  const invoiceData = await c.req.json()

  try {
    const headers = {
      Authorization: `Basic ${btoa(`0:${sessionToken}`)}`,
      "Content-Type": "application/json",
    }
    const url = `https://api.tripletex.io/v2/invoice`

    console.log("Creating invoice with URL:", url)
    console.log("Creating invoice with headers:", headers)
    console.log("Creating invoice with data:", JSON.stringify(invoiceData))

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(invoiceData),
    })

    const invoiceResponseText = await response.text()
    console.log("Response from invoice endpoint:", invoiceResponseText)

    if (response.ok) {
      const invoice = JSON.parse(invoiceResponseText)
      return c.json(invoice as any, 201)
    } else {
      console.error(`Error: ${response.statusText}, ${invoiceResponseText}`)
      return c.json(
        {
          message: `Failed to create invoice`,
          error: `${response.statusText}, ${invoiceResponseText}`,
        },
        { status: response.status },
      )
    }
  } catch (error: any) {
    console.error(`Network error: ${error.message}`)
    return c.json({ error: `Network error: ${error.message}` }, 500)
  }
})

export const tripletex = app
