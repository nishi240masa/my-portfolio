// サイト既定の OG 画像 (1200x630) — /opengraph-image
// next/og の ImageResponse で和風トーン (和紙背景 + 墨色テキスト + 朱の落款) を描画する。
// production/[id]/opengraph-image.tsx のパターン (edge / force-static) を踏襲。
// og:image / twitter:image へは file convention により自動配線される。

import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const dynamic = 'force-static';
export const revalidate = 3600;

export const alt =
  '西尾匡生 (west) — Web開発・業務自動化の受託 | 情報系学生エンジニア';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// 和紙色 / 墨色 / 朱色 — 既存 OG 実装 (production/[id]) と同じ色値を流用
const WASHI = '#fbf8f3';
const SUMI = '#1a1614';
const VERMILION = '#c1352a';
const MUTED = '#6b5e57';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: WASHI,
          fontFamily: 'Inter, sans-serif',
          padding: '72px',
          boxSizing: 'border-box',
        }}
      >
        {/* 左カラム: 朱の落款 (simple square stamp) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            marginRight: '64px',
          }}
        >
          <div
            style={{
              width: '120px',
              height: '120px',
              backgroundColor: VERMILION,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: WASHI,
              fontSize: '56px',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              borderRadius: '4px',
            }}
          >
            西
          </div>
          <div
            style={{
              marginTop: '24px',
              fontSize: '20px',
              color: MUTED,
              letterSpacing: '0.2em',
            }}
          >
            PORTFOLIO
          </div>
        </div>

        {/* 右カラム: 名前 + 受託が伝わる一言 */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: '28px',
              color: MUTED,
              letterSpacing: '0.15em',
              marginBottom: '24px',
            }}
          >
            west · Portfolio
          </div>
          <div
            style={{
              fontSize: '80px',
              fontWeight: 700,
              color: SUMI,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              // 「明朝風」を近似するため serif を太字で代用 (production/[id] と同じ)
              fontFamily: 'serif',
            }}
          >
            西尾 匡生
          </div>
          <div
            style={{
              marginTop: '32px',
              fontSize: '36px',
              color: SUMI,
              lineHeight: 1.4,
            }}
          >
            Web開発・業務自動化の受託
          </div>
          <div
            style={{
              marginTop: '16px',
              fontSize: '26px',
              color: MUTED,
            }}
          >
            Go / TypeScript · 情報系学生エンジニア
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
