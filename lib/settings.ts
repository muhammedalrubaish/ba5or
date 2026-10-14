// إعدادات المتجر التي تُدار من لوحة التحكم (/manager/settings)
import { store } from "./config";

export type StoreSettings = {
  bank: { name: string; holder: string; iban: string };
  shippingFee: number;
  freeShippingFrom: number;
  updatedAt?: number;
};

export const defaultSettings: StoreSettings = {
  bank: { name: "", holder: "", iban: "" },
  shippingFee: store.shippingFee,
  freeShippingFrom: store.freeShippingFrom,
};

export function bankConfigured(s: StoreSettings) {
  return Boolean(s.bank.iban && s.bank.holder);
}

export function cleanIban(iban: string) {
  return iban.replace(/\s/g, "").toUpperCase();
}

export function formatIban(iban: string) {
  return cleanIban(iban).replace(/(.{4})/g, "$1 ").trim();
}

// آيبان سعودي: SA + رقمان تحقق + 22 رقماً، مع التحقق الرياضي (mod 97)
export function isValidSaudiIban(iban: string) {
  const v = cleanIban(iban);
  if (!/^SA\d{22}$/.test(v)) return false;
  const rearranged = v.slice(4) + v.slice(0, 4);
  const numeric = rearranged.replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
  let rem = 0;
  for (const d of numeric) rem = (rem * 10 + Number(d)) % 97;
  return rem === 1;
}
