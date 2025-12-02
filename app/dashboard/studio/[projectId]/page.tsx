import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getProjectById } from '@/lib/studio/services/project-service';
import { projectMessagesToUIMessages } from '@/lib/studio/utils/project-message-converter';
import { StudioProjectPage } from '@/components/studio/studio-project-page';

export default async function StudioProjectPageRoute({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const { projectId } = await params;
  const project = await getProjectById(projectId, session.user.id);

  if (!project) {
    redirect('/dashboard/studio');
  }

  // Convert embedded project messages to UIMessage format
  const projectMessages = projectMessagesToUIMessages(
    project.messages || []
  );

  // Get source count from project sources
  const sourceCount = project.sources?.length || 0;

  // Get chat title from linked chat if available, otherwise use project title
  let chatTitle = project.title;
  let validChatId: string | undefined = project.chatId || undefined;

  if (project.chatId) {
    // Optionally load chat title if needed, but use project as primary source
    const { getChatById } = await import('@/lib/ai/db');
    const chat = await getChatById(project.chatId, session.user.id);
    if (chat) {
      chatTitle = chat.title || project.title;
    } else {
      // Chat not found - clear invalid chatId from project
      const { updateProject } = await import('@/lib/studio/services/project-service');
      try {
        await updateProject(projectId, session.user.id, { chatId: null });
        validChatId = undefined;
      } catch (error) {
        console.error('Error clearing invalid chatId from project:', error);
      }
    }
  }

  return (
    <StudioProjectPage
      project={project}
      chatId={validChatId}
      chatTitle={chatTitle}
      initialMessages={projectMessages}
      sourceCount={sourceCount}
    />
  );
}

