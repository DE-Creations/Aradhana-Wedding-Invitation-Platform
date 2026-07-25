import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface CountdownTimerProps {
  /** Target date/time (ISO string or anything Date can parse). */
  targetDate: string | null | undefined;
  /** Wrapper class for the row of boxes. */
  className?: string;
  /** Class applied to each digit box. */
  boxClassName?: string;
  /** Class applied to the number text. */
  numberClassName?: string;
  /** Class applied to the unit label. */
  labelClassName?: string;
  /** Class applied to the ":" separators (hidden on mobile). */
  separatorClassName?: string;
}

interface TimeParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function computeParts(target: number): TimeParts {
  const distance = Math.max(0, target - Date.now());
  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000),
  };
}

/**
 * Full days/hours/minutes/seconds countdown with a flip-in animation on each
 * value change. Styling is fully driven by the *ClassName props so it can blend
 * with any template (solid or animated).
 */
export function CountdownTimer({
  targetDate,
  className = "",
  boxClassName = "",
  numberClassName = "",
  labelClassName = "",
  separatorClassName = "",
}: CountdownTimerProps) {
  const target = targetDate ? new Date(targetDate).getTime() : Date.now();
  const [parts, setParts] = useState<TimeParts>(() => computeParts(target));

  useEffect(() => {
    setParts(computeParts(target));
    const id = setInterval(() => setParts(computeParts(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units: Array<{ key: keyof TimeParts; label: string }> = [
    { key: "days", label: "Days" },
    { key: "hours", label: "Hours" },
    { key: "minutes", label: "Minutes" },
    { key: "seconds", label: "Seconds" },
  ];

  return (
    <div className={`flex flex-wrap items-start justify-center gap-2 md:gap-3 ${className}`}>
      {units.map((unit, i) => {
        const value = parts[unit.key];
        return (
          <div key={unit.key} className="flex items-start gap-2 md:gap-3">
            <div className="text-center">
              <div className={`flex h-[4.5rem] min-w-[3.75rem] items-center justify-center overflow-hidden rounded-2xl px-3 md:h-24 md:min-w-[5rem] ${boxClassName}`}>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={value}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className={`block text-4xl font-bold leading-none md:text-5xl ${numberClassName}`}
                  >
                    {String(value).padStart(2, "0")}
                  </motion.span>
                </AnimatePresence>
              </div>
              <p className={`mt-2 text-[10px] uppercase tracking-[0.25em] md:text-xs ${labelClassName}`}>
                {unit.label}
              </p>
            </div>
            {i < units.length - 1 && (
              <span className={`mt-5 hidden text-3xl font-bold md:mt-6 md:inline ${separatorClassName}`}>
                :
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default CountdownTimer;
