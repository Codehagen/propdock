import Link from "next/link"
import { CircleUser, Menu, Package2, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { EditAnalysisSheet } from "@/components/buttons/EditAnalysisSheet" // Import the EditAnalysisSheet component

export function AnalysisCards({ analysis }) {
  return (
    <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
      <nav className="grid gap-4 text-sm text-muted-foreground">
        <Link href="#" className="font-semibold text-primary">
          General
        </Link>
        <Link href="#">Security</Link>
        <Link href="#">Integrations</Link>
        <Link href="#">Support</Link>
        <Link href="#">Organizations</Link>
        <Link href="#">Advanced</Link>
      </nav>
      <div className="grid gap-6">
        {/* Analysis Name Card */}
        <Card>
          <CardHeader>
            <CardTitle>Analysis Name</CardTitle>
            <CardDescription>
              This is the name of the financial analysis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <Input placeholder="Analysis Name" defaultValue={analysis.name} />
            </form>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button>Save</Button>
          </CardFooter>
        </Card>

        {/* Analysis Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Analysis Details</CardTitle>
            <CardDescription>
              Detailed information about the financial analysis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4">
              <Input
                placeholder="Rentable Area"
                defaultValue={analysis.rentableArea}
                type="number"
              />
              <Input
                placeholder="Ratio Area Office"
                defaultValue={analysis.ratioAreaOffice}
                type="number"
                step="0.01"
              />
              <Input
                placeholder="Ratio Area Merch"
                defaultValue={analysis.ratioAreaMerch}
                type="number"
                step="0.01"
              />
              <Input
                placeholder="Ratio Area Misc"
                defaultValue={analysis.ratioAreaMisc}
                type="number"
                step="0.01"
              />
              <Input
                placeholder="Rent Per Area"
                defaultValue={analysis.rentPerArea}
                type="number"
              />
            </form>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button>Save</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
