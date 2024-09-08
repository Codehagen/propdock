"use client";

import { Button } from "@propdock/ui/components/button";

import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

export default function NoSummaryPlaceholder({ propertyId, slug }) {
  return (
    <EmptyPlaceholder>
      <EmptyPlaceholder.Icon name="media" />
      <EmptyPlaceholder.Title>Upload pictures</EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>
        Upload pictures to start and let us create the text
      </EmptyPlaceholder.Description>
      <Button />
    </EmptyPlaceholder>
  );
}
