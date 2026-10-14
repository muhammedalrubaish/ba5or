// يُستخدم في الخادم فقط (المفتاح السري لا يحمل البادئة NEXT_PUBLIC فلا يصل للمتصفح)
export type MoyasarPayment = {
  id: string;
  status: "initiated" | "paid" | "failed" | "authorized" | "captured" | "refunded" | "voided" | "verified";
  amount: number;
  currency: string;
  description: string | null;
  metadata: Record<string, string> | null;
  source?: { type?: string; company?: string; message?: string | null };
};

// يجلب حالة الدفع من ميسر مباشرة بالمفتاح السري — لا نعتمد على معاملات الرابط
export async function fetchPayment(id: string): Promise<MoyasarPayment | null> {
  const secret = process.env.MOYASAR_SECRET_KEY;
  if (!secret) throw new Error("MOYASAR_SECRET_KEY is not set");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;

  const res = await fetch(`https://api.moyasar.com/v1/payments/${id}`, {
    headers: { Authorization: `Basic ${Buffer.from(`${secret}:`).toString("base64")}` },
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Moyasar responded ${res.status}`);
  return res.json();
}
