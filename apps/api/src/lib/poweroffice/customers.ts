import { Env } from "@/env"
import { PO_ROOT } from "@/lib/poweroffice/auth"
import { superget } from "../poweroffice"


const CUSTOMERS_URL = `${PO_ROOT}/Customers`


async function getCustomers(env: Env, workspaceId: string) {
    const url       = CUSTOMERS_URL
    const response  = await superget(env, url, workspaceId)

    return response
}


async function getCustomer(env: Env, workspaceId: string, customerId: string) {
    const url       = `${CUSTOMERS_URL}/${customerId}`
    const response  = await superget(env, url, workspaceId)

    return response
}



export {
    getCustomers,
    getCustomer,
}