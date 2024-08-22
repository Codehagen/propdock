import React from "react"
import Link from "next/link"
import { Button } from "@propdock/ui/components/button"

import { prisma } from "@dingify/db"

import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import NoPhotoPlaceholder from "@/components/properties/NoPhotoPlaceholder copy"
import PropertyImageWithOptions from "@/components/properties/PropertyImageWithOptions"

const MAX_PHOTOS = 20 // Set the maximum number of photos allowed

export default async function PropertyPage({ params }) {
  const propertyId = params.id

  // Fetch property data
  const propertyData = await getPropertyData(propertyId)
  const hasPhotos = (propertyData?.images.length ?? 0) > 0
  const canAddMorePhotos = (propertyData?.images.length ?? 0) < MAX_PHOTOS
  MAX_PHOTOS

  // Function to get property data
  async function getPropertyData(id) {
    try {
      return await prisma.property.findUnique({
        where: { id },
        include: { images: true },
      })
    } catch (error) {
      console.error("Error fetching property:", error)
      return null
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={propertyData?.address || "Property"}
        text="Let's start working on your property"
      >
        {canAddMorePhotos ? (
          <Button />
        ) : (
          <Button disabled>Maximum photos reached</Button>
        )}
      </DashboardHeader>

      <div className="space-y-4">
        {hasPhotos ? (
          propertyData?.images.map((image) => (
            <PropertyImageWithOptions key={image.id} image={image} />
          ))
        ) : (
          <NoPhotoPlaceholder slug={propertyId} propertyId={propertyId} />
        )}
      </div>
      <Link href="#">
        <Button>Back to top</Button>
      </Link>
    </DashboardShell>
  )
}
