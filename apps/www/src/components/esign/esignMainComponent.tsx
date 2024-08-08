"use client"

import { useState } from "react"
import { SendIcon } from "lucide-react"

import { Button } from "@dingify/ui/components/button"

import { DragAndDrop } from "./_components/DragAndDrop"
import { ESignGeneralForm } from "./_components/ESignGeneralForm "

export default function ESignMainComponent({
  tenantDetails,
}: {
  tenantDetails: any
}) {
  const [files, setFiles] = useState<File[]>([])

  const maxSize = 10 * 1024 * 1024 // 10MB

  const onDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles)
  }

  return (
    <div className="grid">
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4">
          <h1 className="text-xl font-semibold">Lag e-signatur dokument</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <SendIcon className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Send til signering</span>
            </Button>
          </div>
        </header>
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-2">
          <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4">
            <fieldset className="grid gap-6 rounded-lg border p-4">
              <legend className="-ml-1 px-1 text-sm font-medium">PDF</legend>
              <DragAndDrop
                onDrop={onDrop}
                accept={{
                  "application/pdf": [".pdf"],
                }}
                maxSize={maxSize}
                maxFiles={1}
                multiple={false}
              />
            </fieldset>
          </div>
          <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4">
            <fieldset className="grid gap-6 rounded-lg border p-4">
              <legend className="-ml-1 px-1 text-sm font-medium">
                Generelt
              </legend>
              <ESignGeneralForm />
            </fieldset>
          </div>
        </main>
      </div>
    </div>
  )
}
