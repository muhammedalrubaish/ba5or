// الحزمة لا تصدّر أنواعها عبر "exports"، فنعرّف ما نستخدمه منها فقط.
declare module "moyasar-payment-form" {
  type PaymentFormConfig = {
    element: string | Element;
    amount: number;
    currency: string;
    description: string;
    publishable_api_key: string;
    callback_url: string;
    methods?: string[];
    supported_networks?: string[];
    language?: "ar" | "en";
    metadata?: Record<string, string>;
    apple_pay?: { country: string; label: string; validate_merchant_url: string };
  };
  const Moyasar: { init(config: PaymentFormConfig): void; setAmount(amount: number): void };
  export default Moyasar;
}
