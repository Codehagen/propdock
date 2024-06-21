import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@dingify/ui/components/card"
import { format } from "date-fns"
import { nb } from "date-fns/locale"

export default function InfoCard({data, type}: {
    data?: {
        id: number,
        name: string,
        createdAt: Date,
        building: { name: string },
        floor: number | string | null,
        officeSpace: number | string | null
    },
    type: "property" | "tenant"
}) {

    console.log(data)
    if (type === "property")
        return (
            <Card>
            <CardHeader className="mb-5 bg-muted py-4">
              <CardTitle>{data?.name}</CardTitle>
              <CardDescription>
                {data?.createdAt && format(data.createdAt, "PPP", { locale: nb })}{" "}
              </CardDescription>
            </CardHeader>
            <CardContent>Some content</CardContent>
          </Card>
        )

    if (type === "tenant")
        return (
            <Card>
            <CardHeader className="mb-5 bg-muted py-4">
              <CardTitle>{data?.name}</CardTitle>
              <CardDescription>
                {data?.building.name}{data?.floor && " - " + data?.floor}
              </CardDescription>
            </CardHeader>
            <CardContent>Some content</CardContent>
          </Card>
        )
}