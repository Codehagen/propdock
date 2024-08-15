"use client"

import React, { useState } from "react"
import { deleteWsApiKey } from "@/actions/delete-ws-api-key"
import axios from "axios"
import { toast } from "sonner"

import { Button } from "@dingify/ui/components/button"

interface ConnectorButtonProps {
  serviceName: string
  status: string
  workspaceId: string
}

const ConnectorButton: React.FC<ConnectorButtonProps> = ({
  serviceName,
  status,
  workspaceId,
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleDisconnect = async () => {
    setIsLoading(true)
    try {
      const result = await deleteWsApiKey(workspaceId, serviceName)
      if (result.success) {
        toast.success(`Disconnected from ${serviceName}`)
        window.location.reload()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast.error(`Error disconnecting from ${serviceName}: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuth = async () => {
    setIsLoading(true)
    try {
      const url = `/api/oauth/${serviceName}/initiate`
      console.log("Sending request to:", url)

      const response = await axios.get(url, {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
        params: {
          _: new Date().getTime(),
        },
      })

      console.log("Response received:", response)
      console.log("Response data:", response.data)

      const data = response.data
      window.location.href = data.url
    } catch (error) {
      console.error("Detailed error:", error)
      console.error("Error response:", error.response)
      toast.error(`Error initiating OAuth: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return status === "Connected" ? (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDisconnect}
      disabled={isLoading}
    >
      {isLoading ? "Disconnecting..." : "Disconnect"}
    </Button>
  ) : (
    <Button variant="outline" size="sm" onClick={handleOAuth}>
      {isLoading ? "Connecting..." : "Connect"}
    </Button>
  )
}

export default ConnectorButton
