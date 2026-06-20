import type { Metadata } from 'next';
import { profileRepo } from '@/lib/repositories';
import ContactView from './_components/ContactView';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    '西尾 匡生への連絡先。採用オファー・協業相談・雑談など、お気軽にどうぞ。',
  alternates: { canonical: '/contact' },
};

export default async function Page() {
  const profile = await profileRepo.get();
  return <ContactView sns={profile.sns} />;
}
