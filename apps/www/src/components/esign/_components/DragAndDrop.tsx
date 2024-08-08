import { UploadIcon } from "lucide-react"
import { DropzoneOptions, useDropzone } from "react-dropzone"

import { cn } from "@/lib/utils"

interface DragAndDropProps extends DropzoneOptions {
  className?: string
  maxSize: number
}

export function DragAndDrop({
  className,
  maxSize,
  ...dropzoneOptions
}: DragAndDropProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    ...dropzoneOptions,
    maxSize,
  })

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
      {isDragActive ? (
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
