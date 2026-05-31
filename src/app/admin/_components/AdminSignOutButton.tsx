'use client';

import { signOut } from 'next-auth/react';

export default function AdminSignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      style={{
        width: '100%',
        padding: '8px 12px',
        fontFamily: 'var(--font-mincho)',
        fontSize: 12,
        border: '1px solid var(--hairline-strong)',
        background: 'transparent',
        color: 'var(--fg)',
        cursor: 'pointer',
      }}
    >
      サインアウト
    </button>
  );
}
