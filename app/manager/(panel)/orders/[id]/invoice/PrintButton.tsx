"use client";

export function PrintButton() {
  return (
    <button type="button" className="btn btn-gold" onClick={() => window.print()}>
      طباعة / حفظ PDF
    </button>
  );
}
