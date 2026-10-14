"use client";

import { useFormAction } from "@/lib/use-form-action";
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
  const [state, onSubmit, pending] = useFormAction(setOrderStatus, undefined);
  return (
    <form onSubmit={onSubmit}>
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
