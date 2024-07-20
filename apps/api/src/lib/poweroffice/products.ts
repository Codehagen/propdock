import { Env } from "@/env"
import { PO_ROOT } from "@/lib/poweroffice/auth"
import { superget } from "../poweroffice"


const PRODUCTS_URL = `${PO_ROOT}/Products`


async function getProducts(env: Env, workspaceId: string) {
    const url       = PRODUCTS_URL
    const response  = await superget(env, url, workspaceId)

    return response
}


async function getProduct(env: Env, workspaceId: string, customerId: string) {
    const url       = `${PRODUCTS_URL}/${customerId}`
    const response  = await superget(env, url, workspaceId)

    return response
}



export {
    getProducts,
    getProduct,
}