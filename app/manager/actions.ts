"use server";

import { put } from "@vercel/blob";
import { revalidatePath, updateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { checkCredentials, createSession, destroySession, requireAdmin } from "@/lib/auth";
import {
  CATALOG_TAG,
  clearFailedLogins,
  dbEnabled,
  getCatalogFresh,
  loginBlocked,
  orderStatusLabel,
  recordFailedLogin,
  saveCatalog,
  updateOrder,
  type OrderStatus,
} from "@/lib/db";
import { categories, type Product } from "@/lib/products";

export type FormState = { error?: string; ok?: string } | undefined;

// ---------- الدخول ----------

async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

export async function login(_prev: FormState, form: FormData): Promise<FormState> {
  const ip = await clientIp();
  if (await loginBlocked(ip)) return { error: "محاولات كثيرة خاطئة. حاول بعد 15 دقيقة." };

  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");
  if (!checkCredentials(email, password)) {
    await recordFailedLogin(ip);
    // تأخير بسيط يبطئ تخمين كلمة السر
    await new Promise((r) => setTimeout(r, 600));
    return { error: "البريد أو كلمة السر غير صحيحة" };
  }
  await clearFailedLogins(ip);
  await createSession();
  redirect("/manager");
}

export async function logout() {
  await destroySession();
  redirect("/manager/login");
}

// ---------- المنتجات ----------

function refreshStore() {
  updateTag(CATALOG_TAG);
  revalidatePath("/", "layout");
}

const MAX_IMAGE = 4 * 1024 * 1024;

export async function saveProduct(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  if (!dbEnabled) return { error: "اربط قاعدة البيانات (Upstash Redis) من Vercel أولاً لحفظ التعديلات." };

  const originalSlug = String(form.get("originalSlug") ?? "");
  const name = String(form.get("name") ?? "").trim();
  const price = Number(form.get("price"));
  const oldPriceRaw = String(form.get("oldPrice") ?? "").trim();
  const oldPrice = oldPriceRaw ? Number(oldPriceRaw) : undefined;
  const category = String(form.get("category") ?? "عود") as Product["category"];

  if (name.length < 2) return { error: "اكتب اسم المنتج" };
  if (!Number.isFinite(price) || price <= 0) return { error: "السعر يجب أن يكون رقماً أكبر من صفر" };
  if (oldPrice !== undefined && (!Number.isFinite(oldPrice) || oldPrice <= price)) {
    return { error: "السعر قبل الخصم يجب أن يكون أكبر من السعر الحالي، أو اتركه فارغاً" };
  }
  if (!categories.includes(category)) return { error: "اختر تصنيفاً صحيحاً" };

  const catalog = await getCatalogFresh();
  const existing = originalSlug ? catalog.find((p) => p.slug === originalSlug) : undefined;
  if (originalSlug && !existing) return { error: "المنتج لم يعد موجوداً" };

  const slug = existing?.slug ?? `p-${Date.now().toString(36)}`;
  let image = existing?.image;

  const file = form.get("image");
  if (file instanceof File && file.size > 0) {
    if (!file.type.startsWith("image/")) return { error: "الملف المرفوع ليس صورة" };
    if (file.size > MAX_IMAGE) return { error: "حجم الصورة أكبر من 4 ميغابايت" };
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return { error: "رفع الصور يحتاج ربط Vercel Blob من إعدادات Vercel (Storage)" };
    }
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const blob = await put(`products/${slug}.${ext}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    });
    image = blob.url;
  }

  const product: Product = {
    slug,
    name: name.slice(0, 80),
    short: String(form.get("short") ?? "").trim().slice(0, 120),
    description: String(form.get("description") ?? "").trim().slice(0, 1000),
    price: Math.round(price * 100) / 100,
    oldPrice,
    unit: String(form.get("unit") ?? "").trim().slice(0, 40),
    category,
    badge: String(form.get("badge") ?? "").trim().slice(0, 20) || undefined,
    notes: String(form.get("notes") ?? "")
      .split(/[,،]/)
      .map((n) => n.trim())
      .filter(Boolean)
      .slice(0, 6),
    hidden: form.get("hidden") === "on",
    image,
    art: existing?.art ?? "chips",
    tint: existing?.tint ?? ["#4a2b1a", "#b07a45"],
  };

  const next = existing ? catalog.map((p) => (p.slug === slug ? product : p)) : [...catalog, product];
  await saveCatalog(next);
  refreshStore();
  redirect("/manager/products?saved=1");
}

export async function deleteProduct(form: FormData) {
  await requireAdmin();
  if (!dbEnabled) return;
  const slug = String(form.get("slug") ?? "");
  const catalog = await getCatalogFresh();
  await saveCatalog(catalog.filter((p) => p.slug !== slug));
  refreshStore();
  redirect("/manager/products");
}

export async function toggleProductHidden(form: FormData) {
  await requireAdmin();
  if (!dbEnabled) return;
  const slug = String(form.get("slug") ?? "");
  const catalog = await getCatalogFresh();
  await saveCatalog(catalog.map((p) => (p.slug === slug ? { ...p, hidden: !p.hidden } : p)));
  refreshStore();
  revalidatePath("/manager/products");
}

// ---------- الطلبات ----------

export async function setOrderStatus(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const id = String(form.get("id") ?? "");
  const status = String(form.get("status") ?? "") as OrderStatus;
  if (!(status in orderStatusLabel)) return { error: "حالة غير صحيحة" };
  const adminNote = String(form.get("adminNote") ?? "").trim().slice(0, 500) || undefined;
  const updated = await updateOrder(id, { status, adminNote });
  if (!updated) return { error: "الطلب غير موجود" };
  revalidatePath("/manager", "layout");
  return { ok: "تم الحفظ" };
}
