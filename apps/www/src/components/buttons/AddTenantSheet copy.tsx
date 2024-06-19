"use client";

import { useEffect, useState } from "react";
import { createTenant } from "@/actions/create-tenant";
import { getProperties } from "@/actions/get-properties";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@dingify/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@dingify/ui/components/form";
import { Input } from "@dingify/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@dingify/ui/components/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@dingify/ui/components/sheet";

const TenantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  orgnr: z
    .string()
    .min(1, "Organization number is required")
    .regex(/^\d+$/, "Organization number must be a number"),
  numEmployees: z.number().min(1, "Number of employees is required"),
  propertyId: z.string().optional(),
});

export function AddTenantSheet() {
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);

  const form = useForm({
    resolver: zodResolver(TenantSchema),
    defaultValues: {
      name: "",
      orgnr: "",
      numEmployees: 1, // Default value set to 1
      propertyId: "",
    },
  });

  useEffect(() => {
    async function fetchProperties() {
      const properties = await getProperties();
      setProperties(properties);
    }
    fetchProperties();
  }, []);

  const onSubmit = async (data: z.infer<typeof TenantSchema>) => {
    setIsLoading(true);

    try {
      const tenantData = {
        name: data.name,
        orgnr: parseInt(data.orgnr, 10), // Ensure orgnr is an integer
        numEmployees: Number(data.numEmployees), // Ensure numEmployees is a number
        property: data.propertyId
          ? { connect: { id: parseInt(data.propertyId, 10) } }
          : undefined,
      };

      const result = await createTenant(tenantData);

      if (!result.success) {
        throw new Error(result.error || "Failed to save tenant.");
      }

      toast.success(`Tenant ${data.name} was saved.`);
      form.reset();
      // Optionally, refresh the page or update the state to show the new tenant
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Add New Tenant</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add New Tenant</SheetTitle>
          <SheetDescription>Add details for the new tenant.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="orgnr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Organization Number..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numEmployees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Employees</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Number of Employees..."
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="propertyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a property" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {properties.map((property) => (
                        <SelectItem
                          key={property.id}
                          value={property.id.toString()}
                        >
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/*
            <FormField
              control={form.control}
              name="buildingId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Building</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      onBuildingChange(value);
                    }}
                    value={field.value}
                    disabled={!buildings.length}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a building" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {buildings.map((building) => (
                        <SelectItem
                          key={building.id}
                          value={building.id.toString()}
                        >
                          {building.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="floorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Floor</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      onFloorChange(value);
                    }}
                    value={field.value}
                    disabled={!floors.length}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a floor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {floors.map((floor) => (
                        <SelectItem key={floor.id} value={floor.id.toString()}>
                          {floor.number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="officeSpaceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Office Space</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!officeSpaces.length}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an office space" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {officeSpaces.map((officeSpace) => (
                        <SelectItem
                          key={officeSpace.id}
                          value={officeSpace.id.toString()}
                        >
                          {officeSpace.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            */}
            <SheetFooter>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? "Saving..." : "Save new tenant"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
