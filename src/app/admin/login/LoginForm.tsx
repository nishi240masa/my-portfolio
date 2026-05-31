'use client';

import { signIn } from 'next-auth/react';

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div
        style={{
          width: 360,
          padding: 40,
          border: '1px solid var(--hairline)',
          background: 'var(--bg-elev)',
          textAlign: 'center',
        }}
      >
        <div className="t-eyebrow" style={{ marginBottom: 8 }}>
          ADMIN · 管理パネル
        </div>
        <h1 style={{ fontFamily: 'var(--font-mincho)', fontSize: 24, marginBottom: 32 }}>サインイン</h1>
        <button
          type="button"
          onClick={() => signIn('google', { callbackUrl })}
          style={{
            width: '100%',
            padding: '12px 16px',
            fontFamily: 'var(--font-mincho)',
            fontSize: 14,
            border: '1px solid var(--primary)',
            background: 'var(--primary)',
            color: 'var(--primary-on)',
            cursor: 'pointer',
          }}
        >
          Google でサインイン
        </button>
        <div className="t-meta" style={{ marginTop: 24, fontSize: 11 }}>
          許可されたメールアドレスのみアクセスできます。
        </div>
      </div>
    </div>
  );
}
