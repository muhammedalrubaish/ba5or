import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { CartProvider } from "@/lib/cart";
import { CatalogProvider } from "@/lib/catalog";
import { getSettings, getVisibleProducts } from "@/lib/db";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [products, settings] = await Promise.all([getVisibleProducts(), getSettings()]);
  return (
    <CatalogProvider products={products} settings={settings}>
      <CartProvider>
        <Header />
        {children}
        <Footer />
        <CartDrawer />
        <WhatsAppFloat />
      </CartProvider>
    </CatalogProvider>
  );
}
