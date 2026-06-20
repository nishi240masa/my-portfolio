import type { Metadata } from 'next';
import ProfileView from './_components/ProfileView';
import { getProfileCached } from '@/lib/repositories';

export const runtime = 'nodejs';
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
