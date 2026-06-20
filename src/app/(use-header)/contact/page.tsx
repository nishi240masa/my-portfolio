import type { Metadata } from 'next';
import ContactView from './_components/ContactView';
import { profileSchema } from '@/lib/schemas/profile';
import profileData from '../../../../data/profile.json';

// data ソースは repositories barrel ではなく data/profile.json を静的 import で取り込み、
// profileSchema で validation する (node:fs を edge bundle から排除する目的)。
//
// runtime は Phase 2 で 'edge' に明示移行予定 (#28 レビュー応答):
// `src/app/layout.tsx` が `profileRepo` 経由で repositories barrel に依存しているため、
// 子ページに 'edge' を明示すると layout 経由で node:fs が edge bundle に混入する。
// layout.tsx と repositories barrel の rework と合わせて edge 化する。

export const metadata: Metadata = {
  title: 'Contact',
  description:
    '西尾 匡生への連絡先。採用オファー・協業相談・雑談など、お気軽にどうぞ。',
  alternates: { canonical: '/contact' },
};

export default async function Page() {
  const profile = profileSchema.parse(profileData);
  return <ContactView sns={profile.sns} />;
}
