import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { WorkflowEditor } from '@/components/workflows/workflow-editor';

export default async function WorkflowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const { id } = await params;

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b p-4">
        <h1 className="text-2xl font-semibold">Workflow Editor</h1>
      </div>
      <div className="flex-1">
        <WorkflowEditor workflowId={id} />
      </div>
    </div>
  );
}

