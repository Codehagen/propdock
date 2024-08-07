import { PO_ROOT } from "@/lib/poweroffice/auth";
import { superget } from "../poweroffice";
const CUSTOMERS_URL = `${PO_ROOT}/Customers`;
async function getCustomers(env, workspaceId) {
    const url = CUSTOMERS_URL;
    const response = await superget(env, url, workspaceId);
    return response;
}
async function getCustomer(env, workspaceId, customerId) {
    const url = `${CUSTOMERS_URL}/${customerId}`;
    const response = await superget(env, url, workspaceId);
    return response;
}
export { getCustomers, getCustomer, };
