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
    .nonempty("Manuelle eierkostnader er påkrevd.")
    .optional(),
  costMaintenance: z
    .string()
    .nonempty("Vedlikeholdskostnader er påkrevd.")
    .optional(),
  costInsurance: z
    .string()
    .nonempty("Forsikringskostnader er påkrevd.")
    .optional(),
  costRevision: z
    .string()
    .nonempty("Revisjonskostnader er påkrevd.")
    .optional(),
  costAdm: z
    .string()
    .nonempty("Administrasjonskostnader er påkrevd.")
    .optional(),
  costOther: z.string().nonempty("Andre kostnader er påkrevd.").optional(),
  costNegotiation: z
    .string()
    .nonempty("Forhandlingskostnader er påkrevd.")
    .optional(),
  costLegalFees: z
    .string()
    .nonempty("Juridiske kostnader er påkrevd.")
    .optional(),
  costConsultFees: z
    .string()
    .nonempty("Konsulentkostnader er påkrevd.")
    .optional(),
  costAssetMgmt: z
    .string()
    .nonempty("Forvaltningskostnader er påkrevd.")
    .optional(),
  costSum: z.string().nonempty("Sum kostnader er påkrevd.").optional(),
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
        toast.success("Analysen ble oppdatert.")
      } else {
        throw new Error(result.error || "Kunne ikke oppdatere analysen.")
      }
    } catch (error) {
      toast.error(error.message)
      console.error("Feil ved oppdatering av analyse:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Eierkostnader</CardTitle>
        <CardDescription>
          Rediger eierkostnader og relaterte verdier.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="ownerCostsMethod"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <FormLabel>Eierkostnadsmetode</FormLabel>
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
                      <FormLabel>Vedlikeholdskostnader</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Vedlikeholdskostnader"
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
                      <FormLabel>Forsikringskostnader</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Forsikringskostnader"
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
                      <FormLabel>Revisjonskostnader</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Revisjonskostnader"
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
                      <FormLabel>Administrasjonskostnader</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Administrasjonskostnader"
                          {...field}
                        />
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
                      <FormLabel>Andre kostnader</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Andre kostnader"
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
                      <FormLabel>Forhandlingskostnader</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Forhandlingskostnader"
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
                      <FormLabel>Juridiske kostnader</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Juridiske kostnader"
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
                      <FormLabel>Konsulentkostnader</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Konsulentkostnader"
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
                      <FormLabel>Forvaltningskostnader</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Forvaltningskostnader"
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
                      <FormLabel>Sum kostnader</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Sum kostnader"
                          {...field}
                        />
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
                    <FormLabel>Manuelle eierkostnader</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Manuelle eierkostnader"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Lagrer..." : "Lagre"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
