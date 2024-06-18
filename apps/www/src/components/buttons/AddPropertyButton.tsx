"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProperty } from "@/actions/create-property";
import { toast } from "sonner";

import { Button } from "@dingify/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@dingify/ui/components/dialog";
import { Input } from "@dingify/ui/components/input";
import { Label } from "@dingify/ui/components/label";

export function AddPropertyButton() {
  const [propertyName, setPropertyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const result = await createProperty(propertyName);

      if (!result.success) {
        throw new Error(result.error || "Feil ved oppretting av eiendom.");
      }

      toast.success(`Eiendommen "${propertyName}" ble lagt til.`);

      // Optionally, you can refresh the page or navigate to the new property
      router.push(`/dashboard/properties/${result.property?.id}`);
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" disabled={isLoading}>
          Legg til eiendom
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Legg til eiendom</DialogTitle>
            <DialogDescription>
              Skriv inn navnet på den nye eiendommen eller bygningen
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 pt-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="propertyName" className="col-span-1 text-right">
                Navn
              </Label>
              <Input
                id="propertyName"
                name="propertyName"
                placeholder="Hva kaller du byggningen..."
                className="col-span-3"
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? "Lagrer..." : "Lagre ny bygning"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
