"use server";

import { createOrder, getCatalog, getSettings } from "@/lib/db";
import {
  MAX_QTY,
  newOrderRef,
  normalizePhone,
  priceOrder,
  validateCustomer,
  type CartItem,
  type Customer,
  type PaymentMethod,
} from "@/lib/order";

export type PlacedOrder =
  | {
      ok: true;
      ref: string;
      saved: boolean;
      lines: { name: string; qty: number; total: number }[];
      subtotal: number;
      shipping: number;
      total: number;
      customer: Customer;
    }
  | { ok: false; error: string };

// ينشئ الطلب في الخادم: يعيد حساب الأسعار من الكتالوج ويحفظه في قاعدة البيانات إن وُجدت
export async function placeOrder(input: { items: CartItem[]; customer: Customer; method: PaymentMethod }): Promise<PlacedOrder> {
  if (!["bank", "online", "cod"].includes(input.method)) return { ok: false, error: "طريقة دفع غير صحيحة" };
  if (!Array.isArray(input.items) || input.items.length === 0 || input.items.length > 30) {
    return { ok: false, error: "لا توجد منتجات في الطلب" };
  }

  const customer: Customer = {
    name: String(input.customer?.name ?? "").trim().slice(0, 100),
    phone: normalizePhone(String(input.customer?.phone ?? "")).slice(0, 20),
    city: String(input.customer?.city ?? "").trim().slice(0, 60),
    address: String(input.customer?.address ?? "").trim().slice(0, 250),
    notes: String(input.customer?.notes ?? "").trim().slice(0, 250),
  };
  const errors = validateCustomer(customer);
  if (Object.keys(errors).length > 0) return { ok: false, error: Object.values(errors)[0]! };

  const items = input.items
    .map((i) => ({ slug: String(i.slug), qty: Math.min(MAX_QTY, Math.floor(Number(i.qty))) }))
    .filter((i) => i.qty > 0);
  const [catalog, settings] = await Promise.all([getCatalog(), getSettings()]);
  const priced = priceOrder(items, catalog, settings);
  if (priced.lines.length === 0) return { ok: false, error: "المنتجات المطلوبة لم تعد متوفرة" };

  const ref = newOrderRef();
  const lines = priced.lines.map((l) => ({
    slug: l.product.slug,
    name: l.product.name,
    unit: l.product.unit,
    price: l.product.price,
    qty: l.qty,
    total: l.total,
  }));

  let saved = false;
  try {
    const stored = await createOrder({
      id: ref,
      createdAt: Date.now(),
      status: input.method === "cod" ? "new" : "awaiting_payment",
      method: input.method,
      customer,
      lines,
      subtotal: priced.subtotal,
      shipping: priced.shipping,
      total: priced.total,
    });
    saved = Boolean(stored);
  } catch (err) {
    // لا نوقف الطلب إن تعذر الحفظ — يصل للمتجر عبر واتساب على الأقل
    console.error("Failed to save order", err);
  }

  return {
    ok: true,
    ref,
    saved,
    lines: lines.map((l) => ({ name: l.name, qty: l.qty, total: l.total })),
    subtotal: priced.subtotal,
    shipping: priced.shipping,
    total: priced.total,
    customer,
  };
}
