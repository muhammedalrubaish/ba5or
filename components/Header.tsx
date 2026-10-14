"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { Logo } from "./Logo";

export function Header() {
  const { count, open, ready } = useCart();
  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" aria-label="الصفحة الرئيسية">
          <Logo id="header-logo" />
        </Link>
        <nav className="nav">
          <Link href="/#products">المنتجات</Link>
          <Link href="/#about">عن المتجر</Link>
        </nav>
        <button className="cart-btn" onClick={open} aria-label={`السلة (${count})`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" />
            <path d="M9 8V6a3 3 0 0 1 6 0v2" />
          </svg>
          {ready && count > 0 && <span className="cart-count">{count}</span>}
        </button>
      </div>
    </header>
  );
}
