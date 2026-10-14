import { formatPrice, store } from "./config";
import { getProduct, type Product } from "./products";

export type CartItem = { slug: string; qty: number };
export type OrderLine = { product: Product; qty: number; total: number };

export const MAX_QTY = 20;

export type Customer = {
  name: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
};

// يُستخدم في المتصفح والخادم معاً، فالخادم يعيد حساب المبلغ من الكتالوج
// ولا يثق بأي سعر قادم من المتصفح.
export function priceOrder(items: CartItem[]) {
  const lines: OrderLine[] = [];
  for (const item of items) {
    const product = getProduct(item.slug);
    const qty = Math.floor(item.qty);
    if (!product || !Number.isFinite(qty) || qty < 1 || qty > MAX_QTY) continue;
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
  items: CartItem[];
  customer: Customer;
  payment: string;
}) {
  const { lines, subtotal, shipping, total } = priceOrder(opts.items);
  const c = opts.customer;
  return [
    `طلب جديد من ${store.fullName}`,
    `رقم الطلب: ${opts.ref}`,
    "",
    ...lines.map((l) => `• ${l.product.name} × ${l.qty} = ${formatPrice(l.total)}`),
    "",
    `المجموع: ${formatPrice(subtotal)}`,
    `الشحن: ${shipping === 0 ? "مجاني" : formatPrice(shipping)}`,
    `الإجمالي: ${formatPrice(total)}`,
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

export function isValidSaudiPhone(phone: string) {
  const digits = normalizeDigits(phone).replace(/[\s-]/g, "").replace(/^(\+|00)?966/, "0");
  return /^05\d{8}$/.test(digits);
}
