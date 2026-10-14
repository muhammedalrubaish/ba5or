import { LogoMark } from "@/components/Logo";
import { ProductCard } from "@/components/ProductCard";
import { WhatsAppIcon } from "@/components/WhatsAppFloat";
import { formatPrice, paymentLabels, store, whatsappLink } from "@/lib/config";
import { products } from "@/lib/products";

const features = [
  { title: "شحن سريع", text: `لجميع مدن المملكة، ومجاني فوق ${formatPrice(store.freeShippingFrom)}` },
  { title: "دفع مرن", text: paymentLabels().join(" أو ") },
  { title: "أصالة مضمونة", text: "عود ودهن عود مختار من أجود المصادر" },
  { title: "دعم مباشر", text: "نرد عليك عبر واتساب طوال أيام الأسبوع" },
];

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="hero-smoke" aria-hidden="true">
          <span /><span /><span />
        </div>
        <div className="container hero-inner">
          <div className="hero-mark">
            <LogoMark size={96} id="hero-logo" />
          </div>
          <p className="eyebrow">{store.fullName}</p>
          <h1>عبقٌ يبقى في المكان والذاكرة</h1>
          <p className="hero-text">
            بخور معمول، عود طبيعي، دهن عود معتّق ومباخر فاخرة — اطلب بضغطة واحدة وادفع بالطريقة التي تناسبك.
          </p>
          <div className="hero-actions">
            <a href="#products" className="btn btn-gold">تسوّق الآن</a>
            <a href={whatsappLink("السلام عليكم، أرغب بالاستفسار عن المنتجات")} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              <WhatsAppIcon size={20} /> اطلب عبر واتساب
            </a>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container features-grid">
          {features.map((f) => (
            <div key={f.title} className="feature">
              <strong>{f.title}</strong>
              <span className="muted">{f.text}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="products" className="container section">
        <div className="section-head">
          <span className="eyebrow">مجموعتنا</span>
          <h2>منتجات مختارة بعناية</h2>
        </div>
        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section id="about" className="about">
        <div className="container about-inner">
          <div>
            <span className="eyebrow">عن {store.name}</span>
            <h2>رائحة الضيافة العربية في كل بيت</h2>
            <p>
              في {store.name} نختار العود ونخلط المعمول بأيدٍ خبيرة، ونحرص أن يصلك المنتج كما لو اخترته بنفسك من سوق
              العطارين. للطلبات الخاصة والكميات وهدايا المناسبات تواصل معنا مباشرة.
            </p>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
              <WhatsAppIcon size={20} /> <span dir="ltr">{store.whatsappDisplay}</span>
            </a>
          </div>
          <div className="about-art" aria-hidden="true">
            <LogoMark size={220} id="about-logo" />
          </div>
        </div>
      </section>
    </main>
  );
}
