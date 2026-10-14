import { formatPrice, store } from "./config";
import { findProduct, type Product } from "./products";

export type CartItem = { slug: string; qty: number };
export type OrderLine = { product: Product; qty: number; total: number };
export type PricedOrder = { lines: OrderLine[]; subtotal: number; shipping: number; total: number };

export const MAX_QTY = 20;

export type Customer = {
  name: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
};

export type PaymentMethod = "bank" | "online" | "cod";

export const paymentMethodLabel: Record<PaymentMethod, string> = {
  bank: "تحويل بنكي (آيبان)",
  online: "دفع إلكتروني",
  cod: "الدفع عند الاستلام",
};

// يُستخدم في المتصفح والخادم معاً، والخادم يعيد الحساب من الكتالوج ولا يثق بأي سعر من المتصفح.
// المنتجات المخفية لا تُباع.
export function priceOrder(items: CartItem[], catalog: Product[]): PricedOrder {
  const lines: OrderLine[] = [];
  for (const item of items) {
    const product = findProduct(catalog, item.slug);
    const qty = Math.floor(item.qty);
    if (!product || product.hidden || !Number.isFinite(qty) || qty < 1 || qty > MAX_QTY) continue;
    lines.push({ product, qty, total: product.price * qty });
  }
  const subtotal = lines.reduce((sum, l) => sum + l.total, 0);
  const shipping = subtotal === 0 || subtotal >= store.freeShippingFrom ? 0 : store.shippingFee;
  return { lines, subtotal, shipping, total: subtotal + shipping };
}

// صيغة مضغوطة للمنتجات تُرسل مع عملية الدفع: slug:qty,slug:qty
export function encodeItems(items: CartItem[]) {
  return items.map((i) => `${i.slug}:${i.qty}`).join(",");
}

export function decodeItems(value: string | undefined | null): CartItem[] {
  if (!value) return [];
  return value
    .split(",")
    .map((part) => {
      const [slug, qty] = part.split(":");
      return { slug, qty: Number(qty) };
    })
    .filter((i) => i.slug && Number.isFinite(i.qty));
}

export function newOrderRef() {
  const t = Date.now().toString(36).toUpperCase().slice(-5);
  const r = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `SF-${t}${r}`;
}

export function orderMessage(opts: {
  ref: string;
  lines: { name: string; qty: number; total: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: Customer;
  payment: string;
}) {
  const c = opts.customer;
  return [
    `طلب جديد من ${store.fullName}`,
    `رقم الطلب: ${opts.ref}`,
    "",
    ...opts.lines.map((l) => `• ${l.name} × ${l.qty} = ${formatPrice(l.total)}`),
    "",
    `المجموع: ${formatPrice(opts.subtotal)}`,
    `الشحن: ${opts.shipping === 0 ? "مجاني" : formatPrice(opts.shipping)}`,
    `الإجمالي: ${formatPrice(opts.total)}`,
    `طريقة الدفع: ${opts.payment}`,
    "",
    `الاسم: ${c.name}`,
    `الجوال: ${c.phone}`,
    `المدينة: ${c.city}`,
    `العنوان: ${c.address}`,
    c.notes ? `ملاحظات: ${c.notes}` : "",
  ]
    .filter((line, i, arr) => !(line === "" && arr[i - 1] === ""))
    .join("\n")
    .trim();
}

// يحوّل الأرقام العربية (٠-٩) إلى إنجليزية
export function normalizeDigits(value: string) {
  return value.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

export function normalizePhone(phone: string) {
  return normalizeDigits(phone).replace(/[\s-]/g, "").replace(/^(\+|00)?966/, "0");
}

export function isValidSaudiPhone(phone: string) {
  return /^05\d{8}$/.test(normalizePhone(phone));
}

// يتحقق من بيانات العميل (يُستخدم في المتصفح والخادم)
export function validateCustomer(c: Customer) {
  const errors: Partial<Record<keyof Customer, string>> = {};
  if (c.name.trim().length < 3) errors.name = "اكتب الاسم الكامل";
  if (!isValidSaudiPhone(c.phone)) errors.phone = "رقم جوال سعودي يبدأ بـ 05 (10 أرقام)";
  if (!c.city) errors.city = "اختر المدينة";
  if (c.address.trim().length < 8) errors.address = "اكتب العنوان بالتفصيل (الحي، الشارع)";
  return errors;
}
