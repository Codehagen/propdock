import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@propdock/ui/components/card";
import { Label } from "@propdock/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@propdock/ui/components/select";

import EmailButton from "./EmailButton"; // Adjust the import path as necessary

export default function UserChangeStatusCard({ tenantDetails }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kunde status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="status">Status</Label>
            <Select>
              <SelectTrigger id="status" aria-label="Select status">
                <SelectValue placeholder="Leietaker" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Leietaker</SelectItem>
                <SelectItem value="published">Leiekontrakt utgår</SelectItem>
                <SelectItem value="archived">Ikke leietaker</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
