import type { Metadata } from 'next';
import ProfileView from './_components/ProfileView';
import { getProfileCached } from '@/lib/repositories';

// `getProfileCached` は `@/lib/repositories` barrel から import しており、barrel が
// `JsonProductionRepository` などを static import するため、本ページに
// `runtime = 'edge'` を明示すると webpack edge SSR entry に `node:fs` が混入する。
// barrel rework (admin epic) を待ち、Phase 2 で edge 化する。
// それまでは `revalidate` ベースの ISR で静的化し CF Pages 互換を担保する。
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'プロフィール',
  description:
    '西尾 匡生 (west) のプロフィール - 経歴・学歴・連絡先などを紹介します。受託開発のご依頼前の確認にもご覧ください。',
  alternates: { canonical: '/profile' },
};

export default async function Page() {
  const data = await getProfileCached();
  return <ProfileView data={data} />;
}
