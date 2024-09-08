"use client";

import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

export default function NoTextPlaceholder({ propertyId, setDescriptionData }) {
  return (
    <EmptyPlaceholder>
      <EmptyPlaceholder.Icon name="brain" />
      <EmptyPlaceholder.Title>Generate description</EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>
        Let Propwrite make the summary and text for you.
      </EmptyPlaceholder.Description>
      {/* <AddFilesButton slug={slug} propertyId={propertyId} /> */}
    </EmptyPlaceholder>
  );
}
