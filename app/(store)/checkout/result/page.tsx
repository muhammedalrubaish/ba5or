import type { Metadata } from "next";
import Link from "next/link";
import { formatPrice, store } from "@/lib/config";
import { fetchPayment, type MoyasarPayment } from "@/lib/moyasar";
import { getCatalog, getOrder, updateOrder } from "@/lib/db";
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
  const ref = meta.order_ref || payment.id.slice(0, 8);
  const saved = meta.order_ref ? await getOrder(meta.order_ref).catch(() => null) : null;
  // سطور الطلب: من الطلب المحفوظ إن وُجد، وإلا نعيد حسابها من الكتالوج
  const priced = priceOrder(decodeItems(meta.items), await getCatalog());
  const lines = saved
    ? saved.lines.map((l) => ({ key: l.slug, name: l.name, qty: l.qty, total: l.total }))
    : priced.lines.map((l) => ({ key: l.product.slug, name: l.product.name, qty: l.qty, total: l.total }));
  const expectedTotal = saved ? saved.total : priced.total;
  const isPaid = payment.status === "paid" || payment.status === "captured";
  // نطابق المبلغ المدفوع فعلاً مع قيمة الطلب
  const amountMatches = payment.currency === store.currency && payment.amount === Math.round(expectedTotal * 100);

  if (isPaid && saved && saved.status === "awaiting_payment") {
    await updateOrder(saved.id, {
      status: amountMatches ? "paid" : "awaiting_payment",
      paymentId: payment.id,
      adminNote: amountMatches ? saved.adminNote : `تنبيه: المبلغ المدفوع ${payment.amount / 100} لا يطابق قيمة الطلب`,
    }).catch((err) => console.error("Failed to mark order paid", err));
  }

  if (!isPaid) {
    return (
      <Shell>
        <h1>لم تكتمل عملية الدفع</h1>
        <p className="muted">{payment.source?.message || "تم رفض العملية أو إلغاؤها. لم يتم خصم أي مبلغ."}</p>
        <Link href="/checkout" className="btn btn-gold">حاول مرة أخرى</Link>
      </Shell>
    );
  }

  const message = orderMessage({
    ref,
    lines,
    subtotal: saved ? saved.subtotal : priced.subtotal,
    shipping: saved ? saved.shipping : priced.shipping,
    total: expectedTotal,
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
        {lines.map((l) => (
          <li key={l.key}>
            <span>{l.name} × {l.qty.toLocaleString("ar-SA")}</span>
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
