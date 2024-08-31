"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@propdock/ui/components/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@propdock/ui/components/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@propdock/ui/components/dropdown-menu"
import { Input } from "@propdock/ui/components/input"
import { Label } from "@propdock/ui/components/label"
import { Textarea } from "@propdock/ui/components/textarea"
import { BarChart, ChevronDown, File, PlusCircle } from "lucide-react"
import { toast } from "sonner"

export function AnalystNavTop({ analysisDetails }) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [analysisName, setAnalysisName] = useState("")
  const [analysisDescription, setAnalysisDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleExportClick = () => {
    // Placeholder for export functionality
    toast.success("Export functionality to be implemented")
  }

  const handleChartClick = () => {
    setIsDialogOpen(true)
  }

  const handleCreateNewAnalysis = () => {
    // Placeholder for creating new analysis
    router.push("/analyse/new")
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      // Placeholder for submitting new chart
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Chart created successfully")
    } catch (error) {
      toast.error("Failed to create chart")
    } finally {
      setIsLoading(false)
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="flex items-center pb-2">
      <div className="ml-auto flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className="h-8 gap-1"
          onClick={handleExportClick}
        >
          <File className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Eksporter
          </span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1"
          onClick={handleChartClick}
        >
          <BarChart className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Diagram
          </span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Opprett
              </span>
              <ChevronDown className="ml-1 h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Opprett ny</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleCreateNewAnalysis}>
              Analyse
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleChartClick}>
              Diagram
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Opprett nytt diagram</DialogTitle>
            <DialogDescription>
              Skriv inn detaljene for ditt nye diagram.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="chartName">Navn på diagram</Label>
              <Input
                id="chartName"
                placeholder="Skriv inn navn på diagram"
                value={analysisName}
                onChange={(e) => setAnalysisName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="chartDescription">Beskrivelse</Label>
              <Textarea
                id="chartDescription"
                placeholder="Skriv inn beskrivelse"
                rows={4}
                value={analysisDescription}
                onChange={(e) => setAnalysisDescription(e.target.value)}
                className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button type="button" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Oppretter..." : "Opprett diagram"}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
