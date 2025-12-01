import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { WorkflowsList } from '@/components/workflows/workflows-list';

export default async function WorkflowsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Workflows</h1>
        <p className="text-muted-foreground">
          Build and manage AI agent workflows
        </p>
      </div>
      <WorkflowsList />
    </div>
  );
}

