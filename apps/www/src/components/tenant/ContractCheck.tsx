"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { createContract } from "@/actions/create-contract"
import { toast } from "sonner"

import { Button } from "@dingify/ui/components/button"

import { EmptyPlaceholder } from "@/components/shared/empty-placeholder"

interface ContractCheckProps {
  tenantDetails: any // Update this type to match your tenant details structure
  onContractCreated?: () => void
}

export function ContractCheck({
  tenantDetails,
  onContractCreated,
}: ContractCheckProps) {
  const router = useRouter()

  const handleCreateContract = async () => {
    try {
      const contractData = {
        tenantId: tenantDetails.id,
        workspaceId: tenantDetails.workspaceId, // Assuming this is available in tenantDetails
        propertyId: tenantDetails.property?.id?.toString() || "",
        buildingId: tenantDetails.building?.id?.toString() || "",
        floors: tenantDetails.floor
          ? { connect: { id: tenantDetails.floor.id } }
          : undefined,
        officeSpaces: tenantDetails.officeSpace
          ? { connect: { id: tenantDetails.officeSpace.id } }
          : undefined,
        contactId: tenantDetails.contacts[0]?.id || 0,
        // Add other fields as needed, with default values
        landlordOrgnr: null,
        landlordName: "",
        contractType: null,
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        startDate: null,
        endDate: null,
        negotiationDate: null,
        isRenewable: false,
        renewablePeriod: null,
        indexationType: null,
        indexValue: null,
        indexationDate: null,
        baseRent: null,
        rentPeriod: null,
        vatTerms: "",
        businessCategory: "",
        collateral: null,
      }

      const result = await createContract(contractData)
      if (result.success) {
        toast.success("Ny kontrakt opprettet")
        if (onContractCreated) {
          onContractCreated()
        }
        router.refresh()
      } else {
        throw new Error(result.error || "Failed to create contract.")
      }
    } catch (error) {
      toast.error(error.message)
      console.error(error)
    }
  }

  return (
    <EmptyPlaceholder>
      <EmptyPlaceholder.Icon name="filetext" />
      <EmptyPlaceholder.Title>Ingen kontrakt funnet</EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>
        Du har ikke opprettet noen kontrakt ennå. Klikk på knappen nedenfor for
        å opprette en ny kontrakt.
      </EmptyPlaceholder.Description>
      <Button onClick={handleCreateContract}>Opprett ny kontrakt</Button>
    </EmptyPlaceholder>
  )
}
