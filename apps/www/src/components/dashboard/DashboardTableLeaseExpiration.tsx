import * as React from "react"
import Link from "next/link"
import { Button, buttonVariants } from "@propdock/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@propdock/ui/components/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@propdock/ui/components/table"

const leaseExpirationData = [
  {
    property: "Prop A",
    jan: 2,
    feb: 3,
    mar: 1,
    apr: 4,
    may: 2,
    jun: 0,
    total: 12,
  },
  {
    property: "Prop B",
    jan: 1,
    feb: 2,
    mar: 3,
    apr: 1,
    may: 2,
    jun: 2,
    total: 11,
  },
  {
    property: "Prop C",
    jan: 3,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 2,
    total: 15,
  },
  {
    property: "Prop D",
    jan: 0,
    feb: 1,
    mar: 3,
    apr: 2,
    may: 1,
    jun: 1,
    total: 8,
  },
]

export default function DashboardTableLeaseExpiration() {
  return (
    <Card className="overflow-auto">
      <CardHeader>
        <CardTitle>Leiekontrakter som utgår</CardTitle>
        <CardDescription>
          Antall leiekontrakter som utløper i løpet av året
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Eiendom</TableHead>
              <TableHead>Jan</TableHead>
              <TableHead>Feb</TableHead>
              <TableHead>Mar</TableHead>
              <TableHead>Apr</TableHead>
              <TableHead>May</TableHead>
              <TableHead>Jun</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaseExpirationData.map((row) => (
              <TableRow key={row.property}>
                <TableCell className="font-medium">{row.property}</TableCell>
                <TableCell>{row.jan}</TableCell>
                <TableCell>{row.feb}</TableCell>
                <TableCell>{row.mar}</TableCell>
                <TableCell>{row.apr}</TableCell>
                <TableCell>{row.may}</TableCell>
                <TableCell>{row.jun}</TableCell>
                <TableCell>{row.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Link
          className={buttonVariants({ variant: "outline" })}
          href="/property"
        >
          Se detaljer
        </Link>
      </CardFooter>
    </Card>
  )
}
