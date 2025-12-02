'use client';

import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

interface GenerationStatusProps {
  projectId: string;
}

export function GenerationStatus({ projectId }: GenerationStatusProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Generating media assets...');

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/studio/projects/${projectId}`);
        if (response.ok) {
          const { project } = await response.json();
          setStatus(project.status);
          
          // Calculate progress based on status
          if (project.status === 'GENERATING') {
            setProgress(0.5);
          } else if (project.status === 'READY') {
            setProgress(1.0);
            clearInterval(interval);
          } else if (project.status === 'FAILED') {
            setProgress(0);
            clearInterval(interval);
          }
        }
      } catch (error) {
        console.error('Error checking status:', error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [projectId]);

  return (
    <div className="p-8">
      <div className="max-w-md mx-auto">
        <h3 className="text-lg font-semibold mb-4">Generating Video</h3>
        <Progress value={progress * 100} className="mb-2" />
        <p className="text-sm text-muted-foreground text-center">{status}</p>
      </div>
    </div>
  );
}

