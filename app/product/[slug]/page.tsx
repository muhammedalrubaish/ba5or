import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductArt } from "@/components/ProductArt";
import { ProductCard } from "@/components/ProductCard";
import { formatPrice } from "@/lib/config";
import { getProduct, products } from "@/lib/products";
import { BuyBox } from "./BuyBox";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  return { title: product.name, description: product.short };
}

export default async function ProductPage({ params }: Props) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const related = products.filter((p) => p.slug !== product.slug && p.category === product.category).slice(0, 3);
  const more = related.length ? related : products.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <main className="container page">
      <nav className="crumbs">
        <Link href="/">الرئيسية</Link> / <Link href="/#products">المنتجات</Link> / <span>{product.name}</span>
      </nav>
      <div className="product">
        <div className="product-media">
          <ProductArt product={product} className="product-art" />
          {product.badge && <span className="badge">{product.badge}</span>}
        </div>
        <div className="product-info">
          <span className="card-cat">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="muted">{product.unit}</p>
          <div className="card-price product-price">
            <strong>{formatPrice(product.price)}</strong>
            {product.oldPrice && <s>{formatPrice(product.oldPrice)}</s>}
          </div>
          <p className="product-desc">{product.description}</p>
          <div className="notes">
            {product.notes.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>
          <BuyBox product={product} />
        </div>
      </div>

      <section className="section">
        <div className="section-head">
          <h2>قد يعجبك أيضاً</h2>
        </div>
        <div className="grid">
          {more.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
