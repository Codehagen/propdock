import { Env } from "@/env";
import IntegrationSuperfetch from "../fetch/superfetch";
import { getRequestHeaders, FI_ROOT } from "./auth";

export default class Fiken {
    fetch: IntegrationSuperfetch

    constructor(env: Env, workspaceId: string) {
        this.fetch = new IntegrationSuperfetch(FI_ROOT, () => getRequestHeaders(env, workspaceId))
    }

    async getCompanies() {
        return await this.fetch.getAsJSON('/companies')
    }

    async getCompanyContacts(slug: string) {
        return await this.fetch.getAsJSON(`/companies/${slug}/contacts`)
    }

    async getProducts(slug: string) {
        return await this.fetch.getAsJSON(`/companies/${slug}/products`)
    }

    async getBankAccounts(slug: string) {
        return await this.fetch.getAsJSON(`/companies/${slug}/bankAccounts`)
    }

    async postInvoice(slug: string, invoiceData: any) {
        const url = `/companies/${slug}/invoices`
        return
    }
}