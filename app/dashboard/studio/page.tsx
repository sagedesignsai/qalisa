import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { StudioDashboard } from '@/components/studio/studio-dashboard';

export default async function StudioPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  return <StudioDashboard userId={session.user.id} />;
}

