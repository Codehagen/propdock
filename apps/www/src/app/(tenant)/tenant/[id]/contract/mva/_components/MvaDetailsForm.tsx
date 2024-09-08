"use client";

import { updateContract } from "@/actions/update-contract";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@propdock/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@propdock/ui/components/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@propdock/ui/components/form";
import { Input } from "@propdock/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@propdock/ui/components/select";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Define validation schema
const VatTermsSchema = z.object({
  vatTerms: z.string().min(1, "Vat Terms is required"),
  businessCategory: z.string().min(1, "Business Category is required")
});

export function MvaDetailsForm({ tenantDetails }) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(VatTermsSchema),
    defaultValues: {
      vatTerms: tenantDetails.contracts[0]?.vatTerms || "None",
      businessCategory: tenantDetails.contracts[0]?.businessCategory || ""
    }
  });

  useEffect(() => {
    form.reset({
      vatTerms: tenantDetails.contracts[0]?.vatTerms || "None",
      businessCategory: tenantDetails.contracts[0]?.businessCategory || ""
    });
  }, [tenantDetails, form]);

  const onSubmit = async data => {
    setIsLoading(true);

    try {
      const result = await updateContract(tenantDetails.contracts[0].id, {
        vatTerms: data.vatTerms,
        businessCategory: data.businessCategory
      });

      if (!result.success) {
        throw new Error(result.error || "Kunne ikke oppdatere kontrakten.");
      }

      toast.success("Kontrakten oppdatert");
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>MVA og forretningskategori</CardTitle>
        <CardDescription>
          Oppdater moms og forretningskategori for leietakeren.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="vatTerms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Momsvilkår</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Velg moms vilkår" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">Ikke Mva pliktig</SelectItem>
                        <SelectItem value="Standard">
                          Mva pliktig (vanlig)
                        </SelectItem>
                        <SelectItem value="Reduced">
                          Frivilig organisasjon
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="businessCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bruk av lokalet</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Lager, kontor, lager..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Hva skal lokalet brukes til?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="justify-between space-x-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Lagrer..." : "Lagre"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
