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
      const response = await axios.get(`/api/oauth/${serviceName}/initiate`)
      console.debug("YYY: Axios URL content:", response)
      const data = response.data
      window.location.href = data.url
    } catch (error) {
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
