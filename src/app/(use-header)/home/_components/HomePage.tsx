import Link from 'next/link';
import SectionHeader from '@/app/_components/design/SectionHeader';
import Tategaki from '@/app/_components/design/Tategaki';
import { PortraitPlaceholder } from '@/app/_components/design/Placeholders';
import { AsanohaMedallion, HempLeafMark, Rakkan } from '@/app/_components/design/Wagara';

const INDEX_ITEMS = [
  { href: '/production', n: '壱', en: 'Production', jp: '作品集', desc: 'GoとReact、IoTで形にしたもの。' },
  { href: '/profile', n: '弐', en: 'Profile', jp: '人物像', desc: '歩いてきた道と、関心の在り処。' },
  { href: '/skill', n: '参', en: 'Skill', jp: '技能', desc: '段位で示す、現在地。' },
];

export default function HomePage() {
  return (
    <section className="page-enter" style={{ paddingTop: 0 }}>
      {/* ===== Hero（保守 静）===== */}
      <div className="container" style={{ position: 'relative', paddingTop: 80, paddingBottom: 80 }}>
        <div style={{ position: 'absolute', top: 80, right: -40, pointerEvents: 'none' }}>
          <AsanohaMedallion size={360} color="var(--primary)" opacity={0.1} strokeWidth={0.5} />
        </div>

        <div className="hero-grid">
          {/* 左 — 顔写真 */}
          <div style={{ position: 'relative' }}>
            <PortraitPlaceholder size={360} label="PORTRAIT · 顔写真" src="/my_home.jpg" />
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
                <div style={{ fontFamily: 'var(--font-mincho)', fontSize: 14, letterSpacing: '0.1em' }}>西尾 匡生</div>
                <div className="t-meta" style={{ marginTop: 2 }}>
                  NISHIO MASAKI
                </div>
              </div>
            </div>
          </div>

          {/* 中央 — 縦の罫線 */}
          <div className="hero-vline" style={{ alignSelf: 'stretch', display: 'flex', justifyContent: 'center' }}>
            <hr className="sumi-line vert" />
          </div>

          {/* 右 — 縦書きキャッチ */}
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
              未来のある
              <br />
              開発を、
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
              意味のある
              <br />
              人生を。
            </Tategaki>
          </div>
        </div>

        <div className="hero-meta-row">
          <div className="t-meta" style={{ maxWidth: 360 }}>
            SOFTWARE ENGINEER · BACKEND
            <br />
            愛知工業大学 情報科学部 · Aichi Institute of Technology
          </div>
          <Link href="/production" className="btn btn-primary">
            作品を見る · View Works <span style={{ opacity: 0.7 }}>→</span>
          </Link>
        </div>
      </div>

      {/* ===== Motto / About teaser ===== */}
      <div className="container motto-grid" style={{ marginTop: 120, marginBottom: 80 }}>
        <div>
          <div className="t-eyebrow" style={{ marginBottom: 12 }}>
            MOTTO · 信条
          </div>
          <h2 className="t-h2" style={{ marginBottom: 16 }}>
            手に馴染む、
            <br />
            意味のあるもの。
          </h2>
        </div>
        <div className="t-body" style={{ color: 'var(--fg)', maxWidth: 600, textWrap: 'pretty' }}>
          愛知工業大学で情報科学を学ぶ学生エンジニア。Go と REST、DDD を軸に、フロントエンドからインフラまで、
          ひとつのプロダクトを通して仕立てるのが好きです。誠実な設計と、静かな佇まいのコードを心がけています。
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
          {INDEX_ITEMS.map((item) => (
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
