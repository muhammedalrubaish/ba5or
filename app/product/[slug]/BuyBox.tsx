"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { QtyStepper } from "@/components/QtyStepper";
import { WhatsAppIcon } from "@/components/WhatsAppFloat";
import { useCart } from "@/lib/cart";
import { formatPrice, store, whatsappLink } from "@/lib/config";
import type { Product } from "@/lib/products";

export function BuyBox({ product }: { product: Product }) {
  const router = useRouter();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const waMessage = `السلام عليكم، أرغب بطلب:\n${product.name} (${product.unit}) × ${qty}\nالسعر: ${formatPrice(product.price * qty)} + الشحن\nمن متجر ${store.name}`;

  return (
    <div className="buybox">
      <div className="modal-row">
        <QtyStepper value={qty} onChange={setQty} />
        <strong className="price-lg">{formatPrice(product.price * qty)}</strong>
      </div>
      <div className="buybox-actions">
        <button className="btn btn-gold" onClick={() => router.push(`/checkout?buy=${product.slug}:${qty}`)}>
          شراء سريع
        </button>
        <button className="btn btn-outline" onClick={() => add(product.slug, qty)}>أضف للسلة</button>
      </div>
      <a className="btn btn-wa btn-block" href={whatsappLink(waMessage)} target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon size={20} /> اطلب عبر واتساب
      </a>
    </div>
  );
}
