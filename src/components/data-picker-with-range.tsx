import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { HTMLAttributes, useEffect, useState } from "react"

export const DatePickerWithRange = ({ className, onChangeRange }: HTMLAttributes<HTMLDivElement> & { onChangeRange?: (start: string, end: string) => void }) => {
  const [date, setDate] = useState<DateRange | undefined>();

  useEffect(() => {
    if (date?.from && date?.to && onChangeRange) {
      onChangeRange(
        format(date.from, "yyyy-MM-dd"),
        format(date.to, "yyyy-MM-dd")
      );
    }
  }, [date]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-fit justify-start text-left font-normal border-gray-800",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="!w-3 !h-3" color="#8F9098" />
            {date?.from ? (
              date.to ? (
                <>
                  <span className="text-gray-160 text-xs">{format(date.from, "dd/MM/yyyy", { locale: ptBR })} - {" "}</span>
                  <span className="text-gray-160 text-xs">{format(date.to, "dd/MM/yyyy", { locale: ptBR })}</span>
                </>
              ) : (
                format(date.from, "dd/MM/yyyy", { locale: ptBR })
              )
            ) : (
              <span className="text-xs text-gray-160">Selecione uma data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            locale={ptBR}
            className="text-gray-160"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
