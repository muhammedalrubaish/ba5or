// تسجيل دخول المدير. البريد وكلمة السر في متغيرات بيئة Vercel وليس في الكود:
// ADMIN_EMAIL و ADMIN_PASSWORD (و SESSION_SECRET اختياري).
import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "safwa_admin";
const SESSION_DAYS = 7;

export function adminConfigured() {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD);
}

function secret() {
  return (
    process.env.SESSION_SECRET ||
    // بدون سر مستقل نشتقه من بيانات الدخول، فتغيير كلمة السر يُخرج كل الجلسات
    createHash("sha256").update(`${process.env.ADMIN_EMAIL}:${process.env.ADMIN_PASSWORD}:safwa-session`).digest("hex")
  );
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

// مقارنة ثابتة الزمن حتى لا يُستدل على كلمة السر من زمن الاستجابة
function safeEqual(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkCredentials(email: string, password: string) {
  if (!adminConfigured()) return false;
  const emailOk = safeEqual(email.trim().toLowerCase(), process.env.ADMIN_EMAIL!.trim().toLowerCase());
  const passOk = safeEqual(password, process.env.ADMIN_PASSWORD!);
  return emailOk && passOk;
}

export async function createSession() {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const value = `${exp}.${sign(String(exp))}`;
  (await cookies()).set(COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  if (!adminConfigured()) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [exp, sig] = value.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return safeEqual(sig, sign(exp));
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/manager/login");
}
