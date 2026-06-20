import type { Metadata } from 'next';
import ProfileView from './_components/ProfileView';
import { getProfileCached } from '@/lib/repositories';

// Phase 2 で edge 化予定 (#28 レビュー応答):
// `@/lib/repositories` barrel 経由で node:fs が edge bundle に混入するため、
// barrel rework が完了する admin Phase まで Next.js default (nodejs) のままにする。
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'プロフィール',
  description: '西尾 匡生のプロフィール - 経歴・学歴・連絡先などを紹介します。',
  alternates: { canonical: '/profile' },
};

export default async function Page() {
  const data = await getProfileCached();
  return <ProfileView data={data} />;
}
