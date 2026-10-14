import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "لوحة التحكم",
  robots: { index: false, follow: false },
};

export default function ManagerRoot({ children }: { children: React.ReactNode }) {
  return <div className="mgr">{children}</div>;
}
