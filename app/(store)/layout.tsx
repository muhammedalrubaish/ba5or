import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { CartProvider } from "@/lib/cart";
import { CatalogProvider } from "@/lib/catalog";
import { getVisibleProducts } from "@/lib/db";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const products = await getVisibleProducts();
  return (
    <CatalogProvider products={products}>
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
