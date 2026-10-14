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
  // التصميم المرسوم بالكود، يظهر فقط إن لم توجد صورة
  art: ArtKind;
  // مسار صورة حقيقية داخل public، مثل "/products/oud-box.jpg"
  image?: string;
  // لونان لخلفية التصميم المرسوم
  tint: [string, string];
  notes: string[];
};

// لإضافة منتج: انسخ أحد العناصر وغيّر slug (بالإنجليزية وبدون مسافات)، وضع صورته في public/products.
export const products: Product[] = [
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
    slug: "oud-super",
    name: "عود سوبر للتبخير",
    short: "قطع عود متجانسة بلون فاتح ورائحة ناعمة",
    description:
      "قطع عود مقصوصة بحجم متقارب وسطح ناعم، تشتعل بهدوء وتعطي رائحة خشبية نظيفة تناسب التبخير اليومي واستقبال الضيوف.",
    price: 120,
    unit: "50 غرام",
    category: "عود",
    badge: "جديد",
    art: "chips",
    image: "/products/oud-super.jpg",
    tint: ["#4a2b1a", "#b07a45"],
    notes: ["خشبي", "ناعم"],
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
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}
