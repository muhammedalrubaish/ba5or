"use client";

import { useActionState, useState } from "react";
import { saveProduct } from "@/app/manager/actions";
import { categories, type Product } from "@/lib/products";

export function ProductForm({ product, blobEnabled }: { product?: Product; blobEnabled: boolean }) {
  const [state, action, pending] = useActionState(saveProduct, undefined);
  const [preview, setPreview] = useState<string | undefined>(product?.image);

  return (
    <form action={action} className="panel mgr-product-form">
      <input type="hidden" name="originalSlug" value={product?.slug ?? ""} />

      <div className="mgr-form-grid">
        <div>
          <label className="field">
            <span>اسم المنتج *</span>
            <input name="name" defaultValue={product?.name} required />
          </label>
          <label className="field">
            <span>وصف قصير (يظهر في البطاقة)</span>
            <input name="short" defaultValue={product?.short} />
          </label>
          <label className="field">
            <span>الوصف الكامل</span>
            <textarea name="description" rows={4} defaultValue={product?.description} />
          </label>
          <div className="mgr-row">
            <label className="field">
              <span>السعر (ر.س) *</span>
              <input name="price" type="number" step="0.01" min="0" defaultValue={product?.price} required dir="ltr" />
            </label>
            <label className="field">
              <span>السعر قبل الخصم</span>
              <input name="oldPrice" type="number" step="0.01" min="0" defaultValue={product?.oldPrice} dir="ltr" />
            </label>
          </div>
          <div className="mgr-row">
            <label className="field">
              <span>الوزن / الوحدة</span>
              <input name="unit" defaultValue={product?.unit} placeholder="مثل: 50 غرام" />
            </label>
            <label className="field">
              <span>التصنيف</span>
              <select name="category" defaultValue={product?.category ?? "عود"}>
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
          </div>
          <div className="mgr-row">
            <label className="field">
              <span>شارة (اختياري)</span>
              <input name="badge" defaultValue={product?.badge} placeholder="جديد، فاخر، عرض…" />
            </label>
            <label className="field">
              <span>نوتات الرائحة (افصل بفاصلة)</span>
              <input name="notes" defaultValue={product?.notes.join("، ")} placeholder="خشبي، ترابي" />
            </label>
          </div>
          <label className="mgr-check">
            <input type="checkbox" name="hidden" defaultChecked={product?.hidden} />
            <span>إخفاء من المتجر (مثلاً عند نفاد الكمية)</span>
          </label>
        </div>

        <div>
          <span className="field-label">صورة المنتج</span>
          <div className="mgr-image-box">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" />
            ) : (
              <span className="muted">لا توجد صورة</span>
            )}
          </div>
          {blobEnabled ? (
            <input
              type="file"
              name="image"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setPreview(URL.createObjectURL(f));
              }}
            />
          ) : (
            <p className="muted small">رفع الصور يحتاج ربط Vercel Blob من Vercel ← Storage.</p>
          )}
          <p className="muted small">الأفضل صورة مربعة بخلفية بيضاء، أقل من 4 ميغابايت.</p>
        </div>
      </div>

      {state?.error && <p className="alert">{state.error}</p>}
      <button className="btn btn-gold" disabled={pending}>{pending ? "جارٍ الحفظ…" : "حفظ المنتج"}</button>
    </form>
  );
}
