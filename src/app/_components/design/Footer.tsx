import { wagaraBgFor, Rakkan } from './Wagara';

/** フッター（青海波の影 + 信条 + 落款） */
export default function Footer() {
  return (
    <footer
      style={{
        marginTop: 120,
        borderTop: '1px solid var(--hairline)',
        padding: '48px 0 32px',
        position: 'relative',
      }}
    >
      <div
        className="wagara-bg"
        style={{
          backgroundImage: wagaraBgFor('seigaiha', 'currentColor'),
          opacity: 'calc(var(--wagara-alpha) * 0.7)',
        }}
      />
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: 24,
          position: 'relative',
        }}
      >
        <div>
          <div className="t-eyebrow" style={{ marginBottom: 8 }}>
            WEST · PORTFOLIO
          </div>
          <div className="t-meta">© 2026 Masaki Nishio · 西尾 匡生</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span className="t-meta">未来のある開発を、意味のある人生を</span>
          <Rakkan size={28} fontSize={12} />
        </div>
      </div>
    </footer>
  );
}
