import type { Metadata } from "next";
import Link from "next/link";
import { formatPrice, store } from "@/lib/config";
import { fetchPayment, type MoyasarPayment } from "@/lib/moyasar";
import { decodeItems, orderMessage, priceOrder } from "@/lib/order";
import { PaidActions } from "./PaidActions";

export const metadata: Metadata = { title: "نتيجة الدفع", robots: { index: false } };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ id?: string }> };

export default async function ResultPage({ searchParams }: Props) {
  const { id } = await searchParams;

  let payment: MoyasarPayment | null = null;
  let loadError = false;
  if (id) {
    try {
      payment = await fetchPayment(id);
    } catch (err) {
      console.error("Moyasar verification failed", err);
      loadError = true;
    }
  }

  if (loadError) {
    return (
      <Shell>
        <h1>تعذر التحقق من الدفع</h1>
        <p className="muted">لم نتمكن من التحقق من حالة العملية الآن. لا تُعد الدفع — تواصل معنا وسنراجعها.</p>
        <Link href="/" className="btn btn-outline">العودة للمتجر</Link>
      </Shell>
    );
  }

  if (!payment) {
    return (
      <Shell>
        <h1>لم يتم العثور على العملية</h1>
        <Link href="/checkout" className="btn btn-gold">العودة لإتمام الطلب</Link>
      </Shell>
    );
  }

  const meta = payment.metadata ?? {};
  const items = decodeItems(meta.items);
  const order = priceOrder(items);
  const isPaid = payment.status === "paid" || payment.status === "captured";
  // نعيد حساب المبلغ من الكتالوج ونطابقه مع المبلغ المدفوع فعلاً
  const amountMatches = payment.currency === store.currency && payment.amount === Math.round(order.total * 100);

  if (!isPaid) {
    return (
      <Shell>
        <h1>لم تكتمل عملية الدفع</h1>
        <p className="muted">{payment.source?.message || "تم رفض العملية أو إلغاؤها. لم يتم خصم أي مبلغ."}</p>
        <Link href="/checkout" className="btn btn-gold">حاول مرة أخرى</Link>
      </Shell>
    );
  }

  const ref = meta.order_ref || payment.id.slice(0, 8);
  const message = orderMessage({
    ref,
    items,
    customer: {
      name: meta.name || "",
      phone: meta.phone || "",
      city: meta.city || "",
      address: meta.address || "",
      notes: meta.notes,
    },
    payment: `مدفوع إلكترونياً (${formatPrice(payment.amount / 100)}) — رقم العملية ${payment.id}`,
  });

  return (
    <Shell>
      <div className="success-mark" aria-hidden="true">✓</div>
      <h1>تم الدفع بنجاح</h1>
      <p className="muted">
        شكراً {meta.name}، تم استلام طلبك رقم <strong>{ref}</strong> بمبلغ {formatPrice(payment.amount / 100)}.
      </p>
      {!amountMatches && (
        <p className="alert">المبلغ المدفوع لا يطابق قيمة الطلب الحالية، سيراجع فريقنا الطلب ويتواصل معك.</p>
      )}
      <ul className="result-lines">
        {order.lines.map((l) => (
          <li key={l.product.slug}>
            <span>{l.product.name} × {l.qty.toLocaleString("ar-SA")}</span>
            <span>{formatPrice(l.total)}</span>
          </li>
        ))}
      </ul>
      <PaidActions message={message} clearCart={meta.source === "cart"} />
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="container page">
      <div className="panel center result">{children}</div>
    </main>
  );
}
