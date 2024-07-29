import { Env } from "@/env"
import { PO_ROOT } from "@/lib/poweroffice/auth"
import { superget, superpost } from "../poweroffice"


const INVOICE_URL = `${PO_ROOT}/JournalEntryVouchers/SupplierInvoices`


async function createInvoice(env: Env, workspaceId: string, invoiceData: any) {
    const url       = INVOICE_URL
    const response  = await superpost(env, url, workspaceId, invoiceData)

    return response
}


export {
    createInvoice,
}