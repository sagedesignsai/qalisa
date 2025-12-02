'use client';

import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GenerationStatus {
  projectId: string;
  status: 'DRAFT' | 'GENERATING' | 'READY' | 'EXPORTING' | 'COMPLETED' | 'FAILED';
  progress: number;
  currentStep?: string;
  completedSteps?: string[];
  error?: string;
  agentVersion?: string;
}

interface GenerationStatusEnhancedProps {
  projectId: string;
}

const AGENT_STEPS = [
  'Script generation',
  'Media generation',
  'Track alignment',
  'Composition creation',
] as const;

export function GenerationStatusEnhanced({ projectId }: GenerationStatusEnhancedProps) {
  const [status, setStatus] = useState<GenerationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/studio/projects/${projectId}/generation-status`);
        if (response.ok) {
          const data = await response.json();
          setStatus(data);
          setIsLoading(false);

          // Stop polling if generation is complete or failed
          if (data.status === 'READY' || data.status === 'COMPLETED' || data.status === 'FAILED') {
            return;
          }
        }
      } catch (error) {
        console.error('Error fetching generation status:', error);
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchStatus();

    // Poll every 2 seconds while generating
    const interval = setInterval(() => {
      if (status?.status === 'GENERATING' || status?.status === 'EXPORTING') {
        fetchStatus();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [projectId, status?.status]);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!status) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">Unable to load generation status</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStepStatus = (step: string) => {
    if (status.completedSteps?.includes(step)) {
      return 'completed';
    }
    if (status.currentStep === step || status.currentStep?.toLowerCase().includes(step.toLowerCase())) {
      return 'active';
    }
    return 'pending';
  };

  const getStepIcon = (stepStatus: string) => {
    switch (stepStatus) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'active':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Video Generation Status</CardTitle>
              {status.agentVersion && (
                <Badge variant="outline">{status.agentVersion}</Badge>
              )}
            </div>
            <CardDescription>
              {status.currentStep || 'Preparing generation...'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{Math.round(status.progress * 100)}%</span>
              </div>
              <Progress value={status.progress * 100} />
            </div>

            {/* Error Display */}
            {status.error && (
              <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-destructive">Generation Failed</p>
                  <p className="text-sm text-muted-foreground mt-1">{status.error}</p>
                </div>
              </div>
            )}

            {/* Agent Steps */}
            {status.agentVersion && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Generation Steps</h4>
                <div className="space-y-3">
                  {AGENT_STEPS.map((step, index) => {
                    const stepStatus = getStepStatus(step);
                    return (
                      <div
                        key={step}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                          stepStatus === 'active'
                            ? 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
                            : stepStatus === 'completed'
                            ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
                            : 'bg-muted/50 border-border'
                        }`}
                      >
                        {getStepIcon(stepStatus)}
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium ${
                              stepStatus === 'active'
                                ? 'text-blue-900 dark:text-blue-100'
                                : stepStatus === 'completed'
                                ? 'text-green-900 dark:text-green-100'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {step}
                          </p>
                          {stepStatus === 'active' && status.currentStep && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {status.currentStep}
                            </p>
                          )}
                        </div>
                        {stepStatus === 'completed' && (
                          <Badge variant="outline" className="text-xs">
                            Done
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Status Badge */}
            <div className="flex items-center justify-center pt-4">
              <Badge
                variant={
                  status.status === 'COMPLETED' || status.status === 'READY'
                    ? 'default'
                    : status.status === 'FAILED'
                    ? 'destructive'
                    : 'secondary'
                }
                className="text-sm"
              >
                {status.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

