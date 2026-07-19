import type { Metadata } from 'next';
import ServicesView from './_components/ServicesView';
import servicesData from '../../../../data/services.json';
import { servicesSchema } from '@/lib/schemas';

// data/services.json を static import + Zod parse で読み込む (src/lib/i18n.ts の
// landing.json パターンを踏襲)。node:fs を使わないため edge runtime 互換。
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'お仕事のご依頼',
  description:
    'LPコーディング・業務自動化ツール (GAS/Python)・スクレイピング・Chrome拡張・既存コードの改修など、受託できる内容と想定納期のご案内。',
  alternates: { canonical: '/services' },
};

export default function Page() {
  const data = servicesSchema.parse(servicesData);
  return <ServicesView data={data} />;
}
