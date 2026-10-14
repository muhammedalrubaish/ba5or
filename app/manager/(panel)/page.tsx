import Link from "next/link";
import { formatPrice } from "@/lib/config";
import { getCatalog, getSettingsFresh, listOrders } from "@/lib/db";
import { bankConfigured } from "@/lib/settings";
import { riyadhDayKey } from "@/lib/format";
import { OrdersTable } from "./OrdersTable";

export default async function Dashboard() {
  const [orders, catalog, settings] = await Promise.all([listOrders(500), getCatalog(), getSettingsFresh()]);
  const today = riyadhDayKey(Date.now());
  const todays = orders.filter((o) => riyadhDayKey(o.createdAt) === today);
  const pending = orders.filter((o) => o.status === "new" || o.status === "awaiting_payment");
  const sales = orders
    .filter((o) => o.status === "paid" || o.status === "shipped" || o.status === "delivered")
    .reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: "طلبات تحتاج متابعة", value: pending.length.toLocaleString("ar-SA"), href: "/manager/orders?status=open" },
    { label: "طلبات اليوم", value: todays.length.toLocaleString("ar-SA"), href: "/manager/orders" },
    { label: "المبيعات المؤكدة", value: formatPrice(sales), href: "/manager/orders" },
    { label: "المنتجات الظاهرة", value: catalog.filter((p) => !p.hidden).length.toLocaleString("ar-SA"), href: "/manager/products" },
  ];

  return (
    <>
      <h1 className="mgr-title">الرئيسية</h1>
      {!bankConfigured(settings) && (
        <p className="alert">
          لم تُضف بيانات الآيبان بعد، فلا يرى عملاء التحويل البنكي رقم الحساب.{" "}
          <Link href="/manager/settings" className="mgr-link">أضفها من الإعدادات</Link>
        </p>
      )}
      <div className="mgr-stats">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="mgr-stat">
            <span className="muted">{s.label}</span>
            <strong>{s.value}</strong>
          </Link>
        ))}
      </div>
      <div className="mgr-section-head">
        <h2>أحدث الطلبات</h2>
        <Link href="/manager/orders" className="mgr-link">كل الطلبات</Link>
      </div>
      <OrdersTable orders={orders.slice(0, 10)} />
    </>
  );
}
