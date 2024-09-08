"use server";

import { poweroffice } from "@/lib/poweroffice-sdk";

export async function createInvoice(invoiceData: any) {
  console.log("invoiceData", invoiceData);
  try {
    const invoice = await poweroffice.createInvoice(invoiceData);
    return { success: true, data: invoice };
  } catch (error) {
    console.error("Error creating invoice:", error);
    return { success: false, error: error.message };
  }
}
