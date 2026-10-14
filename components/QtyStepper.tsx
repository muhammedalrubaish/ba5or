"use client";

import { MAX_QTY } from "@/lib/order";

export function QtyStepper({
  value,
  onChange,
  min = 1,
  small = false,
}: {
  value: number;
  onChange: (qty: number) => void;
  min?: number;
  small?: boolean;
}) {
  return (
    <div className={`qty ${small ? "qty-sm" : ""}`}>
      <button type="button" onClick={() => onChange(Math.min(MAX_QTY, value + 1))} aria-label="زيادة الكمية" disabled={value >= MAX_QTY}>
        +
      </button>
      <span aria-live="polite">{value.toLocaleString("ar-SA")}</span>
      <button type="button" onClick={() => onChange(value - 1)} aria-label="إنقاص الكمية" disabled={value <= min}>
        −
      </button>
    </div>
  );
}
