import { paymentLabels, store, whatsappLink } from "@/lib/config";
import { Logo } from "./Logo";
import { WhatsAppIcon } from "./WhatsAppFloat";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Logo id="footer-logo" />
          <p className="muted footer-about">{store.description}</p>
        </div>
        <div>
          <h4>تواصل معنا</h4>
          <a className="footer-wa" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon size={18} /> <span dir="ltr">{store.whatsappDisplay}</span>
          </a>
        </div>
        <div>
          <h4>وسائل الدفع</h4>
          <div className="pay-badges">
            {paymentLabels().map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="container footer-bottom muted">
        © {new Date().getFullYear()} {store.name} — جميع الحقوق محفوظة
      </div>
    </footer>
  );
}
