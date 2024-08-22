import { useState } from "react"
import { Button } from "@propdock/ui/components/button"
import { FileIcon, UploadIcon, XIcon } from "lucide-react"
import { DropzoneOptions, useDropzone } from "react-dropzone"

import { cn } from "@/lib/utils"

interface DragAndDropProps extends DropzoneOptions {
  className?: string
  maxSize: number
}

export function DragAndDrop({
  className,
  maxSize,
  onDrop,
  ...dropzoneOptions
}: DragAndDropProps) {
  const [file, setFile] = useState<File | null>(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    ...dropzoneOptions,
    maxSize,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0])
        if (onDrop) onDrop(acceptedFiles)
      }
    },
  })

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation()
    setFile(null)
    if (onDrop) onDrop([])
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25",
        "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isDragActive && "border-muted-foreground/50",
        className,
      )}
    >
      <input {...getInputProps()} />
      {file ? (
        <div className="flex flex-col items-center justify-center gap-2">
          <FileIcon className="h-10 w-10 text-muted-foreground" />
          <p className="font-medium text-muted-foreground">{file.name}</p>
          <p className="text-sm text-muted-foreground/70">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemoveFile}
            className="mt-2"
          >
            <XIcon className="mr-2 h-4 w-4" />
            Fjern fil
          </Button>
        </div>
      ) : isDragActive ? (
        <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
          <div className="rounded-full border border-dashed p-3">
            <UploadIcon
              className="h-7 w-7 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
          <p className="font-medium text-muted-foreground">Slipp filene her</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
          <div className="rounded-full border border-dashed p-3">
            <UploadIcon
              className="h-7 w-7 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
          <div className="flex flex-col gap-px">
            <p className="font-medium text-muted-foreground">
              Dra og slipp filer her, eller klikk for å velge filer
            </p>
            <p className="text-sm text-muted-foreground/70">
              Du kan laste opp en fil på opptil{" "}
              {(maxSize / (1024 * 1024)).toFixed(0)}
              MB
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
