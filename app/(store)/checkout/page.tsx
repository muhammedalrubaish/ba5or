import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutClient } from "./CheckoutClient";

export const metadata: Metadata = { title: "إتمام الطلب" };

export default function CheckoutPage() {
  return (
    <main className="container page">
      <h1 className="page-title">إتمام الطلب</h1>
      <Suspense fallback={<p className="muted">جارٍ التحميل…</p>}>
        <CheckoutClient />
      </Suspense>
    </main>
  );
}
