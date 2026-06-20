import type { CSSProperties } from 'react';
import Image from 'next/image';

/** 縞のプレースホルダ（画像未差し替え時のモノスペース説明付き） */
export function ImagePlaceholder({
  label,
  ratio = '16/9',
  src,
  style,
  priority = false,
}: {
  label: string;
  ratio?: string;
  src?: string;
  style?: CSSProperties;
  priority?: boolean;
}) {
  if (src) {
    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: ratio,
          overflow: 'hidden',
          background: 'var(--bg-deep)',
          ...style,
        }}
      >
        <Image
          alt={label}
          src={src}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          {...(priority ? { priority: true } : { loading: 'lazy' })}
        />
      </div>
    );
  }
  return (
    <div className="img-placeholder" style={{ aspectRatio: ratio, width: '100%', ...style }}>
      [ {label} ]
    </div>
  );
}

/** 顔写真プレースホルダ（折り鶴のグリフ）。src があれば実写真を表示 */
export function PortraitPlaceholder({
  size = 320,
  label = 'PORTRAIT',
  src,
  priority = true,
}: {
  size?: number;
  label?: string;
  src?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <div
        style={{
          position: 'relative',
          width: size,
          maxWidth: '100%',
          height: size * 1.25,
          overflow: 'hidden',
          background: 'var(--bg-deep)',
          border: '1px solid var(--hairline)',
        }}
      >
        <Image
          alt={label}
          src={src}
          fill
          sizes="(max-width: 768px) 90vw, 420px"
          style={{ objectFit: 'cover' }}
          {...(priority ? { priority: true } : { loading: 'lazy' })}
        />
      </div>
    );
  }
  return (
    <div
      className="img-placeholder"
      style={{ width: size, maxWidth: '100%', height: size * 1.25, position: 'relative', overflow: 'hidden' }}
    >
      <svg viewBox="0 0 100 125" width="60%" height="60%" style={{ position: 'absolute', opacity: 0.18 }} aria-hidden="true">
        <g fill="currentColor">
          <path d="M50 30 L70 55 L60 60 L75 75 L50 70 L25 75 L40 60 L30 55 Z" />
          <path d="M50 30 L52 20 L58 22 L52 28 Z" />
        </g>
      </svg>
      <span
        style={{
          position: 'absolute',
          bottom: 12,
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.3em',
          color: 'var(--fg-muted)',
        }}
      >
        [ {label} ]
      </span>
    </div>
  );
}
