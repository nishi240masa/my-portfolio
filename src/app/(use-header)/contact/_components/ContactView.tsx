import SectionHeader from '@/app/_components/design/SectionHeader';
import { Rakkan } from '@/app/_components/design/Wagara';
import type { SnsLink } from '@/types/profile';

const EMAIL = 'nishi240masa@gmail.com';

type Card = {
  kanji: string;
  eyebrow: string;
  title: string;
  description: string;
  subject: string;
  body: string;
  ctaLabel: string;
};

const CARDS: Card[] = [
  {
    kanji: '招',
    eyebrow: 'OFFER · 採用オファー',
    title: '採用オファー',
    description:
      'インターン・新卒・業務委託など、ご縁の入口として。お気軽にお声がけください。',
    subject: '【採用オファー】西尾 匡生 宛のご連絡',
    body: [
      '西尾 様',
      '',
      'はじめまして。',
      '貴社（団体）について：',
      '・',
      '',
      'ご相談したいポジション/役割：',
      '・',
      '',
      '希望する次のステップ（カジュアル面談 / 書類選考 など）：',
      '・',
      '',
      'ご返信お待ちしております。',
    ].join('\n'),
    ctaLabel: 'メールで採用相談を送る',
  },
  {
    kanji: '結',
    eyebrow: 'COLLAB · 協業相談',
    title: '協業相談',
    description:
      '個人開発・受託・共同プロジェクトなど、つくる仲間として声をかけていただけたら嬉しいです。',
    subject: '【協業のご相談】西尾 匡生 宛',
    body: [
      '西尾 様',
      '',
      'はじめまして。',
      'ご相談したい内容：',
      '・',
      '',
      '想定するスコープ / 期間 / 体制：',
      '・',
      '',
      'よろしくお願いいたします。',
    ].join('\n'),
    ctaLabel: 'メールで協業相談を送る',
  },
  {
    kanji: '談',
    eyebrow: 'CASUAL · 雑談',
    title: '雑談・カジュアル',
    description:
      '技術の話、設計の話、進路の話。何でも構いません。気軽に「飯でも」程度の連絡もどうぞ。',
    subject: '【雑談】西尾さんへ',
    body: [
      '西尾さん',
      '',
      'はじめまして / お久しぶりです。',
      '話してみたいテーマ：',
      '・',
      '',
      'よろしくお願いします。',
    ].join('\n'),
    ctaLabel: 'メールで雑談する',
  },
];

function mailto({ subject, body }: { subject: string; body: string }) {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function ContactView({ sns }: { sns: SnsLink[] }) {
  return (
    <section className="page-enter container" style={{ paddingTop: 64, paddingBottom: 80 }}>
      <SectionHeader eyebrow="CONTACT · 連絡" title="お声がけ、いつでも。" kanji="連" />

      <p
        className="t-body"
        style={{
          maxWidth: 640,
          marginBottom: 48,
          color: 'var(--fg-muted)',
          textWrap: 'pretty',
        }}
      >
        採用オファー、協業相談、雑談まで。
        以下の3つの導線からどうぞ。返信は数日いただくことがあります。
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 24,
          marginBottom: 80,
        }}
      >
        {CARDS.map((c) => {
          const descId = `contact-card-desc-${c.title}`;
          return (
            <a
              key={c.title}
              href={mailto({ subject: c.subject, body: c.body })}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                padding: 28,
                textDecoration: 'none',
                color: 'inherit',
                background: 'var(--bg-elev)',
              }}
              aria-describedby={descId}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span
                  aria-hidden="true"
                  style={{
                    fontFamily: 'var(--font-mincho)',
                    fontSize: 30,
                    color: 'var(--primary)',
                    lineHeight: 1,
                  }}
                >
                  {c.kanji}
                </span>
                <div>
                  <div className="t-eyebrow">{c.eyebrow}</div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mincho)',
                      fontSize: 20,
                      marginTop: 4,
                    }}
                  >
                    {c.title}
                  </div>
                </div>
              </div>
              <p
                id={descId}
                className="t-body"
                style={{ fontSize: 13, color: 'var(--fg-muted)', textWrap: 'pretty' }}
              >
                {c.description}
              </p>
              <span
                className="t-meta"
                style={{
                  marginTop: 'auto',
                  color: 'var(--primary)',
                  fontSize: 11,
                }}
              >
                {c.ctaLabel} →
              </span>
            </a>
          );
        })}
      </div>

      <div
        style={{
          paddingTop: 48,
          borderTop: '1px solid var(--hairline)',
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
          gap: 32,
          alignItems: 'start',
        }}
      >
        <div>
          <div className="t-eyebrow" style={{ marginBottom: 12 }}>
            DIRECT · 直接連絡
          </div>
          <div style={{ fontFamily: 'var(--font-mincho)', fontSize: 18, marginBottom: 12 }}>
            メールでもどうぞ
          </div>
          <a
            href={`mailto:${EMAIL}`}
            className="btn"
            style={{ padding: '12px 20px', display: 'inline-flex', alignItems: 'center', gap: 10 }}
          >
            <Rakkan char="封" size={24} fontSize={12} />
            <span style={{ fontFamily: 'var(--font-mincho)', fontSize: 14 }}>{EMAIL}</span>
          </a>
        </div>

        <div>
          <div className="t-eyebrow" style={{ marginBottom: 12 }}>
            SOCIAL · 各所
          </div>
          <div style={{ fontFamily: 'var(--font-mincho)', fontSize: 18, marginBottom: 12 }}>
            SNSからも
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {sns.map((s) => {
              const isExternal = s.url.startsWith('http');
              if (!s.url) return null;
              return (
                <a
                  key={s.label}
                  href={s.url}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="btn"
                  style={{ padding: '10px 16px', fontSize: 12 }}
                >
                  <span style={{ fontFamily: 'var(--font-mincho)', fontSize: 14, marginRight: 6 }}>
                    {s.label}
                  </span>
                  <span className="t-meta" style={{ fontSize: 11 }}>
                    {s.handle}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
