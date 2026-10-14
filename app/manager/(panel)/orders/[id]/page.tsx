import Link from "next/link";
import { notFound } from "next/navigation";
import { WhatsAppIcon } from "@/components/WhatsAppFloat";
import { formatPrice, store } from "@/lib/config";
import { getOrder } from "@/lib/db";
import { customerWhatsapp, formatDateTime, invoiceNumber } from "@/lib/format";
import { paymentMethodLabel } from "@/lib/order";
import { StatusBadge } from "../../StatusBadge";
import { StatusForm } from "./StatusForm";

type Props = { params: Promise<{ id: string }> };

export default async function OrderPage({ params }: Props) {
  const order = await getOrder((await params).id);
  if (!order) notFound();
  const c = order.customer;

  return (
    <>
      <div className="mgr-section-head">
        <h1 className="mgr-title" dir="ltr">{order.id}</h1>
        <StatusBadge status={order.status} />
      </div>
      <p className="muted">
        {formatDateTime(order.createdAt)} · فاتورة {invoiceNumber(order.invoiceNo)} · {paymentMethodLabel[order.method]}
        {order.paymentId && <> · رقم العملية <span dir="ltr">{order.paymentId}</span></>}
      </p>

      <div className="mgr-grid">
        <section className="panel">
          <h2>المنتجات</h2>
          <table className="mgr-table">
            <thead>
              <tr><th>المنتج</th><th>السعر</th><th>الكمية</th><th>الإجمالي</th></tr>
            </thead>
            <tbody>
              {order.lines.map((l) => (
                <tr key={l.slug}>
                  <td>{l.name}<br /><small className="muted">{l.unit}</small></td>
                  <td>{formatPrice(l.price)}</td>
                  <td>{l.qty.toLocaleString("ar-SA")}</td>
                  <td>{formatPrice(l.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="sum-row"><span>المجموع</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="sum-row"><span>الشحن</span><span>{order.shipping === 0 ? "مجاني" : formatPrice(order.shipping)}</span></div>
          <div className="sum-row sum-total"><span>الإجمالي</span><span>{formatPrice(order.total)}</span></div>
          <Link href={`/manager/orders/${order.id}/invoice`} className="btn btn-gold">عرض الفاتورة وطباعتها</Link>
        </section>

        <aside className="mgr-side">
          <section className="panel">
            <h2>العميل</h2>
            <p className="mgr-kv"><span>الاسم</span><strong>{c.name}</strong></p>
            <p className="mgr-kv"><span>الجوال</span><strong dir="ltr">{c.phone}</strong></p>
            <p className="mgr-kv"><span>المدينة</span><strong>{c.city}</strong></p>
            <p className="mgr-kv"><span>العنوان</span><strong>{c.address}</strong></p>
            {c.notes && <p className="mgr-kv"><span>ملاحظات</span><strong>{c.notes}</strong></p>}
            <a
              className="btn btn-wa btn-block"
              href={customerWhatsapp(c.phone, `مرحباً ${c.name}، بخصوص طلبك رقم ${order.id} من ${store.fullName}`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon size={18} /> مراسلة العميل
            </a>
          </section>
          <section className="panel">
            <h2>تحديث الحالة</h2>
            <StatusForm id={order.id} status={order.status} adminNote={order.adminNote} />
          </section>
        </aside>
      </div>
    </>
  );
}
