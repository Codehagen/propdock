import axios from "axios"

export class SignicatClient {
  private clientId: string
  private clientSecret: string
  private accessToken: string | null = null
  private tokenExpiration: number = 0

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId
    this.clientSecret = clientSecret
  }

  async initialize() {
    await this.getAccessToken()
  }

  private async getAccessToken() {
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
      const response = await axios.post(
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
      return this.accessToken
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

  async makeAuthenticatedRequest(url: string, method: string, data?: any) {
    const token = await this.getAccessToken()
    try {
      const response = await axios({
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

  // Add other methods for specific Signicat API calls here
}
