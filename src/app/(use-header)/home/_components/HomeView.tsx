import Link from 'next/link';
import SectionHeader from '@/app/_components/design/SectionHeader';
import Tategaki from '@/app/_components/design/Tategaki';
import { PortraitPlaceholder } from '@/app/_components/design/Placeholders';
import { AsanohaMedallion, HempLeafMark, Rakkan } from '@/app/_components/design/Wagara';
import type { HomeContent } from '@/types/home';

function renderMultiline(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => (
    <span key={i}>
      {line}
      {i < lines.length - 1 ? <br /> : null}
    </span>
  ));
}

export default function HomeView({ data }: { data: HomeContent }) {
  return (
    <section className="page-enter" style={{ paddingTop: 0 }}>
      {/* ===== Hero ===== */}
      <div className="container" style={{ position: 'relative', paddingTop: 80, paddingBottom: 80 }}>
        <div style={{ position: 'absolute', top: 80, right: -40, pointerEvents: 'none' }}>
          <AsanohaMedallion size={360} color="var(--primary)" opacity={0.1} strokeWidth={0.5} />
        </div>

        <div className="hero-grid">
          <div style={{ position: 'relative' }}>
            <PortraitPlaceholder size={360} label="PORTRAIT · 顔写真" src={data.portraitSrc} />
            <div
              style={{
                position: 'absolute',
                bottom: -16,
                left: -16,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'var(--bg)',
                padding: '10px 14px',
                border: '1px solid var(--hairline-strong)',
              }}
            >
              <Rakkan size={30} fontSize={13} />
              <div>
                <div style={{ fontFamily: 'var(--font-mincho)', fontSize: 14, letterSpacing: '0.1em' }}>{data.nameJp}</div>
                <div className="t-meta" style={{ marginTop: 2 }}>
                  {data.nameEn}
                </div>
              </div>
            </div>
          </div>

          <div className="hero-vline" style={{ alignSelf: 'stretch', display: 'flex', justifyContent: 'center' }}>
            <hr className="sumi-line vert" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 20, minHeight: 420 }}>
            <Tategaki
              style={{
                fontFamily: 'var(--font-mincho)',
                fontSize: 'clamp(28px, 3.4vw, 44px)',
                lineHeight: 1.75,
                letterSpacing: '0.2em',
                color: 'var(--fg)',
              }}
            >
              {renderMultiline(data.heroLeft)}
            </Tategaki>
            <Tategaki
              style={{
                fontFamily: 'var(--font-mincho)',
                fontSize: 'clamp(28px, 3.4vw, 44px)',
                lineHeight: 1.75,
                letterSpacing: '0.2em',
                color: 'var(--primary)',
                marginTop: 60,
              }}
            >
              {renderMultiline(data.heroRight)}
            </Tategaki>
          </div>
        </div>

        <div className="hero-meta-row">
          <div className="t-meta" style={{ maxWidth: 360 }}>
            {data.metaLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < data.metaLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </div>
          <Link href={data.ctaHref} className="btn btn-primary">
            {data.ctaLabel} <span style={{ opacity: 0.7 }}>→</span>
          </Link>
        </div>
      </div>

      {/* ===== Motto ===== */}
      <div className="container motto-grid" style={{ marginTop: 120, marginBottom: 80 }}>
        <div>
          <div className="t-eyebrow" style={{ marginBottom: 12 }}>
            {data.mottoEyebrow}
          </div>
          <h2 className="t-h2" style={{ marginBottom: 16 }}>
            {renderMultiline(data.mottoTitle)}
          </h2>
        </div>
        <div className="t-body" style={{ color: 'var(--fg)', maxWidth: 600, textWrap: 'pretty' }}>
          {data.mottoBody}
          <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/profile" className="btn">
              詳しく見る <span style={{ opacity: 0.5 }}>→</span>
            </Link>
            <Link href="/production" className="btn">
              作品を見る <span style={{ opacity: 0.5 }}>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ===== Section index ===== */}
      <div className="container" style={{ marginTop: 120 }}>
        <SectionHeader eyebrow="INDEX · 目次" title="Sections" kanji="目" />
        <div className="index-grid">
          {data.indexItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="card"
              style={{
                textDecoration: 'none',
                padding: 28,
                background: 'var(--bg-elev)',
                color: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
                minHeight: 280,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-mincho)', fontSize: 48, color: 'var(--primary)', lineHeight: 1, opacity: 0.85 }}>
                  {item.n}
                </span>
                <HempLeafMark size={20} opacity={0.35} />
              </div>
              <div style={{ marginTop: 'auto' }}>
                <div className="t-eyebrow" style={{ marginBottom: 6 }}>
                  {item.en}
                </div>
                <h3 className="t-h2" style={{ fontSize: 28, marginBottom: 8 }}>
                  {item.jp}
                </h3>
                <div className="t-body" style={{ fontSize: 13, color: 'var(--fg-muted)' }}>
                  {item.desc}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
