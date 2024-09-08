import Fiken from "@/lib/fiken/class";
import { honoFactory } from "@/lib/hono";

const app = honoFactory();

/**
 * Helper-function for trivial response evaluations.
 * Only works with requests that return null instead of throwing exceptions, such as `getAsJSON()`.
 */
async function getDispatcher(res: any) {
  // : Promise<Record<string, Record<string, any> | number>>
  if (res) {
    return { object: { ok: true, data: res }, status: 200 };
  }
  return { object: { ok: false }, status: 500 };
}

// Instantiate Fiken SDK and add it in the request
app.use("*", async (c, next) => {
  const user = c.get("user")!;

  if (!user) {
    return c.json(
      { ok: false, error: "User was not found on the request" },
      400,
    );
  }

  c.set("sdk", new Fiken(c.env, user.workspaceId!));
  await next();
});

// Endpoint to get all companies
app.get("/companies", async (c) => {
  const fiken = c.get("sdk") as Fiken;

  const res = await fiken.getCompanies();
  const { object, status } = await getDispatcher(res);

  return c.json(object, { status });
});

// Endpoint to get accounts for a company
app.get("/companies/:companySlug/contacts", async (c) => {
  const fiken = c.get("sdk") as Fiken;

  const companySlug = c.req.param("companySlug");
  const res = await fiken.getCompanyContacts(companySlug);
  const { object, status } = await getDispatcher(res);

  return c.json(object, { status });
});

// Endpoint to get products for a company
app.get("/companies/:companySlug/products", async (c) => {
  const fiken = c.get("sdk") as Fiken;

  const companySlug = c.req.param("companySlug");
  const res = await fiken.getProducts(companySlug);
  const { object, status } = await getDispatcher(res);

  return c.json(object, { status });
});

// Endpoint to get bank accounts for a company
app.get("/companies/:companySlug/bankAccounts", async (c) => {
  const fiken = c.get("sdk") as Fiken;

  const companySlug = c.req.param("companySlug");
  const res = await fiken.getBankAccounts(companySlug);
  const { object, status } = await getDispatcher(res);

  return c.json(object, { status });
});

// Endpoint to create an invoice for a company
app.post("/companies/:companySlug/invoices", async (c) => {
  const fiken = c.get("sdk") as Fiken;

  const companySlug = c.req.param("companySlug");
  const invoiceData = await c.req.json();

  const res = await fiken.postInvoice(companySlug, invoiceData);
  const locationHeader = res.headers.get("location");

  return c.json({ ok: true, message: locationHeader }, 201);
});

export const fiken = app;
