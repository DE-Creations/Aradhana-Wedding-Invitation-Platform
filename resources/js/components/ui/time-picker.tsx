import { useEffect, useRef, useState } from "react";
import { Clock, X } from "lucide-react";

import { cn } from "@/lib/utils";

type Period = "AM" | "PM";

const PERIODS: Period[] = ["AM", "PM"];

const pad = (n: number) => n.toString().padStart(2, "0");

/** Parses a 24-hour "HH:mm" string into 12-hour parts. */
const parseTime = (value: string) => {
  const match = /^(\d{1,2}):(\d{2})/.exec(value);
  if (!match) return null;
  const hours = Number(match[1]);
  const minute = Number(match[2]);
  if (hours > 23 || minute > 59) return null;
  return { hour: hours % 12 || 12, minute, period: (hours >= 12 ? "PM" : "AM") as Period };
};

/** Builds a 24-hour "HH:mm" string, or null while the typed parts are incomplete or out of range. */
const buildTime = (hour: string, minute: string, period: Period) => {
  if (hour === "" || minute === "") return null;
  const h = Number(hour);
  const m = Number(minute);
  if (h < 1 || h > 12 || m > 59) return null;
  return `${pad((h % 12) + (period === "PM" ? 12 : 0))}:${pad(m)}`;
};

interface TimePickerProps {
  /** 24-hour "HH:mm" value; the same format is passed to onChange. */
  value: string;
  onChange: (value: string) => void;
  /** Shows a clear button so an optional time can be emptied. */
  clearable?: boolean;
}

/** Inline "hh : mm AM|PM" field. Type any exact time, e.g. 8 : 02 AM. */
export const TimePicker = ({ value, onChange, clearable = false }: TimePickerProps) => {
  const initial = parseTime(value);
  const [hour, setHour] = useState(initial ? String(initial.hour) : "");
  const [minute, setMinute] = useState(initial ? pad(initial.minute) : "");
  const [period, setPeriod] = useState<Period>(initial?.period ?? "AM");
  const lastEmitted = useRef(value);
  const minuteRef = useRef<HTMLInputElement>(null);

  // Follow value changes that did not come from this field (e.g. data loaded after mount).
  useEffect(() => {
    if (value === lastEmitted.current) return;
    lastEmitted.current = value;
    const parts = parseTime(value);
    setHour(parts ? String(parts.hour) : "");
    setMinute(parts ? pad(parts.minute) : "");
    if (parts) setPeriod(parts.period);
  }, [value]);

  const emit = (nextHour: string, nextMinute: string, nextPeriod: Period) => {
    const next = buildTime(nextHour, nextMinute, nextPeriod);
    if (next === null) return;
    lastEmitted.current = next;
    onChange(next);
  };

  // Settle the typed text to the saved value: pads the minute and drops out-of-range input.
  const settle = () => {
    // lastEmitted is used because the parent may not have re-rendered with the new value yet.
    const parts = parseTime(lastEmitted.current);
    if (!parts) return;
    setHour(String(parts.hour));
    setMinute(pad(parts.minute));
  };

  const handleHour = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 2);
    setHour(digits);
    emit(digits, minute, period);
    if (digits.length === 2 || Number(digits) > 1) minuteRef.current?.focus();
  };

  const handleMinute = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 2);
    setMinute(digits);
    emit(hour, digits, period);
  };

  const handlePeriod = (next: Period) => {
    setPeriod(next);
    emit(hour, minute, next);
  };

  const handleClear = () => {
    setHour("");
    setMinute("");
    lastEmitted.current = "";
    onChange("");
  };

  const hourInvalid = hour !== "" && (Number(hour) < 1 || Number(hour) > 12);
  const minuteInvalid = minute !== "" && Number(minute) > 59;
  const inputClass = "w-7 bg-transparent text-center outline-none placeholder:text-muted-foreground";

  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-ring/20">
      <Clock className="mr-1 h-4 w-4 shrink-0 text-muted-foreground" />
      <input
        inputMode="numeric"
        aria-label="Hour"
        placeholder="hh"
        value={hour}
        aria-invalid={hourInvalid}
        onChange={(e) => handleHour(e.target.value)}
        onFocus={(e) => e.target.select()}
        onBlur={settle}
        className={cn(inputClass, hourInvalid && "text-destructive")}
      />
      <span className="text-muted-foreground">:</span>
      <input
        ref={minuteRef}
        inputMode="numeric"
        aria-label="Minute"
        placeholder="mm"
        value={minute}
        aria-invalid={minuteInvalid}
        onChange={(e) => handleMinute(e.target.value)}
        onFocus={(e) => e.target.select()}
        onBlur={settle}
        className={cn(inputClass, minuteInvalid && "text-destructive")}
      />
      <div className="ml-auto flex items-center gap-1">
        <div className="flex rounded-md bg-muted/60 p-0.5">
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handlePeriod(p)}
              className={cn(
                "rounded px-2 py-0.5 text-xs transition-colors",
                period === p ? "bg-primary font-medium text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              )}
            >
              {p}
            </button>
          ))}
        </div>
        {clearable && (hour !== "" || minute !== "") && (
          <button type="button" onClick={handleClear} aria-label="Clear time" className="rounded p-1 text-muted-foreground hover:text-destructive">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
