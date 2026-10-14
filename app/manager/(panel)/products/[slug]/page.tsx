import Link from "next/link";
import { notFound } from "next/navigation";
import { getCatalogFresh } from "@/lib/db";
import { ProductForm } from "./ProductForm";

type Props = { params: Promise<{ slug: string }> };

export default async function EditProductPage({ params }: Props) {
  const { slug } = await params;
  const product = slug === "new" ? undefined : (await getCatalogFresh()).find((p) => p.slug === slug);
  if (slug !== "new" && !product) notFound();

  return (
    <>
      <div className="mgr-section-head">
        <h1 className="mgr-title">{product ? `تعديل: ${product.name}` : "منتج جديد"}</h1>
        <Link href="/manager/products" className="mgr-link">رجوع للمنتجات</Link>
      </div>
      <ProductForm product={product} blobEnabled={Boolean(process.env.BLOB_READ_WRITE_TOKEN)} />
    </>
  );
}
