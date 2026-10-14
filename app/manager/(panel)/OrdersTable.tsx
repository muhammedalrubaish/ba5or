import Link from "next/link";
import { formatPrice } from "@/lib/config";
import type { StoredOrder } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import { paymentMethodLabel } from "@/lib/order";
import { StatusBadge } from "./StatusBadge";

export function OrdersTable({ orders }: { orders: StoredOrder[] }) {
  if (orders.length === 0) return <p className="muted panel">لا توجد طلبات بعد.</p>;
  return (
    <div className="mgr-table-wrap">
      <table className="mgr-table">
        <thead>
          <tr>
            <th>الطلب</th>
            <th>التاريخ</th>
            <th>العميل</th>
            <th>المبلغ</th>
            <th>الدفع</th>
            <th>الحالة</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td><Link href={`/manager/orders/${o.id}`} className="mgr-link" dir="ltr">{o.id}</Link></td>
              <td className="muted">{formatDateTime(o.createdAt)}</td>
              <td>{o.customer.name}<br /><small className="muted">{o.customer.city}</small></td>
              <td><strong>{formatPrice(o.total)}</strong></td>
              <td className="muted">{paymentMethodLabel[o.method]}</td>
              <td><StatusBadge status={o.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
