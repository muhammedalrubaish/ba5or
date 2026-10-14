import Link from "next/link";
import { notFound } from "next/navigation";
import { LogoMark } from "@/components/Logo";
import { formatPrice, store } from "@/lib/config";
import { getOrder, orderStatusLabel } from "@/lib/db";
import { formatDate, invoiceNumber } from "@/lib/format";
import { paymentMethodLabel } from "@/lib/order";
import { PrintButton } from "./PrintButton";

type Props = { params: Promise<{ id: string }> };

export default async function InvoicePage({ params }: Props) {
  const order = await getOrder((await params).id);
  if (!order) notFound();
  const c = order.customer;

  return (
    <>
      <div className="invoice-actions no-print">
        <Link href={`/manager/orders/${order.id}`} className="btn btn-outline">رجوع للطلب</Link>
        <PrintButton />
      </div>

      <article className="invoice">
        <header className="invoice-head">
          <div className="invoice-brand">
            <LogoMark size={56} id="invoice-logo" />
            <div>
              <strong>{store.fullName}</strong>
              <span dir="ltr">{store.whatsappDisplay}</span>
            </div>
          </div>
          <div className="invoice-meta">
            <h1>فاتورة</h1>
            <p><span>رقم الفاتورة</span><strong dir="ltr">{invoiceNumber(order.invoiceNo)}</strong></p>
            <p><span>رقم الطلب</span><strong dir="ltr">{order.id}</strong></p>
            <p><span>التاريخ</span><strong>{formatDate(order.createdAt)}</strong></p>
          </div>
        </header>

        <section className="invoice-to">
          <h2>فاتورة إلى</h2>
          <p><strong>{c.name}</strong></p>
          <p dir="ltr" className="invoice-phone">{c.phone}</p>
          <p>{c.city} — {c.address}</p>
        </section>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>#</th>
              <th>المنتج</th>
              <th>سعر الوحدة</th>
              <th>الكمية</th>
              <th>الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            {order.lines.map((l, i) => (
              <tr key={l.slug}>
                <td>{(i + 1).toLocaleString("ar-SA")}</td>
                <td>{l.name}<br /><small>{l.unit}</small></td>
                <td>{formatPrice(l.price)}</td>
                <td>{l.qty.toLocaleString("ar-SA")}</td>
                <td>{formatPrice(l.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="invoice-totals">
          <p><span>المجموع</span><span>{formatPrice(order.subtotal)}</span></p>
          <p><span>الشحن</span><span>{order.shipping === 0 ? "مجاني" : formatPrice(order.shipping)}</span></p>
          <p className="invoice-grand"><span>الإجمالي المستحق</span><span>{formatPrice(order.total)}</span></p>
        </div>

        <footer className="invoice-foot">
          <p>طريقة الدفع: {paymentMethodLabel[order.method]} · الحالة: {orderStatusLabel[order.status]}</p>
          <p>شكراً لتسوقكم من {store.fullName}</p>
        </footer>
      </article>
    </>
  );
}
