"use client";

import { useActionState } from "react";
import { setOrderStatus } from "@/app/manager/actions";
import type { OrderStatus } from "@/lib/db";

const options: [OrderStatus, string][] = [
  ["new", "جديد"],
  ["awaiting_payment", "بانتظار الدفع"],
  ["paid", "مدفوع"],
  ["shipped", "تم الشحن"],
  ["delivered", "تم التسليم"],
  ["cancelled", "ملغي"],
];

export function StatusForm({ id, status, adminNote }: { id: string; status: OrderStatus; adminNote?: string }) {
  const [state, action, pending] = useActionState(setOrderStatus, undefined);
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <label className="field">
        <span>الحالة</span>
        <select name="status" defaultValue={status}>
          {options.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>ملاحظة داخلية (لا يراها العميل)</span>
        <textarea name="adminNote" rows={2} defaultValue={adminNote} />
      </label>
      {state?.error && <p className="alert">{state.error}</p>}
      {state?.ok && <p className="ok-note">{state.ok} ✓</p>}
      <button className="btn btn-gold btn-block" disabled={pending}>{pending ? "جارٍ الحفظ…" : "حفظ"}</button>
    </form>
  );
}
