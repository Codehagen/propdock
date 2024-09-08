import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@propdock/ui/components/avatar";
import { Button } from "@propdock/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@propdock/ui/components/card";
import { Building, ExternalLink, Mail, Phone, User } from "lucide-react";

import { EmptyPlaceholder } from "../shared/empty-placeholder";

interface OwnerInfo {
  name: string;
  orgNumber: string;
  contactPerson: string;
  email: string;
  phone: string;
}

export default function AnalysesRaitingBuilding({
  analysisDetails
}: {
  analysisDetails: { name: string };
}) {
  if (!analysisDetails.name || analysisDetails.name.length === 0) {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="building" />
        <EmptyPlaceholder.Title>Ingen eierinformasjon</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          Det er ingen eierinformasjon tilgjengelig for denne bygningen.
        </EmptyPlaceholder.Description>
      </EmptyPlaceholder>
    );
  }

  // Mock data - replace with actual data from analysisDetails
  const ownerInfo: OwnerInfo = {
    name: "Propdock AS",
    orgNumber: "912345678",
    contactPerson: "Christer Hagen",
    email: "christer@propdock.no",
    phone: "+47 123 45 678"
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Eierinformasjon
        </CardTitle>
        <CardDescription>Detaljer om bygningens eier</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src="/path-to-company-logo.png"
                alt={ownerInfo.name}
              />
              <AvatarFallback>
                {ownerInfo.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{ownerInfo.name}</h3>
              <p className="text-muted-foreground text-sm">
                Org.nr: {ownerInfo.orgNumber}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{ownerInfo.contactPerson}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a
                href={`mailto:${ownerInfo.email}`}
                className="text-blue-600 text-sm hover:underline"
              >
                {ownerInfo.email}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a
                href={`tel:${ownerInfo.phone}`}
                className="text-blue-600 text-sm hover:underline"
              >
                {ownerInfo.phone}
              </a>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <ExternalLink className="mr-2 h-4 w-4" />
          Se full eierinformasjon
        </Button>
      </CardFooter>
    </Card>
  );
}
