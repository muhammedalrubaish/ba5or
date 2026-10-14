import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container page">
      <div className="panel center">
        <h1>الصفحة غير موجودة</h1>
        <Link href="/" className="btn btn-gold">العودة للمتجر</Link>
      </div>
    </main>
  );
}
