"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { formatPrice, store } from "@/lib/config";
import { priceOrder } from "@/lib/order";
import { ProductArt } from "./ProductArt";
import { QtyStepper } from "./QtyStepper";

export function CartDrawer() {
  const { items, isOpen, close, setQty, remove } = useCart();
  const { lines, subtotal, shipping, total } = priceOrder(items);
  const remaining = store.freeShippingFrom - subtotal;

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <div className={`drawer-root ${isOpen ? "is-open" : ""}`} inert={!isOpen}>
      <div className="overlay" onClick={close} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="سلة المشتريات">
        <div className="drawer-head">
          <h2>سلة المشتريات</h2>
          <button className="icon-btn" onClick={close} aria-label="إغلاق">✕</button>
        </div>

        {lines.length === 0 ? (
          <div className="drawer-empty">
            <p>سلتك فارغة.</p>
            <button className="btn btn-outline" onClick={close}>تصفح المنتجات</button>
          </div>
        ) : (
          <>
            {remaining > 0 ? (
              <p className="ship-hint">أضف بقيمة {formatPrice(remaining)} للحصول على شحن مجاني</p>
            ) : (
              <p className="ship-hint ship-hint-ok">طلبك مؤهل للشحن المجاني ✓</p>
            )}
            <ul className="drawer-list">
              {lines.map(({ product, qty, total: lineTotal }) => (
                <li key={product.slug} className="drawer-item">
                  <ProductArt product={product} className="drawer-thumb" />
                  <div className="drawer-info">
                    <strong>{product.name}</strong>
                    <span className="muted">{product.unit}</span>
                    <div className="drawer-row">
                      <QtyStepper small value={qty} min={0} onChange={(q) => setQty(product.slug, q)} />
                      <span className="price">{formatPrice(lineTotal)}</span>
                    </div>
                  </div>
                  <button className="icon-btn remove" onClick={() => remove(product.slug)} aria-label={`حذف ${product.name}`}>
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            <div className="drawer-foot">
              <div className="sum-row"><span>المجموع</span><span>{formatPrice(subtotal)}</span></div>
              <div className="sum-row"><span>الشحن</span><span>{shipping === 0 ? "مجاني" : formatPrice(shipping)}</span></div>
              <div className="sum-row sum-total"><span>الإجمالي</span><span>{formatPrice(total)}</span></div>
              <Link href="/checkout" className="btn btn-gold btn-block" onClick={close}>
                إتمام الطلب
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
