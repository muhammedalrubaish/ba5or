// إعدادات المتجر — عدّل هنا الاسم ورقم الواتساب والشحن.
export const store = {
  name: "صفوة",
  fullName: "صفوة للبخور",
  nameLatin: "SAFWA",
  tagline: "للبخور",
  description: "صفوة للبخور: متجر لبيع العود الطبيعي الكمبودي والهندي والمروكي، مع توصيل لجميع مدن المملكة.",
  // رقم الواتساب بصيغة دولية بدون + أو مسافات
  whatsapp: "966501523258",
  whatsappDisplay: "+966 50 152 3258",
  currency: "SAR",
  currencyLabel: "ر.س",
  // القيم الافتراضية للشحن — تُعدّل من لوحة التحكم ← الإعدادات
  shippingFee: 25,
  freeShippingFrom: 300,
};

export const cities = [
  "الرياض",
  "جدة",
  "مكة المكرمة",
  "المدينة المنورة",
  "الدمام",
  "الخبر",
  "الطائف",
  "تبوك",
  "أبها",
  "بريدة",
  "حائل",
  "جازان",
  "نجران",
  "الأحساء",
  "ينبع",
  "مدينة أخرى",
];

// وسائل الدفع الإلكتروني المفعّلة في حساب ميسر (من متغير البيئة)
export const onlineMethods = (process.env.NEXT_PUBLIC_MOYASAR_METHODS || "creditcard")
  .split(",")
  .map((m) => m.trim())
  .filter((m) => ["creditcard", "applepay", "stcpay"].includes(m));

export const onlinePaymentEnabled = Boolean(process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY);

export function paymentLabels() {
  const labels: string[] = ["تحويل بنكي (آيبان)"];
  if (onlinePaymentEnabled) {
    if (onlineMethods.includes("creditcard")) labels.push("مدى", "VISA", "Mastercard");
    if (onlineMethods.includes("applepay")) labels.push("Apple Pay");
    if (onlineMethods.includes("stcpay")) labels.push("STC Pay");
  }
  labels.push("الدفع عند الاستلام");
  return labels;
}

export function formatPrice(amount: number) {
  return `${amount.toLocaleString("ar-SA")} ${store.currencyLabel}`;
}

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${store.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
