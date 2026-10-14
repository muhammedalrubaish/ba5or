"use client";

import { createContext, useContext } from "react";
import type { Product } from "./products";
import { defaultSettings, type StoreSettings } from "./settings";

// المنتجات والإعدادات الحالية (من قاعدة البيانات) متاحة لمكونات المتصفح: السلة وإتمام الطلب
const CatalogContext = createContext<{ products: Product[]; settings: StoreSettings }>({
  products: [],
  settings: defaultSettings,
});

export function CatalogProvider({
  products,
  settings,
  children,
}: {
  products: Product[];
  settings: StoreSettings;
  children: React.ReactNode;
}) {
  return <CatalogContext.Provider value={{ products, settings }}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  return useContext(CatalogContext).products;
}

export function useStoreSettings() {
  return useContext(CatalogContext).settings;
}
