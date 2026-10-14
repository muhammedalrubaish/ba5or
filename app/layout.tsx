import type { Metadata, Viewport } from "next";
import { Amiri, Tajawal } from "next/font/google";
import { store } from "@/lib/config";
import "./globals.css";

const tajawal = Tajawal({ subsets: ["arabic", "latin"], weight: ["400", "500", "700"], variable: "--font-body" });
const amiri = Amiri({ subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--font-display" });

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
  title: { default: `${store.fullName} | بخور وعود فاخر`, template: `%s | ${store.fullName}` },
  description: store.description,
  openGraph: { title: store.fullName, description: store.description, locale: "ar_SA", type: "website", siteName: store.fullName },
};

export const viewport: Viewport = { themeColor: "#1a0f0a" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} ${amiri.variable}`}>
      <body>{children}</body>
    </html>
  );
}
