"use client";

import "moyasar-payment-form/dist/moyasar.css";
import { useEffect, useRef, useState } from "react";
import { onlineMethods, store } from "@/lib/config";

type Props = {
  amountHalalas: number;
  description: string;
  callbackUrl: string;
  metadata: Record<string, string>;
};

// نموذج الدفع الرسمي من ميسر — بيانات البطاقة تذهب مباشرة إلى ميسر ولا تمر بخادمنا.
export function MoyasarForm({ amountHalalas, description, callbackUrl, metadata }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const key = process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY;

  useEffect(() => {
    if (!key || !ref.current) return;
    const el = ref.current;
    let cancelled = false;

    import("moyasar-payment-form")
      .then(({ default: Moyasar }) => {
        if (cancelled) return;
        el.innerHTML = "";
        Moyasar.init({
          element: el,
          amount: amountHalalas,
          currency: store.currency,
          description,
          publishable_api_key: key,
          callback_url: callbackUrl,
          methods: onlineMethods,
          supported_networks: ["mada", "visa", "mastercard"],
          language: "ar",
          metadata,
          apple_pay: {
            country: "SA",
            label: store.fullName,
            validate_merchant_url: "https://api.moyasar.com/v1/applepay/initiate",
          },
        });
      })
      .catch(() => setError("تعذر تحميل نموذج الدفع. حدّث الصفحة وحاول مجدداً."));

    return () => {
      cancelled = true;
      el.innerHTML = "";
    };
    // metadata يُبنى مرة واحدة عند الانتقال لخطوة الدفع
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, amountHalalas, description, callbackUrl]);

  if (!key) {
    return <p className="alert">الدفع الإلكتروني غير مفعّل بعد: أضف مفاتيح ميسر في إعدادات Vercel.</p>;
  }

  return (
    <>
      {error && <p className="alert">{error}</p>}
      <div ref={ref} className="mysr-form" />
    </>
  );
}
