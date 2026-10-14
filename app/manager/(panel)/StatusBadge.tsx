import { orderStatusLabel, type OrderStatus } from "@/lib/db";

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`status status-${status}`}>{orderStatusLabel[status]}</span>;
}
