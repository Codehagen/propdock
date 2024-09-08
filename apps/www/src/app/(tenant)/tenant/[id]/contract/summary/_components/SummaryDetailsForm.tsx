import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@propdock/ui/components/card";
import React from "react";

export function SummaryDetailsForm({ tenantDetails }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tenant Details Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(tenantDetails, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}
