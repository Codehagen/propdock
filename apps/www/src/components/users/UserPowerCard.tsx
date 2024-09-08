import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@propdock/ui/components/card";
import React from "react";

export function UserFinancialCard({ tenantDetails }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Finansiell informasjon</CardTitle>
        <CardDescription>Kort oversikt over leietakeren</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center ">
              <p className="font-medium text-sm leading-none">
                Totalt betalt leie
              </p>
            </div>
            <p className="font-medium text-muted-foreground text-sm">
              81.000,-
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center ">
              <p className="font-medium text-sm leading-none">Kostnader</p>
            </div>
            <p className="font-medium text-muted-foreground text-sm">
              81.000,-
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center ">
              <p className="font-medium text-sm leading-none">
                Betalt skatt og avgifter
              </p>
            </div>
            <p className="font-medium text-muted-foreground text-sm">
              81.000,-
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center ">
              <p className="font-medium text-sm leading-none">Nettoinntekt</p>
            </div>
            <p className="font-medium text-muted-foreground text-sm">
              81.000,-
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DollarSignIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
