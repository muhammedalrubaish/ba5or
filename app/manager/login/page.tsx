import { redirect } from "next/navigation";
import { LogoMark } from "@/components/Logo";
import { adminConfigured, isAdmin } from "@/lib/auth";
import { store } from "@/lib/config";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/manager");
  const configured = adminConfigured();

  return (
    <main className="mgr-login">
      <div className="mgr-login-card">
        <LogoMark size={64} id="login-logo" />
        <h1>{store.fullName}</h1>
        <p className="muted">لوحة التحكم</p>
        {configured ? (
          <LoginForm />
        ) : (
          <p className="alert">
            لم تُضبط بيانات الدخول بعد. أضف المتغيرين <code>ADMIN_EMAIL</code> و <code>ADMIN_PASSWORD</code> في
            إعدادات Vercel (Environment Variables) ثم أعد النشر.
          </p>
        )}
      </div>
    </main>
  );
}
