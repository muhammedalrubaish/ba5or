"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/config";
import type { Product } from "@/lib/products";
import { ProductArt } from "./ProductArt";
import { QuickBuyModal } from "./QuickBuy";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [quick, setQuick] = useState(false);

  return (
    <article className="card">
      <Link href={`/product/${product.slug}`} className="card-media">
        <ProductArt product={product} className="card-art" />
        {product.badge && <span className="badge">{product.badge}</span>}
      </Link>
      <div className="card-body">
        <span className="card-cat">{product.category} · {product.unit}</span>
        <h3>
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="muted card-short">{product.short}</p>
        <div className="card-price">
          <strong>{formatPrice(product.price)}</strong>
          {product.oldPrice && <s>{formatPrice(product.oldPrice)}</s>}
        </div>
        <div className="card-actions">
          <button className="btn btn-gold" onClick={() => setQuick(true)}>شراء سريع</button>
          <button className="btn btn-outline" onClick={() => add(product.slug)} aria-label={`أضف ${product.name} إلى السلة`}>
            أضف للسلة
          </button>
        </div>
      </div>
      {quick && <QuickBuyModal product={product} onClose={() => setQuick(false)} />}
    </article>
  );
}
