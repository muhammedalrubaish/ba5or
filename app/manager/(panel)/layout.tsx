import Link from "next/link";
import { Logo } from "@/components/Logo";
import { requireAdmin } from "@/lib/auth";
import { dbEnabled } from "@/lib/db";
import { logout } from "../actions";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <>
      <header className="mgr-top no-print">
        <div className="container mgr-top-inner">
          <Link href="/manager"><Logo id="mgr-logo" compact /></Link>
          <nav className="mgr-nav">
            <Link href="/manager">الرئيسية</Link>
            <Link href="/manager/orders">الطلبات</Link>
            <Link href="/manager/products">المنتجات</Link>
            <Link href="/manager/settings">الإعدادات</Link>
            <Link href="/" target="_blank">المتجر ↗</Link>
          </nav>
          <form action={logout}>
            <button className="btn btn-ghost mgr-logout">خروج</button>
          </form>
        </div>
      </header>
      <main className="container mgr-main">
        {!dbEnabled && (
          <p className="alert no-print">
            قاعدة البيانات غير مربوطة: الطلبات لا تُحفظ ولا يمكن تعديل المنتجات. من Vercel افتح المشروع ← Storage ←
            أضف Upstash Redis، ثم أعد النشر.
          </p>
        )}
        {children}
      </main>
    </>
  );
}
