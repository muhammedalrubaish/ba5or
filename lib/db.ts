// طبقة البيانات (الخادم فقط): المنتجات والطلبات في Upstash Redis.
// بدون قاعدة بيانات يعمل المتجر بالمنتجات الأولية ولا تُحفظ الطلبات.
import { Redis } from "@upstash/redis";
import { unstable_cache } from "next/cache";
import type { Customer, PaymentMethod } from "./order";
import { seedProducts, type Product } from "./products";

const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

export const dbEnabled = Boolean(url && token);
const redis = dbEnabled ? new Redis({ url: url!, token: token! }) : null;

const K = {
  products: "safwa:products",
  orders: "safwa:orders",
  order: (id: string) => `safwa:order:${id}`,
  invoiceSeq: "safwa:invoice-seq",
  login: (ip: string) => `safwa:login:${ip}`,
};

export const CATALOG_TAG = "catalog";

// ---------- المنتجات ----------

async function readCatalog(): Promise<Product[]> {
  if (!redis) return seedProducts;
  const saved = await redis.get<Product[]>(K.products);
  return saved ?? seedProducts;
}

// كل المنتجات بما فيها المخفية (للوحة التحكم وحساب الأسعار)، مخزّنة مؤقتاً حتى أول تعديل
export const getCatalog = unstable_cache(readCatalog, ["catalog-v1"], { tags: [CATALOG_TAG] });

// قراءة مباشرة بلا تخزين مؤقت، قبل التعديل
export const getCatalogFresh = readCatalog;

// المنتجات الظاهرة في المتجر
export async function getVisibleProducts() {
  return (await getCatalog()).filter((p) => !p.hidden);
}

export async function saveCatalog(products: Product[]) {
  if (!redis) throw new Error("DB_DISABLED");
  await redis.set(K.products, products);
}

// ---------- الطلبات ----------

export type OrderStatus = "new" | "awaiting_payment" | "paid" | "shipped" | "delivered" | "cancelled";

export const orderStatusLabel: Record<OrderStatus, string> = {
  new: "جديد",
  awaiting_payment: "بانتظار الدفع",
  paid: "مدفوع",
  shipped: "تم الشحن",
  delivered: "تم التسليم",
  cancelled: "ملغي",
};

export type StoredOrder = {
  id: string;
  invoiceNo: number;
  createdAt: number;
  status: OrderStatus;
  method: PaymentMethod;
  customer: Customer;
  // نسخة من المنتجات وقت الطلب حتى لا تتغير الفاتورة إن تغيّر السعر لاحقاً
  lines: { slug: string; name: string; unit: string; price: number; qty: number; total: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentId?: string;
  adminNote?: string;
};

export async function createOrder(order: Omit<StoredOrder, "invoiceNo">): Promise<StoredOrder | null> {
  if (!redis) return null;
  const invoiceNo = await redis.incr(K.invoiceSeq);
  const full: StoredOrder = { ...order, invoiceNo };
  await redis.set(K.order(order.id), full);
  await redis.zadd(K.orders, { score: order.createdAt, member: order.id });
  return full;
}

export async function getOrder(id: string): Promise<StoredOrder | null> {
  if (!redis || !/^SF-[A-Z0-9]{4,12}$/.test(id)) return null;
  return redis.get<StoredOrder>(K.order(id));
}

export async function updateOrder(id: string, patch: Partial<Pick<StoredOrder, "status" | "paymentId" | "adminNote">>) {
  const current = await getOrder(id);
  if (!current || !redis) return null;
  const next = { ...current, ...patch };
  await redis.set(K.order(id), next);
  return next;
}

export async function listOrders(limit = 200): Promise<StoredOrder[]> {
  if (!redis) return [];
  const ids = await redis.zrange<string[]>(K.orders, 0, limit - 1, { rev: true });
  if (ids.length === 0) return [];
  const orders = await redis.mget<(StoredOrder | null)[]>(...ids.map(K.order));
  return orders.filter((o): o is StoredOrder => Boolean(o));
}

// ---------- محاولات الدخول ----------

// يرجع true إذا تجاوز العنوان الحد المسموح (8 محاولات خاطئة كل 15 دقيقة)
export async function loginBlocked(ip: string) {
  if (!redis) return false;
  const n = await redis.get<number>(K.login(ip));
  return (n ?? 0) >= 8;
}

export async function recordFailedLogin(ip: string) {
  if (!redis) return;
  const n = await redis.incr(K.login(ip));
  if (n === 1) await redis.expire(K.login(ip), 15 * 60);
}

export async function clearFailedLogins(ip: string) {
  if (!redis) return;
  await redis.del(K.login(ip));
}
