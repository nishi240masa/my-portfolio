import SkillView from './_components/SkillView';
import { skillsRepo } from '@/lib/repositories';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function Page() {
  const data = await skillsRepo.get();
  return <SkillView data={data} />;
}
