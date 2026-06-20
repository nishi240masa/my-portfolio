// 動的 OG 画像 (1200x630) — /production/[id]/opengraph-image
// next/og の ImageResponse を使い、washi 背景に朱の落款 + タイトル + role/stack を描画する。
//
// Hina Mincho の取り込みは Web フォント取得が必要で複雑なため別PR。
// ここでは next/og の組み込みフォント (Inter) で描画する。

import { ImageResponse } from 'next/og';
import { notFound } from 'next/navigation';
import productionsData from '../../../../../../data/productions.json';

// 静的 import パターン (articles/journal/contact と同じ) を採用し、
// `@/lib/repositories` barrel 経由の node:fs 混入を回避して edge runtime 化。
// データは build 時に bundle へ inline され、static asset として配信される。
// admin 編集で productions.json が更新されると CF Pages は次回 build で反映。
export const runtime = 'edge';
export const dynamic = 'force-static';
export const revalidate = 3600;

type ProductionItem = {
  id: number;
  title: string;
  role?: string;
  technologys?: string[];
  date?: string;
};

const findById = (id: number): ProductionItem | null =>
  (productionsData as ProductionItem[]).find((p) => p.id === id) ?? null;

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// 動的 alt — タイトルを反映して a11y / SEO 向上
export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) {
    return [{ id: 'default', alt: 'Production cover image', size, contentType }];
  }
  const article = findById(numericId);
  const alt =
    article == null ? 'Production cover image' : `${article.title} のカバー画像`;
  return [{ id: 'default', alt, size, contentType }];
}

// 和紙色 / 朱色 — 既存のテーマ感に近いトーン
const WASHI = '#fbf8f3';
const SUMI = '#1a1614';
const VERMILION = '#c1352a';
const MUTED = '#6b5e57';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = Number(id);
  // soft-404 防止: 数値化失敗や該当記事不在ならルートとして 404 を返す
  if (!Number.isFinite(numericId)) {
    notFound();
  }
  const article = findById(numericId);
  if (article == null) {
    notFound();
  }

  const title = article.title;
  const role = article.role ?? '';
  const stack = (article.technologys ?? []).slice(0, 6).join(' / ');
  const date = article.date ?? '';

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
          position: 'relative',
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

        {/* 右カラム: タイトル + stack/date */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontSize: '28px',
                color: MUTED,
                letterSpacing: '0.15em',
                marginBottom: '24px',
              }}
            >
              PRODUCTION
            </div>
            <div
              style={{
                fontSize: '72px',
                fontWeight: 700,
                color: SUMI,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                // 「明朝風」を近似するため、Inter を太字で代用
                fontFamily: 'serif',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {title}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              fontSize: '28px',
              color: SUMI,
            }}
          >
            {role ? (
              <div style={{ display: 'flex' }}>
                <span style={{ color: MUTED, marginRight: '16px' }}>ROLE</span>
                <span>{role}</span>
              </div>
            ) : null}
            {stack ? (
              <div style={{ display: 'flex' }}>
                <span style={{ color: MUTED, marginRight: '16px' }}>STACK</span>
                <span>{stack}</span>
              </div>
            ) : null}
            {date ? (
              <div style={{ display: 'flex' }}>
                <span style={{ color: MUTED, marginRight: '16px' }}>DATE</span>
                <span>{date}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
