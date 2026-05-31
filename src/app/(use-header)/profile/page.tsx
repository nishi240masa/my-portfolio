import ProfileView from './_components/ProfileView';
import { profileRepo } from '@/lib/repositories';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function Page() {
  const data = await profileRepo.get();
  return <ProfileView data={data} />;
}
