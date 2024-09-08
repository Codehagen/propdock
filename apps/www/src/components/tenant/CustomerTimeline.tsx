"use client";

import { Button } from "@propdock/ui/components/button";
import { Calendar } from "@propdock/ui/components/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@propdock/ui/components/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@propdock/ui/components/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@propdock/ui/components/select";
import { format, parseISO } from "date-fns";
import { nb } from "date-fns/locale";
import {
  CalendarIcon,
  FileCheck,
  FileText,
  FileUp,
  PhoneCall
} from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

const timelineItems = [
  {
    type: "call",
    date: "2024-05-10",
    time: "14:30",
    description: "Telefonsamtale med leietaker angående vedlikehold",
    details:
      "Leietaker rapporterte problemer med ventilasjonsanlegget. Avtalt inspeksjon neste uke."
  },
  {
    type: "note",
    date: "2024-06-15",
    time: "09:15",
    description: "Notat om leietakers preferanser",
    details:
      "Leietaker foretrekker e-postkommunikasjon for ikke-akutte saker. Interessert i å diskutere muligheter for utvidelse av leieareal."
  },
  {
    type: "file_added",
    date: "2024-07-03",
    time: "11:45",
    description: "Lastet opp vedlikeholdsrapport",
    details:
      'Lastet opp detaljert rapport om bygningens tilstand. Filnavn: "Vedlikeholdsrapport_2024_Q2.pdf"'
  },
  {
    type: "file_signed",
    date: "2024-08-01",
    time: "16:00",
    description: "Leiekontrakt signert og returnert av leietaker",
    details:
      "Mottatt signert leiekontrakt for neste års leieperiode. Kontraktsnummer: LK-2024-08-01-001"
  },
  {
    type: "call",
    date: "2024-08-22",
    time: "10:00",
    description: "Oppfølgingssamtale om leietilpasninger",
    details:
      "Diskuterte tidslinje for planlagte oppgraderinger. Leietaker ønsket månedlige oppdateringer via e-post."
  }
];

const getIcon = type => {
  switch (type) {
    case "call":
      return <PhoneCall className="h-4 w-4" />;
    case "note":
      return <FileText className="h-4 w-4" />;
    case "file_added":
      return <FileUp className="h-4 w-4" />;
    case "file_signed":
      return <FileCheck className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

export default function CustomerTimeline() {
  const [filter, setFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const filteredItems = timelineItems.filter(item => {
    const itemDate = parseISO(item.date);
    const typeMatch = filter === "all" || item.type === filter;
    const dateMatch =
      (!dateRange.from || itemDate >= dateRange.from) &&
      (!dateRange.to || itemDate <= dateRange.to);
    return typeMatch && dateMatch;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <Select onValueChange={setFilter} defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer etter type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle interaksjoner</SelectItem>
            <SelectItem value="call">Telefonsamtaler</SelectItem>
            <SelectItem value="note">Notater</SelectItem>
            <SelectItem value="file_added">Filer lagt til</SelectItem>
            <SelectItem value="file_signed">Signerte dokumenter</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[180px] justify-start text-left font-normal",
                  !dateRange.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  format(dateRange.from, "d. MMMM yyyy", { locale: nb })
                ) : (
                  <span>Startdato</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateRange.from}
                onSelect={date =>
                  setDateRange(prev => ({ ...prev, from: date }))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[180px] justify-start text-left font-normal",
                  !dateRange.to && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.to ? (
                  format(dateRange.to, "d. MMMM yyyy", { locale: nb })
                ) : (
                  <span>Sluttdato</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateRange.to}
                onSelect={date => setDateRange(prev => ({ ...prev, to: date }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="relative">
        <div className="absolute top-0 bottom-0 left-4 w-px bg-muted-foreground/20" />
        {filteredItems.map((item, index) => (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <div className="mb-8 flex cursor-pointer items-center rounded-lg p-2 transition-colors hover:bg-muted/50">
                <div className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-muted-foreground/20 bg-background">
                  {getIcon(item.type)}
                </div>
                <div className="ml-12">
                  <p className="font-semibold text-sm">
                    {format(parseISO(item.date), "d. MMMM yyyy", {
                      locale: nb
                    })}{" "}
                    kl. {item.time}
                  </p>
                  <p className="mt-1 text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{item.description}</DialogTitle>
              </DialogHeader>
              <div className="mt-2">
                <p className="text-muted-foreground text-sm">
                  {format(parseISO(item.date), "d. MMMM yyyy", {
                    locale: nb
                  })}{" "}
                  kl. {item.time}
                </p>
                <p className="mt-4">{item.details}</p>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
