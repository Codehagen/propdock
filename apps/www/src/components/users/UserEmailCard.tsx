import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@propdock/ui/components/card";

import EmailButton from "./EmailButton"; // Adjust the import path as necessary

export default function UserEmailCard({ tenantDetails }) {
  const email = tenantDetails.email || "example@example.com";
  const name = tenantDetails.name || "[Customer Name]";
  const subject = "Checking In: How's Your Experience with [Your Product]?";
  const body = `
  Hi ${name},
  
  How is it going with [Your Product]?
  
  Just wanted to hear how the experience with [Your Product] has been. Would love to have a chat about how I can make the product better for you.
  
  Looking forward to hearing from you.
  
  Best regards,
  [Your Name]
  
  [Your Contact Information]
  `;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Følg opp kunden</CardTitle>
        <CardDescription>
          Er det lenge siden du har pratet med kunden? Send de en epost.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div />
        <EmailButton email={email} subject={subject} body={body} />
      </CardContent>
    </Card>
  );
}
