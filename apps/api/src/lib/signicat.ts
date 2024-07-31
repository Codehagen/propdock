import axios, { AxiosInstance } from "axios"

interface DocumentData {
  title: string
  description: string
  externalId: string
  dataToSign: {
    base64Content: string
    fileName: string
  }
  contactDetails: {
    email: string
  }
  signers: Array<{
    externalSignerId: string
    redirectSettings: {
      redirectMode: string
    }
    signatureType: {
      mechanism: string
    }
    signerInfo: {
      firstName: string
      lastName: string
      email: string
      mobile: {
        countryCode: string
        number: string
      }
    }
  }>
}

interface AttachmentData {
  fileName: string
  title: string
  data: string
  convertToPdf: boolean
  signers: string[]
  description?: string
  type?: string
}

export class ESigningClient {
  private clientId: string
  private clientSecret: string
  private accessToken: string | null = null
  private tokenExpiration: number = 0
  private axiosInstance: AxiosInstance

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.axiosInstance = axios.create({
      baseURL: "https://api.signicat.com/express",
    })
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiration) {
      return this.accessToken
    }

    const tokenEndpoint = "https://api.signicat.io/oauth/connect/token"
    const auth = btoa(
      encodeURIComponent(this.clientId) +
        ":" +
        encodeURIComponent(this.clientSecret),
    )

    try {
      const response = await this.axiosInstance.post(
        tokenEndpoint,
        "grant_type=client_credentials&scope=document_read document_write",
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${auth}`,
          },
        },
      )

      this.accessToken = response.data.access_token
      this.tokenExpiration = Date.now() + response.data.expires_in * 1000
      return this.accessToken as string
    } catch (error: unknown) {
      console.error("Error obtaining access token:", error)
      if (error instanceof Error && "response" in error) {
        const axiosError = error as {
          response?: { data: any; status: number; headers: any }
        }
        if (axiosError.response) {
          console.error("Response data:", axiosError.response.data)
          console.error("Response status:", axiosError.response.status)
          console.error("Response headers:", axiosError.response.headers)
        }
      } else if (error instanceof Error && "request" in error) {
        console.error("No response received:", error.request)
      } else {
        console.error("Error message:", error)
      }
      throw error
    }
  }

  private async makeAuthenticatedRequest(
    url: string,
    method: string,
    data?: any,
  ) {
    const token = await this.getAccessToken()
    try {
      const response = await this.axiosInstance({
        url,
        method,
        data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      console.error("Error making authenticated request:", error)
      throw error
    }
  }

  async createDocument(documentData: DocumentData) {
    return this.makeAuthenticatedRequest(
      "/sign/documents",
      "POST",
      documentData,
    )
  }

  async getDocumentStatus(documentId: string) {
    return this.makeAuthenticatedRequest(
      `/sign/documents/${documentId}/summary`,
      "GET",
    )
  }

  async getDocumentFile(
    documentId: string,
    fileFormat?: string,
    originalFileName?: boolean,
  ) {
    let url = `/sign/documents/${documentId}/files`
    if (fileFormat) url += `?fileFormat=${fileFormat}`
    if (originalFileName)
      url += `${fileFormat ? "&" : "?"}originalFileName=true`
    return this.makeAuthenticatedRequest(url, "GET")
  }

  async createAttachment(documentId: string, attachmentData: AttachmentData) {
    return this.makeAuthenticatedRequest(
      `/sign/documents/${documentId}/attachments`,
      "POST",
      attachmentData,
    )
  }
}
