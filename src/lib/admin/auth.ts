// 管理 API ルートで利用する認証ガード
import { auth } from '@/auth';

export async function requireAdmin(): Promise<Response | null> {
  const session = await auth();
  if (!session?.user?.email) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
