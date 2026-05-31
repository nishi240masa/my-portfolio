import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  if (session?.user) {
    redirect(params.callbackUrl ?? '/admin');
  }
  return <LoginForm callbackUrl={params.callbackUrl ?? '/admin'} />;
}
