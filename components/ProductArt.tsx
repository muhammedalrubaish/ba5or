import type { Product } from "@/lib/products";

// تصميم افتراضي لصورة المنتج يُرسم بالكود — استبدله بصورة حقيقية متى توفرت.
export function ProductArt({ product, className }: { product: Product; className?: string }) {
  if (product.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={product.image} alt={product.name} className={`${className ?? ""} product-photo`} loading="lazy" />;
  }

  const id = `art-${product.slug}`;
  const [dark, light] = product.tint;
  const showSmoke = product.art !== "gift" && product.art !== "bottle";

  return (
    <svg viewBox="0 0 300 300" className={className} role="img" aria-label={product.name}>
      <defs>
        <radialGradient id={`${id}-bg`} cx="50%" cy="38%" r="75%">
          <stop offset="0" stopColor={light} />
          <stop offset="1" stopColor={dark} />
        </radialGradient>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6e2a0" />
          <stop offset="0.5" stopColor="#cf9f48" />
          <stop offset="1" stopColor="#8a5f22" />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a2418" />
          <stop offset="1" stopColor="#140b07" />
        </linearGradient>
        <pattern id={`${id}-pat`} width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M15 3l12 12-12 12L3 15z" fill="none" stroke="#fff" strokeOpacity="0.05" />
        </pattern>
      </defs>

      <rect width="300" height="300" fill={`url(#${id}-bg)`} />
      <rect width="300" height="300" fill={`url(#${id}-pat)`} />
      <ellipse cx="150" cy="258" rx="92" ry="12" fill="#000" opacity="0.28" />

      {showSmoke && (
        <g fill="none" stroke="#fff" strokeLinecap="round" opacity="0.35" strokeWidth="3">
          <path d="M150 112c-16-14 16-26 0-40s10-22 4-34" />
          <path d="M130 116c-10-10 8-18-1-28" opacity="0.6" />
          <path d="M170 116c10-10-8-18 1-28" opacity="0.6" />
        </g>
      )}

      <Art kind={product.art} id={id} />
    </svg>
  );
}

function Art({ kind, id }: { kind: Product["art"]; id: string }) {
  const gold = `url(#${id}-gold)`;
  const glass = `url(#${id}-glass)`;

  switch (kind) {
    case "jar":
      return (
        <g>
          <rect x="88" y="146" width="124" height="110" rx="28" fill={glass} />
          <rect x="88" y="182" width="124" height="34" fill={gold} opacity="0.92" />
          <path d="M100 199h100" stroke="#2a170c" strokeWidth="2" strokeDasharray="2 6" />
          <rect x="98" y="120" width="104" height="32" rx="9" fill={gold} />
          <ellipse cx="150" cy="120" rx="22" ry="7" fill="#f6e2a0" />
          <rect x="104" y="154" width="10" height="90" rx="5" fill="#fff" opacity="0.08" />
        </g>
      );
    case "bottle":
      return (
        <g>
          <path d="M150 140l52 52-52 66-52-66z" fill={glass} stroke={gold} strokeWidth="3" />
          <path d="M150 140l20 52-20 66-20-66z" fill="#fff" opacity="0.06" />
          <path d="M98 192h104" stroke={gold} strokeWidth="2" opacity="0.7" />
          <rect x="138" y="122" width="24" height="20" rx="3" fill={gold} />
          <path d="M150 40c8 0 12 4 12 10l-4 72h-16l-4-72c0-6 4-10 12-10z" fill={gold} />
          <circle cx="150" cy="44" r="8" fill="#f6e2a0" />
        </g>
      );
    case "chips":
      return (
        <g>
          <ellipse cx="150" cy="236" rx="96" ry="22" fill={gold} />
          <ellipse cx="150" cy="230" rx="84" ry="16" fill="#6e4a1e" />
          <g fill="#2b170c" stroke="#5a351a" strokeWidth="2">
            <path d="M92 228l18-34 30 6 8 26z" />
            <path d="M138 222l10-44 28 4 6 40z" />
            <path d="M178 228l6-30 30 10-4 22z" />
            <path d="M118 232l14-20 24 10-6 14z" fill="#3d2214" />
          </g>
          <g stroke="#8a5a33" strokeWidth="1.5" opacity="0.7" fill="none">
            <path d="M104 220l10-18" />
            <path d="M156 214l2-28" />
            <path d="M166 214l-2-22" />
            <path d="M192 222l4-16" />
          </g>
        </g>
      );
    case "burner":
      return (
        <g fill={gold}>
          <path d="M88 132h124l-5 9H93z" />
          <path d="M94 144h112l-16 32h-80z" />
          <g fill="#2a170c" opacity="0.5">
            <rect x="104" y="150" width="9" height="7" rx="2" />
            <rect x="124" y="150" width="9" height="7" rx="2" />
            <rect x="145" y="150" width="9" height="7" rx="2" />
            <rect x="166" y="150" width="9" height="7" rx="2" />
            <rect x="187" y="150" width="9" height="7" rx="2" />
          </g>
          <path d="M128 176h44l-7 18h-30z" />
          <path d="M115 194h70l18 54H97z" />
          <rect x="84" y="248" width="132" height="14" rx="4" />
          <path d="M150 204l14 18-14 18-14-18z" fill="#2a170c" opacity="0.55" />
          <ellipse cx="150" cy="134" rx="40" ry="5" fill="#ff8a3d" opacity="0.7" />
        </g>
      );
    case "electric":
      return (
        <g>
          <rect x="108" y="128" width="84" height="130" rx="20" fill="#11191c" />
          <rect x="108" y="128" width="84" height="130" rx="20" fill="none" stroke={gold} strokeWidth="3" />
          <ellipse cx="150" cy="134" rx="34" ry="8" fill="#ff7a2e" />
          <ellipse cx="150" cy="134" rx="20" ry="4" fill="#ffd27a" />
          <rect x="140" y="214" width="20" height="8" rx="4" fill={gold} />
          <circle cx="150" cy="186" r="12" fill="none" stroke={gold} strokeWidth="3" />
          <path d="M150 178v8" stroke={gold} strokeWidth="3" strokeLinecap="round" />
          <rect x="116" y="140" width="8" height="100" rx="4" fill="#fff" opacity="0.06" />
        </g>
      );
    case "gift":
      return (
        <g>
          <rect x="78" y="150" width="144" height="104" rx="8" fill="#1e120a" />
          <rect x="70" y="128" width="160" height="30" rx="6" fill="#2b190d" />
          <rect x="138" y="128" width="24" height="126" fill={gold} />
          <rect x="70" y="190" width="160" height="16" fill={gold} opacity="0.85" />
          <path d="M150 128c-30-30-58-6-30 0z" fill={gold} />
          <path d="M150 128c30-30 58-6 30 0z" fill={gold} />
          <circle cx="150" cy="126" r="9" fill="#f6e2a0" />
        </g>
      );
  }
}
