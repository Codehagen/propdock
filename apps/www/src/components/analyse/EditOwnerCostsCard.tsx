"use client"

import { useState } from "react"
import { updateAnalysis } from "@/actions/update-analysis"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@dingify/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@dingify/ui/components/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@dingify/ui/components/form"
import { Input } from "@dingify/ui/components/input"
import { Switch } from "@dingify/ui/components/switch"

const FormSchema = z.object({
  ownerCostsMethod: z.boolean().default(false).optional(),
  ownerCostsManual: z
    .string()
    .nonempty("Owner Costs Manual is required.")
    .optional(),
  costMaintenance: z
    .string()
    .nonempty("Cost Maintenance is required.")
    .optional(),
  costInsurance: z.string().nonempty("Cost Insurance is required.").optional(),
  costRevision: z.string().nonempty("Cost Revision is required.").optional(),
  costAdm: z.string().nonempty("Cost Adm is required.").optional(),
  costOther: z.string().nonempty("Cost Other is required.").optional(),
  costNegotiation: z
    .string()
    .nonempty("Cost Negotiation is required.")
    .optional(),
  costLegalFees: z.string().nonempty("Cost Legal Fees is required.").optional(),
  costConsultFees: z
    .string()
    .nonempty("Cost Consult Fees is required.")
    .optional(),
  costAssetMgmt: z.string().nonempty("Cost Asset Mgmt is required.").optional(),
  costSum: z.string().nonempty("Cost Sum is required.").optional(),
})

interface EditOwnerCostsCardProps {
  analysisId: number
  initialOwnerCostsMethod: boolean
  initialOwnerCostsManual?: number
  initialCostMaintenance?: number
  initialCostInsurance?: number
  initialCostRevision?: number
  initialCostAdm?: number
  initialCostOther?: number
  initialCostNegotiation?: number
  initialCostLegalFees?: number
  initialCostConsultFees?: number
  initialCostAssetMgmt?: number
  initialCostSum?: number
}

export function EditOwnerCostsCard({
  analysisId,
  initialOwnerCostsMethod,
  initialOwnerCostsManual,
  initialCostMaintenance,
  initialCostInsurance,
  initialCostRevision,
  initialCostAdm,
  initialCostOther,
  initialCostNegotiation,
  initialCostLegalFees,
  initialCostConsultFees,
  initialCostAssetMgmt,
  initialCostSum,
}: EditOwnerCostsCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ownerCostsMethod: initialOwnerCostsMethod,
      ownerCostsManual: initialOwnerCostsManual?.toString() || "",
      costMaintenance: initialCostMaintenance?.toString() || "",
      costInsurance: initialCostInsurance?.toString() || "",
      costRevision: initialCostRevision?.toString() || "",
      costAdm: initialCostAdm?.toString() || "",
      costOther: initialCostOther?.toString() || "",
      costNegotiation: initialCostNegotiation?.toString() || "",
      costLegalFees: initialCostLegalFees?.toString() || "",
      costConsultFees: initialCostConsultFees?.toString() || "",
      costAssetMgmt: initialCostAssetMgmt?.toString() || "",
      costSum: initialCostSum?.toString() || "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true)
    try {
      const result = await updateAnalysis(analysisId, {
        ownerCostsMethod: data.ownerCostsMethod,
        ownerCostsManual: data.ownerCostsManual
          ? Number(data.ownerCostsManual)
          : undefined,
        costMaintenance: data.costMaintenance
          ? Number(data.costMaintenance)
          : undefined,
        costInsurance: data.costInsurance
          ? Number(data.costInsurance)
          : undefined,
        costRevision: data.costRevision ? Number(data.costRevision) : undefined,
        costAdm: data.costAdm ? Number(data.costAdm) : undefined,
        costOther: data.costOther ? Number(data.costOther) : undefined,
        costNegotiation: data.costNegotiation
          ? Number(data.costNegotiation)
          : undefined,
        costLegalFees: data.costLegalFees
          ? Number(data.costLegalFees)
          : undefined,
        costConsultFees: data.costConsultFees
          ? Number(data.costConsultFees)
          : undefined,
        costAssetMgmt: data.costAssetMgmt
          ? Number(data.costAssetMgmt)
          : undefined,
        costSum: data.costSum ? Number(data.costSum) : undefined,
      })
      if (result.success) {
        toast.success("Analysis updated successfully.")
      } else {
        throw new Error(result.error || "Failed to update analysis.")
      }
    } catch (error) {
      toast.error(error.message)
      console.error("Error updating analysis:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Owner Costs</CardTitle>
        <CardDescription>Edit owner costs and related values.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="ownerCostsMethod"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <FormLabel>Owner Costs Method</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {form.watch("ownerCostsMethod") ? (
              <>
                <FormField
                  control={form.control}
                  name="costMaintenance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost Maintenance</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Cost Maintenance"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="costInsurance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost Insurance</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Cost Insurance"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="costRevision"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost Revision</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Cost Revision"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="costAdm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost Adm</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Cost Adm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="costOther"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost Other</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Cost Other"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="costNegotiation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost Negotiation</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Cost Negotiation"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="costLegalFees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost Legal Fees</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Cost Legal Fees"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="costConsultFees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost Consult Fees</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Cost Consult Fees"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="costAssetMgmt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost Asset Mgmt</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Cost Asset Mgmt"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="costSum"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost Sum</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Cost Sum" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <FormField
                control={form.control}
                name="ownerCostsManual"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner Costs Manual</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Owner Costs Manual"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
