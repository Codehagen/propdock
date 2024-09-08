import type { Env } from "@/env";
import { superpost } from "../poweroffice";

const INVOICE_URL =
  "https://goapi.poweroffice.net/Demo/v2/SalesOrders/Complete";

async function createSalesOrder(
  env: Env,
  workspaceId: string,
  invoiceData: Record<string, any>
) {
  const url = INVOICE_URL;
  const data = {
    ...invoiceData,
    SalesOrderStatus: "Draft"
  };

  const response = await superpost(env, url, workspaceId, data);

  return response;
}

export { createSalesOrder };
