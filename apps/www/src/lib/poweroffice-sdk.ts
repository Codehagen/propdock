import type { AxiosInstance } from "axios"
import axios from "axios"

import { getCurrentUser } from "./session"

class PowerOfficeSDK {
  private api: AxiosInstance

  constructor(baseURL: string, apiKey: string) {
    this.api = axios.create({
      baseURL,
    })

    this.api.interceptors.request.use(async (config) => {
      const user = await getCurrentUser()
      config.headers["x-fe-key"] = apiKey
      if (user?.id) {
        config.headers["x-user-id"] = user.id
      }
      return config
    })
  }

  async getCustomers() {
    const response = await this.api.get("/api/internal/poweroffice/customers")
    return response.data
  }

  async getCustomer(id: string) {
    const response = await this.api.get(
      `/api/internal/poweroffice/customers/${id}`,
    )
    return response.data
  }

  async getProducts() {
    const response = await this.api.get("/api/internal/poweroffice/products")
    return response.data
  }

  async getProduct(id: string) {
    const response = await this.api.get(
      `/api/internal/poweroffice/products/${id}`,
    )
    return response.data
  }

  async createInvoice(invoiceData: any) {
    const response = await this.api.post(
      "/api/internal/poweroffice/invoices/create",
      invoiceData,
    )
    return response.data
  }
}

const apiUrl =
  process.env.NODE_ENV === "production"
    ? "https://api.propdock.workers.dev"
    : "https://api.propdock.workers.dev"

//     const apiUrl =
//   process.env.NODE_ENV === "production"
//     ? "https://api.propdock.workers.dev"
//     : "http://localhost:8787"

const apiKey = process.env.NEXT_PUBLIC_API_KEY || "super-secret"

export const poweroffice = new PowerOfficeSDK(apiUrl, apiKey)
