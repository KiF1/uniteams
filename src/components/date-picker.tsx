/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";

interface DatePickerProps {
  control: Control<any>;
  name: string;
}

export const DatePicker = ({ control, name }: DatePickerProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="grid gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-fit justify-start text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="!w-3 !h-3" color="#8F9098" />
                  <span className="text-gray-160 text-xs">
                    {field.value
                      ? format(field.value, "dd/MM/yyyy", { locale: ptBR })
                      : "Selecione a data"}
                  </span>
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                locale={ptBR}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
