import type { CSSProperties } from 'react';

export type WagaraKind = 'asanoha' | 'seigaiha' | 'ichimatsu';

// 麻の葉 (asanoha) — hemp leaf
const asanohaSVG = (color: string) => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 104" width="60" height="104" aria-hidden="true" focusable="false">
    <g fill="none" stroke="${color}" stroke-width="0.8" stroke-linecap="round">
      <path d="M30 0 L30 52 L60 26 Z M30 0 L30 52 L0 26 Z M30 52 L30 104 L60 78 Z M30 52 L30 104 L0 78 Z M0 26 L30 52 L0 78 Z M60 26 L30 52 L60 78 Z"/>
      <path d="M30 0 L0 26 L0 78 L30 104 L60 78 L60 26 Z"/>
      <path d="M0 26 L60 26 M0 78 L60 78 M30 0 L30 104"/>
    </g>
  </svg>`;

// 青海波 (seigaiha) — blue ocean waves
const seigaihaSVG = (color: string) => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" width="60" height="30" aria-hidden="true" focusable="false">
    <g fill="none" stroke="${color}" stroke-width="0.8">
      <circle cx="0" cy="15" r="20"/><circle cx="0" cy="15" r="14"/><circle cx="0" cy="15" r="8"/><circle cx="0" cy="15" r="2"/>
      <circle cx="30" cy="0" r="20"/><circle cx="30" cy="0" r="14"/><circle cx="30" cy="0" r="8"/><circle cx="30" cy="0" r="2"/>
      <circle cx="30" cy="30" r="20"/><circle cx="30" cy="30" r="14"/><circle cx="30" cy="30" r="8"/><circle cx="30" cy="30" r="2"/>
      <circle cx="60" cy="15" r="20"/><circle cx="60" cy="15" r="14"/><circle cx="60" cy="15" r="8"/><circle cx="60" cy="15" r="2"/>
    </g>
  </svg>`;

// 市松 (ichimatsu) — checkerboard
const ichimatsuSVG = (color: string) => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" aria-hidden="true" focusable="false">
    <rect x="0" y="0" width="20" height="20" fill="${color}"/>
    <rect x="20" y="20" width="20" height="20" fill="${color}"/>
  </svg>`;

const toDataURI = (svgString: string) =>
  `url("data:image/svg+xml;utf8,${encodeURIComponent(svgString)}")`;

/** 和柄パターンを CSS background-image (data URI) として返す */
export function wagaraBgFor(kind: WagaraKind, color = 'currentColor'): string {
  switch (kind) {
    case 'asanoha':
      return toDataURI(asanohaSVG(color));
    case 'seigaiha':
      return toDataURI(seigaihaSVG(color));
    case 'ichimatsu':
      return toDataURI(ichimatsuSVG(color));
    default:
      return '';
  }
}

/** ヒーロー等に置く大きな麻の葉メダリオン */
export function AsanohaMedallion({
  size = 280,
  color = 'currentColor',
  strokeWidth = 0.5,
  opacity = 0.5,
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
  opacity?: number;
}) {
  const rays = [];
  for (let i = 0; i < 6; i++) {
    const angle = i * 60;
    rays.push(
      <g key={i} transform={`rotate(${angle} 50 50)`}>
        <path d="M50 50 L50 10 L70 25 Z" />
        <path d="M50 50 L50 10 L30 25 Z" />
      </g>,
    );
  }
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ opacity }} aria-hidden="true" focusable="false">
      <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round">
        <circle cx="50" cy="50" r="40" />
        <circle cx="50" cy="50" r="28" />
        {rays}
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1="50"
            y1="50"
            x2={50 + 40 * Math.cos(((i * 30) * Math.PI) / 180)}
            y2={50 + 40 * Math.sin(((i * 30) * Math.PI) / 180)}
          />
        ))}
      </g>
    </svg>
  );
}

/** 角の小さな麻の葉マーク */
export function HempLeafMark({
  size = 24,
  color = 'currentColor',
  opacity = 0.55,
}: {
  size?: number;
  color?: string;
  opacity?: number;
}) {
  return (
    <svg
      viewBox="0 0 30 52"
      width={size}
      height={size * (52 / 30)}
      style={{ opacity, display: 'block' }}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke={color} strokeWidth="1" strokeLinecap="round">
        <path d="M15 0 L15 26 L30 13 Z M15 0 L15 26 L0 13 Z M15 26 L15 52 L30 39 Z M15 26 L15 52 L0 39 Z M0 13 L15 26 L0 39 Z M30 13 L15 26 L30 39 Z" />
      </g>
    </svg>
  );
}

/** 落款（朱の角印） */
export function Rakkan({
  char = '西',
  size = 36,
  fontSize = 14,
  style,
}: {
  char?: string;
  size?: number;
  fontSize?: number;
  style?: CSSProperties;
}) {
  return (
    <span
      className="rakkan"
      style={{ width: size, height: size, lineHeight: `${size}px`, fontSize, ...style }}
    >
      {char}
    </span>
  );
}
