import { store } from "@/lib/config";

// شعار عَبَق: مبخرة تقليدية يتصاعد منها ثلاث خيوط بخور
export function LogoMark({ size = 44, id = "logo" }: { size?: number; id?: string }) {
  const g = `${id}-gold`;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3d98b" />
          <stop offset="0.55" stopColor="#c9973f" />
          <stop offset="1" stopColor="#8f6424" />
        </linearGradient>
      </defs>
      <g fill="none" stroke={`url(#${g})`} strokeWidth="2.2" strokeLinecap="round">
        <path d="M32 24c-5-4 5-7.5 0-11.5s3-6.5 1.5-10" />
        <path d="M25.5 24.5c-3.5-3 3-5 .2-8.5" opacity="0.8" />
        <path d="M38.5 24.5c3.5-3-3-5-.2-8.5" opacity="0.8" />
      </g>
      <g fill={`url(#${g})`}>
        <path d="M18.5 26h27l-1 2.2h-25z" />
        <path d="M20 28.6h24l-3.4 6.8H23.4z" />
        <path d="M27.4 35.4h9.2l-1.6 4h-6z" />
        <path d="M24.5 39.4h15l4 12.6h-23z" />
        <rect x="16.5" y="52.6" width="31" height="4.6" rx="1.4" />
      </g>
      <path d="M32 41.8l3.2 4.3-3.2 4.3-3.2-4.3z" fill="#1a0f0a" opacity="0.55" />
      <g fill="#1a0f0a" opacity="0.5">
        <rect x="21" y="29.6" width="2" height="1.6" rx="0.5" />
        <rect x="26.5" y="29.6" width="2" height="1.6" rx="0.5" />
        <rect x="31" y="29.6" width="2" height="1.6" rx="0.5" />
        <rect x="35.5" y="29.6" width="2" height="1.6" rx="0.5" />
        <rect x="41" y="29.6" width="2" height="1.6" rx="0.5" />
      </g>
    </svg>
  );
}

export function Logo({ id = "logo", compact = false }: { id?: string; compact?: boolean }) {
  return (
    <span className="logo">
      <LogoMark id={id} size={compact ? 36 : 44} />
      <span className="logo-text">
        <span className="logo-name">{store.name}</span>
        {!compact && <span className="logo-latin">{store.nameLatin} · {store.tagline}</span>}
      </span>
    </span>
  );
}
