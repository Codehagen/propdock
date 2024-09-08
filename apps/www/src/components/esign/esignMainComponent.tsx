"use client";

import { createEsignDocument } from "@/actions/create-esign-document";
import { Button } from "@propdock/ui/components/button";
import { SendIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DragAndDrop } from "./_components/DragAndDrop";
import { ESignGeneralForm } from "./_components/ESignGeneralForm ";

export default function ESignMainComponent({
  tenantDetails
}: {
  tenantDetails: any;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  const maxSize = 10 * 1024 * 1024; // 10MB

  const onDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  };

  const handleFormSubmit = (data: any) => {
    setFormData(data);
  };

  const handleSubmit = async () => {
    if (files.length === 0 || !formData) {
      toast.error("Please select a PDF file and fill out the form.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("file", files[0]);
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("signers", JSON.stringify(formData.signers));

      const result = await createEsignDocument(data);

      if (!result.ok) {
        throw new Error(result.message || "Failed to create document");
      }

      toast.success("Dokumentet er sendt til signering.");
      // Reset form and files here if needed
    } catch (error) {
      toast.error(
        error.message || "An error occurred while creating the document."
      );
      console.error("Error creating document:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid">
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4">
          <h1 className="font-semibold text-xl">Lag e-signatur dokument</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1"
              onClick={handleSubmit}
              disabled={isSubmitting || files.length === 0 || !formData}
            >
              <SendIcon className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">
                {isSubmitting ? "Sender..." : "Send til signering"}
              </span>
            </Button>
          </div>
        </header>
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-2">
          <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4">
            <fieldset className="grid gap-6 rounded-lg border p-4">
              <legend className="-ml-1 px-1 font-medium text-sm">PDF</legend>
              <DragAndDrop
                onDrop={onDrop}
                accept={{
                  "application/pdf": [".pdf"]
                }}
                maxSize={maxSize}
                maxFiles={1}
                multiple={false}
              />
            </fieldset>
          </div>
          <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4">
            <fieldset className="grid gap-6 rounded-lg border p-4">
              <legend className="-ml-1 px-1 font-medium text-sm">
                Generelt
              </legend>
              <ESignGeneralForm onFormSubmit={handleFormSubmit} />
            </fieldset>
          </div>
        </main>
      </div>
    </div>
  );
}
