/** ローディング（朱の三点） */
export function LoadingDots() {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: 48, justifyContent: 'center' }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'var(--primary)',
            animation: `dotPulse 1.2s ${i * 0.15}s infinite ease-in-out`,
          }}
        />
      ))}
      <style>{`
        @keyframes dotPulse {
          0%, 80%, 100% { opacity: 0.25; transform: scale(.8); }
          40% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}

/** 該当なし（無） */
export function EmptyState({
  title = '該当なし',
  subtitle = 'No matching items.',
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <div
      style={{
        padding: '80px 24px',
        textAlign: 'center',
        border: '1px dashed var(--hairline-strong)',
        borderRadius: 4,
      }}
    >
      <div style={{ fontSize: 42, fontFamily: 'var(--font-mincho)', color: 'var(--primary)', opacity: 0.5, marginBottom: 12 }}>
        無
      </div>
      <h3 className="t-h3" style={{ marginBottom: 6 }}>
        {title}
      </h3>
      <div className="t-meta">{subtitle}</div>
    </div>
  );
}

/** エラー（朱の罫線） */
export function ErrorState({ message = '予期せぬ事象が発生しました。' }: { message?: string }) {
  return (
    <div
      style={{
        padding: '60px 24px',
        textAlign: 'center',
        border: '1px solid var(--primary)',
        borderRadius: 4,
        background: 'color-mix(in oklab, var(--primary) 6%, transparent)',
      }}
    >
      <div style={{ fontSize: 42, fontFamily: 'var(--font-mincho)', color: 'var(--primary)', marginBottom: 12 }}>!</div>
      <h3 className="t-h3" style={{ marginBottom: 6 }}>
        エラー / Error
      </h3>
      <div className="t-meta">{message}</div>
    </div>
  );
}
