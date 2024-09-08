"use client";

import {
  addIncomeUnits,
  deleteIncomeUnit,
  updateIncomeUnit,
} from "@/actions/update-analysis";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@propdock/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@propdock/ui/components/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@propdock/ui/components/form";
import { Input } from "@propdock/ui/components/input";
import { Label } from "@propdock/ui/components/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@propdock/ui/components/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@propdock/ui/components/table";
import { Textarea } from "@propdock/ui/components/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@propdock/ui/components/tooltip";
import { MinusCircle, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { cn } from "@/lib/utils";

const FormSchema = z.object({
  numberOfUnits: z.number().min(1, "Antall enheter må være minst 1"),
  description: z.string().min(1, "Beskrivelse er påkrevd"),
  areaPerUnit: z.number().min(0, "Areal må være et positivt tall"),
  valuePerUnit: z.number().min(0, "Verdi må være et positivt tall"),
});

interface IncomeUnit {
  id: string;
  financialAnalysisBuildingId: string;
  typeDescription: string;
  areaPerUnit: number;
  valuePerUnit: number;
  numberOfUnits: number;
  createdAt: Date;
  updatedAt: Date;
}

interface EditIncomeCardProps {
  analysisId: number;
  initialAnnualRent: number;
  initialOtherIncome: number;
  incomeUnits: IncomeUnit[];
}

export function EditIncomeCard({
  analysisId,
  initialAnnualRent,
  initialOtherIncome,
  incomeUnits,
}: EditIncomeCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      numberOfUnits: 1,
      description: "",
      areaPerUnit: 0,
      valuePerUnit: 0,
    },
  });

  const [editingCell, setEditingCell] = useState<{
    id: string;
    field: string;
  } | null>(null);

  const handleCellEdit = async (
    id: string,
    field: string,
    value: string | number,
  ) => {
    setEditingCell(null);
    try {
      let parsedValue: string | number = value;
      if (
        field === "numberOfUnits" ||
        field === "areaPerUnit" ||
        field === "valuePerUnit"
      ) {
        parsedValue = Number(value);
        if (Number.isNaN(parsedValue)) {
          throw new Error(`Invalid number for ${field}`);
        }
      }

      const result = await updateIncomeUnit(id, { [field]: parsedValue });
      if (result.success) {
        toast.success("Oppdateringen ble lagt til.");
      } else {
        throw new Error(result.error || "Failed to update income unit.");
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Error updating income unit:", error);
    }
  };

  const EditableCell = ({ unit, field, type = "text" }) => {
    const isEditing =
      editingCell?.id === unit.id && editingCell?.field === field;
    const value = unit[field];

    return (
      <TableCell
        onClick={() => setEditingCell({ id: unit.id, field })}
        className="relative cursor-pointer p-4"
      >
        {isEditing ? (
          <Input
            type={type}
            defaultValue={value}
            autoFocus
            onBlur={(e) => handleCellEdit(unit.id, field, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCellEdit(unit.id, field, e.currentTarget.value);
              }
            }}
            className={cn(
              "absolute inset-0 h-full w-full border-none bg-white p-4 focus:ring-1 focus:ring-blue-500",
              type === "number" && "text-right",
            )}
          />
        ) : (
          <div className={cn(type === "number" && "text-right")}>
            {type === "number" && value != null
              ? Number(value).toLocaleString()
              : value || ""}
          </div>
        )}
      </TableCell>
    );
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    try {
      const result = await addIncomeUnits(analysisId, {
        typeDescription: data.description,
        areaPerUnit: data.areaPerUnit,
        valuePerUnit: data.valuePerUnit,
        numberOfUnits: data.numberOfUnits,
      });

      if (result.success) {
        toast.success(`${result.count} inntektsenheter ble lagt til.`);
        form.reset(); // Reset the form after successful submission
      } else {
        throw new Error(
          result.error || "Kunne ikke legge til inntektsenheter.",
        );
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Feil ved tillegging av inntektsenheter:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDeleteIncomeUnit = async (incomeUnitId: string) => {
    try {
      const result = await deleteIncomeUnit(incomeUnitId);
      if (result.success) {
        toast.success("Enheten ble slettet.");
      } else {
        throw new Error(result.error || "Kunne ikke slette enheten.");
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Feil ved sletting av inntektsenhet:", error);
    }
  };

  // Calculate totals
  const totalArea = incomeUnits.reduce((sum, unit) => {
    return sum + (unit.numberOfUnits || 1) * unit.areaPerUnit; // Use 1 as the default if numberOfUnits is undefined
  }, 0);

  const totalValue = incomeUnits.reduce((sum, unit) => {
    return sum + (unit.numberOfUnits || 1) * unit.valuePerUnit; // Use 1 as the default if numberOfUnits is undefined
  }, 0);

  const averageValuePerArea = totalArea > 0 ? totalValue / totalArea : 0;

  return (
    <>
      {incomeUnits.length > 0 ? (
        <Card className="mt-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Inntektsenheter</CardTitle>
              <CardDescription>Overall income overview</CardDescription>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Legg til enheter</Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-6">
                <div className="mb-4">
                  <h3 className="font-medium text-lg leading-none">
                    Legg til ny inntektsenhet
                  </h3>
                </div>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="numberOfUnits"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Antall enheter</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Skriv inn antall enheter"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    Number.parseInt(e.target.value),
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Beskrivelse</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Skriv inn beskrivelse"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="areaPerUnit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Areal per enhet (kvm)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Skriv inn areal per enhet"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    Number.parseFloat(e.target.value),
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="valuePerUnit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Verdi per enhet (kr)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Skriv inn verdi per enhet"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    Number.parseFloat(e.target.value),
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormItem>
                        <FormLabel>Totalt areal (kvm)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={(
                              form.watch("numberOfUnits") *
                                form.watch("areaPerUnit") || 0
                            ).toFixed(2)}
                            disabled
                          />
                        </FormControl>
                      </FormItem>
                      <FormItem>
                        <FormLabel>Total verdi (kr)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={(
                              form.watch("numberOfUnits") *
                                form.watch("valuePerUnit") || 0
                            ).toFixed(2)}
                            disabled
                          />
                        </FormControl>
                      </FormItem>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => form.reset()}>
                        Avbryt
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        Lagre {form.watch("numberOfUnits")} stk
                      </Button>
                    </div>
                  </form>
                </Form>
              </PopoverContent>
            </Popover>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Kvm</TableHead>
                  <TableHead className="text-right">Kr pr enhet</TableHead>
                  <TableHead className="text-right">Kr / Kvm</TableHead>
                  <TableHead className="text-right">Slett</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomeUnits.map((unit) => {
                  const valuePerArea =
                    unit.areaPerUnit > 0
                      ? unit.valuePerUnit / unit.areaPerUnit
                      : 0;
                  return (
                    <TableRow key={unit.id}>
                      <EditableCell unit={unit} field="typeDescription" />
                      <EditableCell
                        unit={unit}
                        field="areaPerUnit"
                        type="number"
                      />
                      <EditableCell
                        unit={unit}
                        field="valuePerUnit"
                        type="number"
                      />
                      <TableCell className="text-right">
                        {valuePerArea.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => handleDeleteIncomeUnit(unit.id)}
                              variant="ghost"
                              size="icon"
                            >
                              <MinusCircle className="h-4 w-4 font-medium" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Slett enheten</TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell>
                    Totalt:{" "}
                    {incomeUnits.reduce(
                      (sum, unit) => sum + (unit.numberOfUnits || 1),
                      0,
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {totalArea.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {totalValue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {averageValuePerArea.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-4 flex flex-col items-center justify-center p-6 text-center">
          <PlusCircle className="mb-4 h-12 w-12 text-gray-400" />
          <CardTitle className="mb-2">Ingen inntektsenheter ennå</CardTitle>
          <CardDescription className="mb-4">
            Klikk på "Legg til enheter" for å begynne å legge til
            inntektsenheter.
          </CardDescription>
          <Popover>
            <PopoverTrigger asChild>
              <Button>Legg til enheter</Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-6">
              <div className="mb-4">
                <h3 className="font-medium text-lg leading-none">
                  Legg til ny inntektsenhet
                </h3>
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="numberOfUnits"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Antall enheter</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Skriv inn antall enheter"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number.parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Beskrivelse</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Skriv inn beskrivelse"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="areaPerUnit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Areal per enhet (kvm)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Skriv inn areal per enhet"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  Number.parseFloat(e.target.value),
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="valuePerUnit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Verdi per enhet (kr)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Skriv inn verdi per enhet"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  Number.parseFloat(e.target.value),
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormItem>
                      <FormLabel>Totalt areal (kvm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={(
                            form.watch("numberOfUnits") *
                              form.watch("areaPerUnit") || 0
                          ).toFixed(2)}
                          disabled
                        />
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormLabel>Total verdi (kr)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={(
                            form.watch("numberOfUnits") *
                              form.watch("valuePerUnit") || 0
                          ).toFixed(2)}
                          disabled
                        />
                      </FormControl>
                    </FormItem>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => form.reset()}>
                      Avbryt
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      Lagre {form.watch("numberOfUnits")} stk
                    </Button>
                  </div>
                </form>
              </Form>
            </PopoverContent>
          </Popover>
        </Card>
      )}
    </>
  );
}
