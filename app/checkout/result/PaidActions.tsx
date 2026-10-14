"use client";

import Link from "next/link";
import { useEffect } from "react";
import { WhatsAppIcon } from "@/components/WhatsAppFloat";
import { useCart } from "@/lib/cart";
import { whatsappLink } from "@/lib/config";

export function PaidActions({ message, clearCart }: { message: string; clearCart: boolean }) {
  const { clear, ready } = useCart();

  useEffect(() => {
    if (clearCart && ready) clear();
  }, [clearCart, ready, clear]);

  return (
    <div className="result-actions">
      <a className="btn btn-wa" href={whatsappLink(message)} target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon size={20} /> أرسل تفاصيل الطلب عبر واتساب
      </a>
      <Link href="/" className="btn btn-outline">العودة للمتجر</Link>
    </div>
  );
}
