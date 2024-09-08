"use client";

import { createWorkspace } from "@/actions/create-workspace";
import { Button } from "@propdock/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@propdock/ui/components/dialog";
import { Input } from "@propdock/ui/components/input";
import { Label } from "@propdock/ui/components/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function AddWorkspaceButton() {
  const [workspaceName, setWorkspaceName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async event => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const result = await createWorkspace(workspaceName);

      if (!result.success) {
        throw new Error(result.error || "Feil ved oppretting av workspace.");
      }

      toast.success(`Workspace "${workspaceName}" ble lagt til.`);
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
          Legg til workspace
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Legg til nytt workspace</DialogTitle>
            <DialogDescription>
              Skriv inn navnet på det nye workspace
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 pt-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="workspaceName">Navn</Label>
              <Input
                id="workspaceName"
                name="workspaceName"
                placeholder="Navn..."
                className="col-span-3"
                value={workspaceName}
                onChange={e => setWorkspaceName(e.target.value)}
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
              {isLoading ? "Lagrer..." : "Legg til workspace"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
