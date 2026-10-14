export type ArtKind = "jar" | "bottle" | "chips" | "burner" | "electric" | "gift";

export type Product = {
  slug: string;
  name: string;
  short: string;
  description: string;
  price: number;
  oldPrice?: number;
  unit: string;
  category: "بخور" | "عود" | "دهن عود" | "مباخر" | "هدايا";
  badge?: string;
  art: ArtKind;
  // مسار صورة حقيقية داخل public، مثل "/products/maamoul-royal.jpg". إن وُجدت تحل محل التصميم الافتراضي.
  image?: string;
  // لونان لخلفية التصميم الافتراضي للمنتج
  tint: [string, string];
  notes: string[];
};

// الصور هنا تصاميم افتراضية مرسومة بالكود. لاستبدالها بصور حقيقية
// أضف حقل image في المنتج وضع الصورة في مجلد public/products.
export const products: Product[] = [
  {
    slug: "maamoul-royal",
    name: "بخور معمول ملكي",
    short: "معمول فاخر بخلطة العود والعنبر والمسك",
    description:
      "معمول مصنوع يدوياً من نشارة العود الكمبودي، معجون بدهن العود والعنبر والمسك الأبيض. فوحان هادئ يدوم طويلاً في المجالس والملابس.",
    price: 85,
    oldPrice: 110,
    unit: "علبة 100 غرام",
    category: "بخور",
    badge: "الأكثر مبيعاً",
    art: "jar",
    tint: ["#5b2a1c", "#a8692f"],
    notes: ["عود", "عنبر", "مسك"],
  },
  {
    slug: "cambodi-oil",
    name: "دهن عود كمبودي",
    short: "دهن عود معتّق بثبات عالٍ",
    description:
      "دهن عود كمبودي مقطّر ومعتّق، رائحة دافئة بلمسة عسلية وجلدية. قطرة واحدة تكفي لليوم كاملاً.",
    price: 220,
    unit: "3 مل",
    category: "دهن عود",
    badge: "فاخر",
    art: "bottle",
    tint: ["#2c1a12", "#7a4a22"],
    notes: ["عود معتّق", "عسل", "جلد"],
  },
  {
    slug: "oud-box",
    name: "عود كمبودي في صندوق فاخر",
    short: "قطع عود كمبودي مختارة في صندوق مخملي",
    description:
      "قطع عود كمبودي مختارة يدوياً بعروق زيتية واضحة، مقدّمة في صندوق مخملي أزرق بقفل ذهبي. مناسب للضيافة والإهداء في المناسبات.",
    price: 450,
    unit: "صندوق 250 غرام",
    category: "عود",
    badge: "فاخر",
    art: "chips",
    image: "/products/oud-box.jpg",
    tint: ["#2c1a12", "#7a4a22"],
    notes: ["عود كمبودي", "زيتي", "هدية"],
  },
  {
    slug: "indian-oud",
    name: "عود هندي فاخر",
    short: "قطع عود هندي طبيعي دبل سوبر",
    description:
      "قطع عود هندي طبيعي مختارة بعناية، غنية بالزيت. رائحة عميقة ترابية تناسب المناسبات واستقبال الضيوف.",
    price: 180,
    unit: "تولة (12 غرام)",
    category: "عود",
    art: "chips",
    image: "/products/oud-pieces.jpg",
    tint: ["#3d2316", "#8a5a33"],
    notes: ["خشبي", "ترابي", "دخاني"],
  },
  {
    slug: "moroki-bakhoor",
    name: "بخور عود مروكي",
    short: "عود مروكي للاستخدام اليومي",
    description:
      "عود مروكي بسعر مناسب ورائحة نظيفة، خيار مثالي للتبخير اليومي في المنزل والمكتب.",
    price: 65,
    oldPrice: 75,
    unit: "50 غرام",
    category: "عود",
    art: "chips",
    image: "/products/moroki-chips.jpg",
    tint: ["#4a2b1a", "#b07a45"],
    notes: ["خشبي", "منعش"],
  },
  {
    slug: "taif-rose",
    name: "بخور الورد الطائفي",
    short: "معمول بماء الورد الطائفي والعود",
    description:
      "خلطة معمول بماء ورد الطائف الأصلي مع العود الكمبودي، تجمع بين نعومة الورد وعمق العود.",
    price: 95,
    unit: "علبة 80 غرام",
    category: "بخور",
    badge: "جديد",
    art: "jar",
    tint: ["#6b2737", "#c46a6a"],
    notes: ["ورد طائفي", "عود", "زعفران"],
  },
  {
    slug: "electric-burner",
    name: "مبخرة كهربائية",
    short: "مبخرة USB قابلة للشحن",
    description:
      "مبخرة كهربائية محمولة بشحن USB، تسخين سريع بدون فحم وبدون دخان كثيف. مناسبة للسيارة والمكتب.",
    price: 120,
    unit: "قطعة",
    category: "مباخر",
    art: "electric",
    tint: ["#1f2a2e", "#4b6066"],
    notes: ["بدون فحم", "شحن USB"],
  },
  {
    slug: "brass-burner",
    name: "مبخرة نحاسية تراثية",
    short: "مبخرة نحاس منقوشة يدوياً",
    description:
      "مبخرة من النحاس المنقوش يدوياً بتصميم تراثي، قاعدة ثابتة ومقبض جانبي آمن. تضيف لمسة أصيلة لمجلسك.",
    price: 150,
    unit: "قطعة",
    category: "مباخر",
    art: "burner",
    tint: ["#3a2614", "#c08a3e"],
    notes: ["نحاس", "نقش يدوي"],
  },
  {
    slug: "gift-set",
    name: "طقم هدايا عَبَق",
    short: "معمول + دهن عود + مبخرة في صندوق فاخر",
    description:
      "صندوق هدايا يضم بخور المعمول الملكي ودهن العود الكمبودي ومبخرة كهربائية، مغلّف بعناية مع بطاقة إهداء.",
    price: 340,
    oldPrice: 425,
    unit: "صندوق",
    category: "هدايا",
    badge: "هدية",
    art: "gift",
    tint: ["#2a1b10", "#9b7135"],
    notes: ["هدية", "تغليف فاخر"],
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}
