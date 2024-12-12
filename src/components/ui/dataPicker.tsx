"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface DatePickerProps {
  className?: string;
  value: Date | null;
  onSelect: (value: Date | null) => void;
  extended?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  className,
  value,
  onSelect,
  extended = false,
}) => {
  const [hours, setHours] = useState<number>(value ? value.getHours() : 0);
  const [minutes, setMinutes] = useState<number>(
    value ? value.getMinutes() : 0
  );

  const handleTimeChange = (newHours: number, newMinutes: number): void => {
    if (!value) return;
    const updatedDate: Date = new Date(value);
    updatedDate.setHours(newHours);
    updatedDate.setMinutes(newMinutes);
    onSelect(updatedDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild className={className}>
        <Button
          variant="outline"
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 flex flex-col w-64 z-[999]">
        <Calendar
          mode="single"
          selected={value !== null ? value : undefined}
          onSelect={(val: Date | undefined) => onSelect(val ?? null)}
          initialFocus
        />
        {extended && (
          <div className="flex flex-row gap-2 px-2 pb-2">
            <Input
              type="number"
              max="23"
              className="w-1/2"
              value={hours.toString()}
              onChange={(e) => {
                const h: number = parseInt(e.target.value, 10);
                setHours(h);
                if (value) handleTimeChange(h, minutes);
              }}
            />
            <Input
              type="number"
              max="59"
              className="w-1/2"
              value={minutes.toString()}
              onChange={(e) => {
                const m: number = parseInt(e.target.value, 10);
                setMinutes(m);
                if (value) handleTimeChange(hours, m);
              }}
            />
          </div>
        )}
        <Button
          variant="outline"
          onClick={() => onSelect(null)}
          className="m-2"
        >
          Clear
        </Button>
      </PopoverContent>
    </Popover>
  );
};
