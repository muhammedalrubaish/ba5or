import Link from "next/link";
import { listOrders, orderStatusLabel, type OrderStatus } from "@/lib/db";
import { OrdersTable } from "../OrdersTable";

type Props = { searchParams: Promise<{ status?: string }> };

export default async function OrdersPage({ searchParams }: Props) {
  const { status } = await searchParams;
  const all = await listOrders(500);
  const orders =
    status === "open"
      ? all.filter((o) => o.status === "new" || o.status === "awaiting_payment")
      : status && status in orderStatusLabel
        ? all.filter((o) => o.status === status)
        : all;

  const filters: { key?: string; label: string }[] = [
    { label: "الكل" },
    { key: "open", label: "تحتاج متابعة" },
    ...(Object.keys(orderStatusLabel) as OrderStatus[]).map((k) => ({ key: k, label: orderStatusLabel[k] })),
  ];

  return (
    <>
      <h1 className="mgr-title">الطلبات</h1>
      <div className="mgr-filters">
        {filters.map((f) => (
          <Link
            key={f.label}
            href={f.key ? `/manager/orders?status=${f.key}` : "/manager/orders"}
            className={`chip ${status === f.key ? "is-active" : ""}`}
          >
            {f.label}
          </Link>
        ))}
      </div>
      <OrdersTable orders={orders} />
    </>
  );
}
