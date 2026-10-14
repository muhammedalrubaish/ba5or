"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { MoyasarForm } from "@/components/MoyasarForm";
import { ProductArt } from "@/components/ProductArt";
import { WhatsAppIcon } from "@/components/WhatsAppFloat";
import { useCart } from "@/lib/cart";
import {
  bank,
  bankConfigured,
  cities,
  formatIban,
  formatPrice,
  onlineMethods,
  onlinePaymentEnabled,
  store,
  whatsappLink,
} from "@/lib/config";
import {
  decodeItems,
  encodeItems,
  isValidSaudiPhone,
  newOrderRef,
  normalizeDigits,
  orderMessage,
  priceOrder,
  type Customer,
} from "@/lib/order";

type Method = "bank" | "online" | "cod";

const methodLabel: Record<Method, string> = {
  bank: "تحويل بنكي (آيبان)",
  online: "دفع إلكتروني",
  cod: "الدفع عند الاستلام",
};
type Step = "form" | "pay" | "done";

const emptyCustomer: Customer = { name: "", phone: "", city: "", address: "", notes: "" };

export function CheckoutClient() {
  const params = useSearchParams();
  const buy = params.get("buy");
  const cart = useCart();

  const items = useMemo(() => (buy ? decodeItems(buy) : cart.items), [buy, cart.items]);
  const order = priceOrder(items);
  const source = buy ? "quick" : "cart";

  const [customer, setCustomer] = useState<Customer>(emptyCustomer);
  const [method, setMethod] = useState<Method>("bank");
  const [paidTotal, setPaidTotal] = useState(0);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Customer, string>>>({});
  const [step, setStep] = useState<Step>("form");
  const [ref, setRef] = useState("");
  const [waUrl, setWaUrl] = useState("");
  const [callbackUrl, setCallbackUrl] = useState("");

  if (!buy && !cart.ready) return <p className="muted">جارٍ التحميل…</p>;

  if (step === "done" && method === "bank") {
    const copyIban = async () => {
      try {
        await navigator.clipboard.writeText(bank.iban.replace(/\s/g, ""));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
    };
    return (
      <div className="panel center">
        <h2>تم تسجيل طلبك رقم {ref}</h2>
        <p className="muted">حوّل مبلغ الطلب إلى الحساب التالي، ثم أرسل صورة إيصال التحويل عبر واتساب لنبدأ تجهيز طلبك.</p>
        <div className="bank-box">
          <div className="bank-row"><span>المبلغ</span><strong>{formatPrice(paidTotal)}</strong></div>
          {bankConfigured ? (
            <>
              {bank.name && <div className="bank-row"><span>البنك</span><strong>{bank.name}</strong></div>}
              <div className="bank-row"><span>اسم المستفيد</span><strong>{bank.holder}</strong></div>
              <div className="bank-iban">
                <span>رقم الآيبان</span>
                <strong dir="ltr">{formatIban(bank.iban)}</strong>
                <button type="button" className="btn btn-outline" onClick={copyIban}>
                  {copied ? "تم النسخ ✓" : "نسخ الآيبان"}
                </button>
              </div>
            </>
          ) : (
            <p className="muted small">سنرسل لك بيانات الحساب البنكي عبر واتساب فور استلام طلبك.</p>
          )}
          <div className="bank-row"><span>اكتب في وصف التحويل</span><strong dir="ltr">{ref}</strong></div>
        </div>
        <a className="btn btn-wa" href={waUrl} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon size={20} /> أرسل الطلب وإيصال التحويل عبر واتساب
        </a>
        <Link href="/" className="btn btn-outline">العودة للمتجر</Link>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div className="panel center">
        <h2>تم تجهيز طلبك رقم {ref}</h2>
        <p className="muted">
          أرسل رسالة الطلب عبر واتساب لتأكيده، وسنتواصل معك لتحديد موعد التوصيل والدفع عند الاستلام.
        </p>
        <a className="btn btn-wa" href={waUrl} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon size={20} /> إرسال الطلب عبر واتساب
        </a>
        <Link href="/" className="btn btn-outline">العودة للمتجر</Link>
      </div>
    );
  }

  if (order.lines.length === 0) {
    return (
      <div className="panel center">
        <p>لا توجد منتجات في طلبك.</p>
        <Link href="/#products" className="btn btn-gold">تصفح المنتجات</Link>
      </div>
    );
  }

  const set = (field: keyof Customer) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setCustomer((c) => ({ ...c, [field]: e.target.value }));

  function validate() {
    const next: typeof errors = {};
    if (customer.name.trim().length < 3) next.name = "اكتب الاسم الكامل";
    if (!isValidSaudiPhone(customer.phone)) next.phone = "رقم جوال سعودي يبدأ بـ 05 (10 أرقام)";
    if (!customer.city) next.city = "اختر المدينة";
    if (customer.address.trim().length < 8) next.address = "اكتب العنوان بالتفصيل (الحي، الشارع)";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const orderRef = newOrderRef();
    const cleanCustomer = { ...customer, phone: normalizeDigits(customer.phone).replace(/\s/g, "") };
    setCustomer(cleanCustomer);
    setRef(orderRef);

    if (method === "online") {
      const origin = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      setCallbackUrl(`${origin.replace(/\/$/, "")}/checkout/result`);
      setStep("pay");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const message = orderMessage({
      ref: orderRef,
      items: order.lines.map((l) => ({ slug: l.product.slug, qty: l.qty })),
      customer: cleanCustomer,
      payment: methodLabel[method],
    });
    const url = whatsappLink(
      method === "bank" ? `${message}\n\n(سأرفق صورة إيصال التحويل)` : message
    );
    setWaUrl(url);
    setPaidTotal(order.total);
    setStep("done");
    if (source === "cart") cart.clear();
    window.scrollTo({ top: 0 });
    // في التحويل البنكي يرى العميل بيانات الحساب أولاً ثم يرسل الإيصال
    if (method === "cod") window.open(url, "_blank", "noopener,noreferrer");
  }

  const itemsForPayment = order.lines.map((l) => ({ slug: l.product.slug, qty: l.qty }));

  return (
    <div className="checkout">
      <section className="panel">
        {step === "form" ? (
          <form onSubmit={submit} noValidate>
            <h2>بيانات التوصيل</h2>
            <Field label="الاسم الكامل" error={errors.name}>
              <input value={customer.name} onChange={set("name")} autoComplete="name" />
            </Field>
            <Field label="رقم الجوال" error={errors.phone}>
              <input
                value={customer.phone}
                onChange={set("phone")}
                inputMode="tel"
                autoComplete="tel"
                placeholder="05xxxxxxxx"
                dir="ltr"
              />
            </Field>
            <Field label="المدينة" error={errors.city}>
              <select value={customer.city} onChange={set("city")}>
                <option value="">اختر المدينة</option>
                {cities.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="العنوان" error={errors.address}>
              <input value={customer.address} onChange={set("address")} autoComplete="street-address" placeholder="الحي، الشارع، رقم المنزل" />
            </Field>
            <Field label="ملاحظات (اختياري)">
              <textarea value={customer.notes} onChange={set("notes")} rows={2} />
            </Field>

            <h2>طريقة الدفع</h2>
            <div className="methods">
              <label className={`method ${method === "bank" ? "is-active" : ""}`}>
                <input type="radio" name="method" checked={method === "bank"} onChange={() => setMethod("bank")} />
                <span>
                  <strong>تحويل بنكي (آيبان)</strong>
                  <small>تظهر لك بيانات الحساب بعد تأكيد الطلب، ثم ترسل الإيصال عبر واتساب</small>
                </span>
              </label>
              {onlinePaymentEnabled && (
                <label className={`method ${method === "online" ? "is-active" : ""}`}>
                  <input type="radio" name="method" checked={method === "online"} onChange={() => setMethod("online")} />
                  <span>
                    <strong>دفع إلكتروني</strong>
                    <small>
                      {[
                        onlineMethods.includes("creditcard") && "مدى · فيزا · ماستركارد",
                        onlineMethods.includes("applepay") && "Apple Pay",
                        onlineMethods.includes("stcpay") && "STC Pay",
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </small>
                  </span>
                </label>
              )}
              <label className={`method ${method === "cod" ? "is-active" : ""}`}>
                <input type="radio" name="method" checked={method === "cod"} onChange={() => setMethod("cod")} />
                <span>
                  <strong>الدفع عند الاستلام</strong>
                  <small>يتم تأكيد الطلب عبر واتساب</small>
                </span>
              </label>
            </div>

            <button type="submit" className="btn btn-gold btn-block">
              {method === "online"
                ? `متابعة للدفع · ${formatPrice(order.total)}`
                : method === "bank"
                  ? `تأكيد الطلب · ${formatPrice(order.total)}`
                  : "تأكيد الطلب عبر واتساب"}
            </button>
          </form>
        ) : (
          <div>
            <div className="pay-head">
              <h2>الدفع الآمن</h2>
              <button type="button" className="link-btn" onClick={() => setStep("form")}>تعديل البيانات</button>
            </div>
            <p className="muted">
              الطلب {ref} · {customer.name} · {customer.city}
            </p>
            <MoyasarForm
              amountHalalas={Math.round(order.total * 100)}
              description={`طلب ${ref} من ${store.fullName}`}
              callbackUrl={callbackUrl}
              metadata={{
                order_ref: ref,
                items: encodeItems(itemsForPayment),
                source,
                name: customer.name.slice(0, 100),
                phone: customer.phone.slice(0, 20),
                city: customer.city,
                address: customer.address.slice(0, 250),
                notes: (customer.notes || "").slice(0, 250),
              }}
            />
            <p className="secure-note">🔒 الدفع عبر بوابة ميسر المرخّصة من البنك المركزي السعودي. لا نحتفظ ببيانات بطاقتك.</p>
          </div>
        )}
      </section>

      <aside className="panel summary">
        <h2>ملخص الطلب</h2>
        <ul className="summary-list">
          {order.lines.map(({ product, qty, total }) => (
            <li key={product.slug}>
              <ProductArt product={product} className="summary-thumb" />
              <span className="summary-name">
                {product.name}
                <small className="muted">{product.unit} × {qty.toLocaleString("ar-SA")}</small>
              </span>
              <span>{formatPrice(total)}</span>
            </li>
          ))}
        </ul>
        <div className="sum-row"><span>المجموع</span><span>{formatPrice(order.subtotal)}</span></div>
        <div className="sum-row"><span>الشحن</span><span>{order.shipping === 0 ? "مجاني" : formatPrice(order.shipping)}</span></div>
        <div className="sum-row sum-total"><span>الإجمالي</span><span>{formatPrice(order.total)}</span></div>
        {order.shipping > 0 && (
          <p className="muted small">الشحن مجاني للطلبات من {formatPrice(store.freeShippingFrom)}</p>
        )}
      </aside>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className={`field ${error ? "has-error" : ""}`}>
      <span>{label}</span>
      {children}
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}
