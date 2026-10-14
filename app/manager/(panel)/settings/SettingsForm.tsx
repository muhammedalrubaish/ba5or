"use client";

import { useFormAction } from "@/lib/use-form-action";
import { saveStoreSettings } from "@/app/manager/actions";
import { formatIban, type StoreSettings } from "@/lib/settings";

export function SettingsForm({ settings }: { settings: StoreSettings }) {
  const [state, onSubmit, pending] = useFormAction(saveStoreSettings, undefined);

  return (
    <form onSubmit={onSubmit} className="mgr-settings">
      <section className="panel">
        <h2>الحساب البنكي (التحويل بالآيبان)</h2>
        <p className="muted small">
          تظهر هذه البيانات للعميل بعد تأكيد طلبه بالتحويل البنكي. إن تركتها فارغة يُبلَّغ العميل أن البيانات ستُرسل له عبر واتساب.
        </p>
        <label className="field">
          <span>اسم البنك</span>
          <input name="bankName" defaultValue={settings.bank.name} placeholder="مثل: مصرف الراجحي" />
        </label>
        <label className="field">
          <span>اسم صاحب الحساب (كما هو في البنك)</span>
          <input name="holder" defaultValue={settings.bank.holder} />
        </label>
        <label className="field">
          <span>رقم الآيبان</span>
          <input
            name="iban"
            defaultValue={settings.bank.iban ? formatIban(settings.bank.iban) : ""}
            placeholder="SA00 0000 0000 0000 0000 0000"
            dir="ltr"
            autoComplete="off"
            spellCheck={false}
          />
        </label>
      </section>

      <section className="panel">
        <h2>الشحن</h2>
        <div className="mgr-row">
          <label className="field">
            <span>رسوم الشحن (ر.س)</span>
            <input name="shippingFee" type="number" min="0" step="0.01" defaultValue={settings.shippingFee} dir="ltr" required />
          </label>
          <label className="field">
            <span>شحن مجاني للطلبات من (ر.س)</span>
            <input name="freeShippingFrom" type="number" min="0" step="0.01" defaultValue={settings.freeShippingFrom} dir="ltr" required />
          </label>
        </div>
        <p className="muted small">لجعل الشحن مجانياً دائماً اكتب 0 في «شحن مجاني للطلبات من».</p>
      </section>

      <section className="panel">
        <h2>أسعار المنتجات</h2>
        <p className="muted">
          تُعدّل الأسعار من صفحة <a href="/manager/products" className="mgr-link">المنتجات</a> ← «تعديل» على المنتج.
        </p>
      </section>

      {state?.error && <p className="alert">{state.error}</p>}
      {state?.ok && <p className="ok-note">{state.ok} ✓</p>}
      <button className="btn btn-gold" disabled={pending}>{pending ? "جارٍ الحفظ…" : "حفظ الإعدادات"}</button>
    </form>
  );
}
