/* eslint-disable @typescript-eslint/no-explicit-any */
import { Control } from "react-hook-form";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type DateTimePickerProps = {
  control: Control<any>;
  name: string;
};

export const DateTimePicker = ({ control, name }: DateTimePickerProps) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full xl:w-[150px] pl-3 text-start font-normal text-gray-160 text-xs",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "dd/MM/yyyy HH:mm", { locale: ptBR })
                  ) : (
                    <span className="text-gray-160 text-xs">DD/MM/AAAA HH:mm</span>
                  )}
                  <CalendarIcon className="!w-3 !h-3" color="#8F9098" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <div className="sm:flex">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date: any) => field.onChange(date)}
                  initialFocus
                  locale={ptBR}
                />
                <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                  <ScrollArea className="w-64 sm:w-auto">
                    <div className="flex sm:flex-col p-2">
                      {Array.from({ length: 24 }, (_, i) => i).reverse().map((hour) => (
                        <Button
                          key={hour}
                          size="icon"
                          variant={field.value && field.value.getHours() === hour ? "default" : "ghost"}
                          className="sm:w-full shrink-0 aspect-square"
                          onClick={() => {
                            const newDate = new Date(field.value || new Date());
                            newDate.setHours(hour);
                            field.onChange(newDate);
                          }}
                        >
                          {hour}
                        </Button>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="sm:hidden" />
                  </ScrollArea>
                  <ScrollArea className="w-64 sm:w-auto">
                    <div className="flex sm:flex-col p-2">
                      {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                        <Button
                          key={minute}
                          size="icon"
                          variant={field.value && field.value.getMinutes() === minute ? "default" : "ghost"}
                          className="sm:w-full shrink-0 aspect-square"
                          onClick={() => {
                            const newDate = new Date(field.value || new Date());
                            newDate.setMinutes(minute);
                            field.onChange(newDate);
                          }}
                        >
                          {minute.toString().padStart(2, "0")}
                        </Button>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="sm:hidden" />
                  </ScrollArea>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
