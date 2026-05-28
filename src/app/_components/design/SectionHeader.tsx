interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  kanji?: string;
  align?: 'left' | 'center';
}

/** eyebrow + 漢字一字 + 明朝見出し + sumi-line の見出しセット */
export default function SectionHeader({ eyebrow, title, kanji, align = 'left' }: SectionHeaderProps) {
  return (
    <div
      style={{
        marginBottom: 48,
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        gap: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {kanji && (
          <span
            style={{
              fontFamily: 'var(--font-mincho)',
              fontSize: 38,
              color: 'var(--primary)',
              lineHeight: 1,
              opacity: 0.85,
            }}
          >
            {kanji}
          </span>
        )}
        <div>
          <div className="t-eyebrow" style={{ marginBottom: 6 }}>
            {eyebrow}
          </div>
          <h2 className="t-h1">{title}</h2>
        </div>
      </div>
      <hr className="sumi-line" style={{ width: '100%', maxWidth: align === 'center' ? 320 : 180 }} />
    </div>
  );
}

/** 小見出し（eyebrow + 明朝） */
export function SubSection({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div className="t-eyebrow" style={{ marginBottom: 8 }}>
        {eyebrow}
      </div>
      <h3 className="t-h3" style={{ fontSize: 24 }}>
        {title}
      </h3>
    </div>
  );
}
