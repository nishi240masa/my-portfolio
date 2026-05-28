import type { CSSProperties, ReactNode } from 'react';

interface TategakiProps {
  children: ReactNode;
  style?: CSSProperties;
  /** モバイルで横書きにフォールバックする（既定: true） */
  mobileHorizontal?: boolean;
  upright?: boolean;
  className?: string;
}

/** 縦書きブロック（モバイルでは横書きにフォールバック） */
export default function Tategaki({
  children,
  style,
  mobileHorizontal = true,
  upright = false,
  className = '',
}: TategakiProps) {
  const cls = ['tategaki', upright ? 'upright' : '', mobileHorizontal ? 'tategaki-mobile-off' : '', className]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={cls} style={style}>
      {children}
    </div>
  );
}
