import { superpost } from "../poweroffice";
const INVOICE_URL = `https://goapi.poweroffice.net/Demo/v2/SalesOrders/Complete`;
// poCustomerId should maybe be a field on Tenant? 
// Either as extCustomerId to be compatible with all integrations, or as a separate through-model (TenantPowerOfficeCustomer)
async function createSalesOrder(env, workspaceId, poCustomerId, productId, departmentId, projectId) {
    // POST https://goapi.poweroffice.net/v2/SalesOrders/Complete
    const url = INVOICE_URL;
    const currencyCode = "NOK";
    const invoiceData = {
        "CurrencyCode": currencyCode,
        "CustomerId": poCustomerId,
        "SalesOrderLines": [{
                "Description": "Faktura sendt via Propdock",
                "ProductId": productId,
            }],
        "SalesOrderStatus": "Draft",
    };
    const response = await superpost(env, url, workspaceId, invoiceData);
    return response;
}
export { createSalesOrder, };