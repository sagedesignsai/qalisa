'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Trash2, Loader2 } from 'lucide-react';

interface WorkflowToolbarProps {
  onAddNode: (type: string) => void;
  onDelete: () => void;
  canDelete: boolean;
  isSaving?: boolean;
}

export function WorkflowToolbar({
  onAddNode,
  onDelete,
  canDelete,
  isSaving = false,
}: WorkflowToolbarProps) {
  const handleAddNode = (type: string) => {
    onAddNode(type);
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border bg-background p-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="outline">
            <Plus className="mr-2 size-4" />
            Add Node
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => handleAddNode('agent')}>
            Agent
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddNode('tool')}>
            Tool
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddNode('condition')}>
            Condition
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddNode('action')}>
            Action
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        size="sm"
        variant="outline"
        onClick={onDelete}
        disabled={!canDelete}
      >
        <Trash2 className="mr-2 size-4" />
        Delete
      </Button>

      {isSaving && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          <span>Saving...</span>
        </div>
      )}
    </div>
  );
}

