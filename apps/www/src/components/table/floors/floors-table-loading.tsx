import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@propdock/ui/components/card"
import { Skeleton } from "@propdock/ui/components/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@propdock/ui/components/table"

export default function FloorsTable2Loading() {
  return (
    <div className="container mx-auto space-y-8 p-4">
      {[1, 2].map((floor) => (
        <Card key={floor}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">
              <Skeleton className="h-8 w-32" />
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-9 w-36" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {[1, 2, 3, 4, 5, 6, 7].map((cell) => (
                    <TableHead key={cell}>
                      <Skeleton className="h-5 w-full" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3].map((row) => (
                  <TableRow key={row}>
                    {[1, 2, 3, 4, 5, 6, 7].map((cell) => (
                      <TableCell key={cell}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
      <div className="flex justify-center">
        <Skeleton className="h-10 w-40" />
      </div>
    </div>
  )
}
