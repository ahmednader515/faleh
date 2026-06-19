"use client";

import { useCallback, useRef } from "react";
import { combineDateTimeLocal, splitDateTimeLocal } from "@/lib/datetime-local";

type Props = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  required?: boolean;
  id?: string;
};

/**
 * Split date + time inputs avoid iOS/Android bugs where a single datetime-local
 * picker shows 12-hour UI but writes incorrect 24-hour values to React state.
 */
export function DateTimeLocalInput({ value, onChange, className = "", required, id }: Props) {
  const { date, time } = splitDateTimeLocal(value);
  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);

  const syncFromRefs = useCallback(() => {
    const next = combineDateTimeLocal(
      dateRef.current?.value ?? "",
      timeRef.current?.value ?? "",
    );
    if (next && next !== value) onChange(next);
  }, [onChange, value]);

  const fieldClass =
    `datetime-input-themed w-full rounded-[var(--radius-btn)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm ${className}`.trim();

  const handleDate = (nextDate: string) => {
    onChange(combineDateTimeLocal(nextDate, time));
  };

  const handleTime = (nextTime: string) => {
    onChange(combineDateTimeLocal(date, nextTime));
  };

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <input
        ref={dateRef}
        type="date"
        id={id}
        value={date}
        onChange={(e) => handleDate(e.target.value)}
        onInput={(e) => handleDate(e.currentTarget.value)}
        onBlur={syncFromRefs}
        className={fieldClass}
        required={required}
      />
      <input
        ref={timeRef}
        type="time"
        value={time}
        onChange={(e) => handleTime(e.target.value)}
        onInput={(e) => handleTime(e.currentTarget.value)}
        onBlur={syncFromRefs}
        className={fieldClass}
        required={required}
      />
    </div>
  );
}
