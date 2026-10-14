"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { formatPrice, paymentLabels, store, whatsappLink } from "@/lib/config";
import type { Product } from "@/lib/products";
import { ProductArt } from "./ProductArt";
import { QtyStepper } from "./QtyStepper";
import { WhatsAppIcon } from "./WhatsAppFloat";

// البيع السريع: شراء منتج واحد مباشرة دون المرور بالسلة
export function QuickBuyModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const total = product.price * qty;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const waMessage = `السلام عليكم، أرغب بطلب:\n${product.name} (${product.unit}) × ${qty}\nالسعر: ${formatPrice(total)} + الشحن\nمن متجر ${store.name}`;

  // يُعرض خارج البطاقة حتى لا يتأثر بتحريكها (transform يحبس position: fixed)
  return createPortal(
    <div className="modal-root">
      <div className="overlay" onClick={onClose} />
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby={`qb-${product.slug}`}>
        <button className="icon-btn modal-close" onClick={onClose} aria-label="إغلاق" autoFocus>✕</button>
        <ProductArt product={product} className="modal-art" />
        <div className="modal-body">
          <span className="eyebrow">شراء سريع</span>
          <h3 id={`qb-${product.slug}`}>{product.name}</h3>
          <p className="muted">{product.short} · {product.unit}</p>
          <div className="modal-row">
            <QtyStepper value={qty} onChange={setQty} />
            <strong className="price-lg">{formatPrice(total)}</strong>
          </div>
          <button
            className="btn btn-gold btn-block"
            onClick={() => router.push(`/checkout?buy=${product.slug}:${qty}`)}
          >
            اشترِ الآن
          </button>
          <a className="btn btn-wa btn-block" href={whatsappLink(waMessage)} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon size={20} /> اطلب عبر واتساب
          </a>
          <p className="pay-note">{paymentLabels().join(" · ")}</p>
        </div>
      </div>
    </div>,
    document.body
  );
}
