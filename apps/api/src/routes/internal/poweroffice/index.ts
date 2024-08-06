import { honoFactory } from "@/lib/hono"
import { getCustomers, getCustomer } from "@/lib/poweroffice/customers"
import { getProducts, getProduct } from "@/lib/poweroffice/products"
import { createInvoice } from "@/lib/poweroffice/invoice"


const app = honoFactory()


// Endpoint to get all customers
app.get("/customers", async (c) => {
  const user = c.get("user")

  if (!user) {
    return c.json({ ok: false, message: "x-user-id header is missing"}, 400)
  }

  try {
    const customerResponse = await getCustomers(c.env, user.workspaceId!)
    return c.json({ ok: true, message: customerResponse }, 200)
  
  } catch (error: any) {
    return c.json({ "ok": false, message: "Network error while fetching customers", "error": error.message }, 500 )
  }
})


// Endpoint to get a customer by ID
app.get("/customers/:id", async (c) => {
  const user = c.get("user")

  if (!user) {
    return c.json({ ok: false, message: "x-user-id header is missing"}, 400)
  }

  const id = c.req.param("id")

  try {
    const customerResponse = await getCustomer(c.env, user.workspaceId!, id)
    return c.json({ ok: true, message: customerResponse }, 200)
  
  } catch (error: any) {
    return c.json({ "ok": false, message: "Network error while fetching the customer", "error": error.message }, 500 )
  }
})

// Endpoint to get all products
app.get("/products", async (c) => {
  const user = c.get("user")

  if (!user) {
    return c.json({ ok: false, message: "x-user-id header is missing"}, 400)
  }

  try {
    const productResponse = await getProducts(c.env, user.workspaceId!)
    return c.json({ ok: true, message: productResponse }, 200)
  
  } catch (error: any) {
    return c.json({ "ok": false, message: "Network error while fetching products", "error": error.message }, 500 )
  }
})


// Endpoint to get a customer by ID
app.get("/products/:id", async (c) => {
  const user = c.get("user")

  if (!user) {
    return c.json({ ok: false, message: "x-user-id header is missing"}, 400)
  }

  const id = c.req.param("id")

  try {
    const productResponse = await getProduct(c.env, user.workspaceId!, id)
    return c.json({ ok: true, message: productResponse }, 200)
  
  } catch (error: any) {
    return c.json({ "ok": false, message: "Network error while fetching the product", "error": error.message }, 500 )
  }
})


// Endpoint to create a supplier invoice
app.post("/invoices/create", async (c) => {
  const user = c.get("user")

  if (!user) {
    return c.json({ ok: false, message: "x-user-id header is missing"}, 400)
  }

  const invoiceData = await c.req.json()

  try {
    const invoiceResponse = await createInvoice(c.env, user.workspaceId!, invoiceData)
    return c.json({ ok: true, message: invoiceResponse }, 200)
  
  } catch (error: any) {
    return c.json({ "ok": false, message: "Network error while creating the invoice", "error": error.message }, 500 )
  }
})

export const poweroffice = app
