"use client";

import { createContext, useContext } from "react";
import type { Product } from "./products";

// قائمة المنتجات الحالية (من قاعدة البيانات) متاحة لمكونات المتصفح: السلة وإتمام الطلب
const CatalogContext = createContext<Product[]>([]);

export function CatalogProvider({ products, children }: { products: Product[]; children: React.ReactNode }) {
  return <CatalogContext.Provider value={products}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  return useContext(CatalogContext);
}
