import type { AxiosInstance } from "axios";
import axios from "axios";

import { getCurrentUser } from "./session";

class PowerOfficeSDK {
  private api: AxiosInstance;

  constructor(baseURL: string, apiKey: string) {
    this.api = axios.create({
      baseURL,
    });

    this.api.interceptors.request.use(async (config) => {
      const user = await getCurrentUser();
      config.headers["x-fe-key"] = apiKey;
      if (user?.id) {
        config.headers["x-user-id"] = user.id;
      }
      return config;
    });
  }

  async getCustomers() {
    const response = await this.api.get("/api/internal/poweroffice/customers");
    console.log("Received response:", response.data);
    return response.data;
  }

  async getCustomer(id: string) {
    const response = await this.api.get(
      `/api/internal/poweroffice/customers/${id}`,
    );
    return response.data;
  }

  async getProducts() {
    const response = await this.api.get("/api/internal/poweroffice/products");
    return response.data;
  }

  async getProduct(id: string) {
    const response = await this.api.get(
      `/api/internal/poweroffice/products/${id}`,
    );
    return response.data;
  }

  async createInvoice(invoiceData: any) {
    const response = await this.api.post(
      "/api/internal/poweroffice/invoices/create",
      invoiceData,
    );
    return response.data;
  }

  async getCustomersAndProducts() {
    const [customersResponse, productsResponse] = await Promise.all([
      this.api.get("/api/internal/poweroffice/customers"),
      this.api.get("/api/internal/poweroffice/products"),
    ]);
    return {
      customers: customersResponse.data,
      products: productsResponse.data,
    };
  }
}

const apiUrl =
  process.env.NODE_ENV === "production"
    ? "https://api.vegard.workers.dev"
    : "https://api.vegard.workers.dev";

const apiKey = process.env.NEXT_PUBLIC_API_KEY || "super-secret";

export const poweroffice = new PowerOfficeSDK(apiUrl, apiKey);

// Developer Note: How to fetch data using PowerOffice SDK
/*
  To fetch data using the PowerOffice SDK, you can use the following methods:

  // Fetch all customers
  const customers = await poweroffice.getCustomers()
  console.log(customers)

  // Fetch a specific customer by ID
  const customer = await poweroffice.getCustomer("17763838")
  console.log(customer)

  // Fetch all products
  const products = await poweroffice.getProducts()
  console.log(products)

  // Fetch a specific product by ID
  const product = await poweroffice.getProduct("20681528")
  console.log(product)

  // Create an invoice
  const invoiceData = {
    CurrencyCode: "NOK",
    CustomerId: 17763838,
    SalesOrderLines: [
      {
        Description: "SDK",
        ProductId: 20681521,
      },
    ],
  }
  const invoice = await poweroffice.createInvoice(invoiceData)
  console.log(invoice)

  Note: Make sure to import the PowerOffice SDK and initialize it properly before using these methods.
  Also, remember to handle potential errors and implement proper error handling in production code.
*/
