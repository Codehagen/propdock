import { getBuildings } from "@/actions/get-buildings";
import { getProperties } from "@/actions/get-properties";
import { updateTenant } from "@/actions/update-tenant";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@propdock/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@propdock/ui/components/form";
import { Input } from "@propdock/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@propdock/ui/components/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@propdock/ui/components/sheet";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const TenantSchema = z.object({
  name: z.string().min(1, "Navn er påkrevd"),
  orgnr: z
    .string()
    .min(1, "Organisasjonsnummer er påkrevd")
    .regex(/^\d+$/, "Organisasjonsnummer må være et tall"),
  numEmployees: z.number().min(1, "Antall ansatte er påkrevd"),
  propertyId: z.string().optional(),
  buildingId: z.string().optional(),
});

interface Property {
  id: string;
  name: string;
}

interface Building {
  id: string;
  name: string;
}

interface EditTenantSheetProps {
  tenant: {
    id: string;
    name: string;
    orgnr?: number | null;
    numEmployees: number;
    buildingId: string;
    floorId?: string | null;
    officeSpaceId?: string | null;
    propertyId: string;
  };
  children: React.ReactNode;
}

export function EditTenantSheet({ tenant, children }: EditTenantSheetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(TenantSchema),
    defaultValues: {
      name: tenant.name,
      orgnr: tenant.orgnr?.toString() || "",
      numEmployees: tenant.numEmployees,
      propertyId: tenant.propertyId,
      buildingId: tenant.buildingId,
    },
  });

  useEffect(() => {
    async function fetchProperties() {
      try {
        const properties = await getProperties();
        setProperties(properties);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      }
    }
    fetchProperties();
  }, []);

  useEffect(() => {
    async function fetchBuildings() {
      if (tenant.propertyId) {
        try {
          const buildings = await getBuildings(tenant.propertyId);
          setBuildings(buildings);
        } catch (error) {
          console.error("Failed to fetch buildings:", error);
        }
      }
    }
    fetchBuildings();
  }, [tenant.propertyId]);

  const onPropertyChange = async (propertyId: string) => {
    form.setValue("propertyId", propertyId);
    try {
      const buildings = await getBuildings(propertyId);
      setBuildings(buildings);
    } catch (error) {
      console.error("Failed to fetch buildings:", error);
    }
  };

  const onSubmit = async (data: z.infer<typeof TenantSchema>) => {
    setIsLoading(true);

    try {
      const tenantData = {
        ...data,
        orgnr: Number.parseInt(data.orgnr, 10),
        numEmployees: Number(data.numEmployees),
        buildingId: data.buildingId || tenant.buildingId, // Use existing buildingId if not provided
        propertyId: data.propertyId || tenant.propertyId, // Use existing propertyId if not provided
      };

      const result = await updateTenant(tenant.id, tenantData);

      if (!result.success) {
        throw new Error(result.error || "Kunne ikke oppdatere leietaker.");
      }

      toast.success(`Leietaker ${data.name} ble oppdatert.`);
      setIsOpen(false);
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Rediger leietaker</SheetTitle>
          <SheetDescription>
            Gjør endringer i leietakerinformasjonen her. Klikk lagre når du er
            ferdig.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Navn</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Organisasjonsnummer</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Antall ansatte</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Oppdaterer..." : "Lagre endringer"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
