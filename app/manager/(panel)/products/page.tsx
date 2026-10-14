import Link from "next/link";
import { deleteProduct, toggleProductHidden } from "@/app/manager/actions";
import { ProductArt } from "@/components/ProductArt";
import { formatPrice } from "@/lib/config";
import { dbEnabled, getCatalogFresh } from "@/lib/db";
import { ConfirmButton } from "./ConfirmButton";

type Props = { searchParams: Promise<{ saved?: string }> };

export default async function ProductsPage({ searchParams }: Props) {
  const { saved } = await searchParams;
  const products = await getCatalogFresh();

  return (
    <>
      <div className="mgr-section-head">
        <h1 className="mgr-title">المنتجات</h1>
        {dbEnabled && <Link href="/manager/products/new" className="btn btn-gold">+ منتج جديد</Link>}
      </div>
      {saved && <p className="ok-note">تم حفظ المنتج وتحديث المتجر ✓</p>}

      <div className="mgr-products">
        {products.map((p) => (
          <div key={p.slug} className={`mgr-product ${p.hidden ? "is-hidden" : ""}`}>
            <ProductArt product={p} className="mgr-product-img" />
            <div className="mgr-product-info">
              <strong>{p.name}</strong>
              <span className="muted">{p.unit} · {p.category}</span>
              <span>
                {formatPrice(p.price)} {p.oldPrice && <s className="muted">{formatPrice(p.oldPrice)}</s>}
              </span>
              {p.hidden && <span className="status status-cancelled">مخفي من المتجر</span>}
            </div>
            {dbEnabled && (
              <div className="mgr-product-actions">
                <Link href={`/manager/products/${p.slug}`} className="btn btn-outline">تعديل</Link>
                <form action={toggleProductHidden}>
                  <input type="hidden" name="slug" value={p.slug} />
                  <button className="btn btn-outline">{p.hidden ? "إظهار" : "إخفاء"}</button>
                </form>
                <form action={deleteProduct}>
                  <input type="hidden" name="slug" value={p.slug} />
                  <ConfirmButton message={`حذف «${p.name}» نهائياً؟`}>حذف</ConfirmButton>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
