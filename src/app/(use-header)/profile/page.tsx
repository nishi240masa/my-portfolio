import type { Metadata } from 'next';
import ProfileView from './_components/ProfileView';
import { profileRepo } from '@/lib/repositories';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'プロフィール',
  description: '西尾 匡生のプロフィール - 経歴・学歴・連絡先などを紹介します。',
  alternates: { canonical: '/profile' },
};

export default async function Page() {
  const data = await profileRepo.get();
  return <ProfileView data={data} />;
}
