import * as React from "react";
import Link from "next/link";

import { Button, buttonVariants } from "@dingify/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@dingify/ui/components/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@dingify/ui/components/table";

const properties = [
  {
    property: "Eiendom 1",
    occupancy: "85%",
    revenue: "kr 12.000,00",
    expenses: "kr 3.000,00",
    noi: "kr 9.000,00",
  },
  {
    property: "Eiendom 2",
    occupancy: "90%",
    revenue: "kr 15.000,00",
    expenses: "kr 4.000,00",
    noi: "kr 11.000,00",
  },
  {
    property: "Eiendom 3",
    occupancy: "78%",
    revenue: "kr 10.000,00",
    expenses: "kr 2.500,00",
    noi: "kr 7.500,00",
  },
  {
    property: "Eiendom 4",
    occupancy: "95%",
    revenue: "kr 18.000,00",
    expenses: "kr 5.000,00",
    noi: "kr 13.000,00",
  },
  {
    property: "Eiendom 5",
    occupancy: "88%",
    revenue: "kr 14.000,00",
    expenses: "kr 3.500,00",
    noi: "kr 10.500,00",
  },
];

export default function DashboardTableBestProperties() {
  return (
    <Card className="overflow-auto">
      <CardHeader>
        <CardTitle>Mest lønnsome eiendommer</CardTitle>
        <CardDescription>
          En liste over dine nylige eiendomsstatistikker.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Eiendom</TableHead>
              <TableHead>Belegg</TableHead>
              <TableHead>Inntekter</TableHead>
              <TableHead>Utgifter</TableHead>
              <TableHead className="text-right">Netto driftsinntekt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.property}>
                <TableCell className="font-medium">
                  {property.property}
                </TableCell>
                <TableCell>{property.occupancy}</TableCell>
                <TableCell>{property.revenue}</TableCell>
                <TableCell>{property.expenses}</TableCell>
                <TableCell className="text-right">{property.noi}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Total netto driftsinntekt</TableCell>
              <TableCell className="text-right">
                {properties
                  .reduce((total, property) => {
                    const noi = parseFloat(
                      property.noi.replace(/[\s,kr]/g, ""),
                    );
                    return total + noi;
                  }, 0)
                  .toLocaleString("no-NO", {
                    style: "currency",
                    currency: "NOK",
                  })}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Link
          className={buttonVariants({ variant: "outline" })}
          href="/property"
        >
          Se alle eiendommer
        </Link>
      </CardFooter>
    </Card>
  );
}
