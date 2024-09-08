import { Badge } from "@propdock/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@propdock/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@propdock/ui/components/table";
import { format } from "date-fns";

// Sample transaction data
const transactions = [
  {
    id: 1,
    invoice: "INV001",
    date: new Date(),
    amount: "kr 12.000,00",
    paymentMethod: "Poweroffice",
    paid: true
  },
  {
    id: 2,
    invoice: "INV002",
    date: new Date(),
    amount: "kr 15.000,00",
    paymentMethod: "Poweroffice",
    paid: false
  },
  {
    id: 3,
    invoice: "INV003",
    date: new Date(),
    amount: "kr 10.000,00",
    paymentMethod: "Xledger",
    paid: true
  },
  {
    id: 4,
    invoice: "INV004",
    date: new Date(),
    amount: "kr 18.000,00",
    paymentMethod: "Fiken",
    paid: false
  },
  {
    id: 5,
    invoice: "INV005",
    date: new Date(),
    amount: "kr 14.000,00",
    paymentMethod: "Tripletex",
    paid: true
  }
];

export default function UsersDashboardTable({ tenantDetails }) {
  return (
    <Card x-chunk="dashboard-05-chunk-3">
      <CardHeader className="px-7">
        <CardTitle>Faktura oversikt</CardTitle>
        <CardDescription>
          Sammendrag av de siste fakturaene sendt til leietakeren
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Dato</TableHead>
            <TableHead>Beløp</TableHead>
            <TableHead>Betalingsmåte</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
          <TableBody>
            {transactions.slice(0, 5).map(transaction => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.invoice}</TableCell>
                <TableCell>
                  {format(new Date(transaction.date), "dd.MM.yy HH.mm")}
                </TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{transaction.paymentMethod}</TableCell>
                <TableCell>
                  {transaction.paid ? (
                    <Badge variant="outline">Betalt</Badge>
                  ) : (
                    <Badge variant="destructive">Forfalt</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
