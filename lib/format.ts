// تنسيقات لوحة التحكم والفواتير (التقويم الميلادي بتوقيت الرياض)
const dateTime = new Intl.DateTimeFormat("ar-SA-u-ca-gregory", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Riyadh",
});
const dateOnly = new Intl.DateTimeFormat("ar-SA-u-ca-gregory", { dateStyle: "long", timeZone: "Asia/Riyadh" });

export const formatDateTime = (ts: number) => dateTime.format(ts);
export const formatDate = (ts: number) => dateOnly.format(ts);
export const invoiceNumber = (n: number) => `INV-${String(n).padStart(5, "0")}`;

// رابط واتساب لرقم العميل (05xxxxxxxx → 9665xxxxxxxx)
export function customerWhatsapp(phone: string, text?: string) {
  const intl = phone.replace(/^0/, "966");
  return `https://wa.me/${intl}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function riyadhDayKey(ts: number) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Riyadh" }).format(ts);
}
