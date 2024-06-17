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
        throw new Error(result.error || "Failed to add property");
      }

      toast.success(`Property "${propertyName}" created successfully.`);

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
          Add New Property
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Add new property</DialogTitle>
            <DialogDescription>
              Enter the name of the new property.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 pt-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="propertyName" className="col-span-1 text-right">
                Property Name
              </Label>
              <Input
                id="propertyName"
                name="propertyName"
                placeholder="Property Name..."
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
              {isLoading ? "Saving..." : "Save new property"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
