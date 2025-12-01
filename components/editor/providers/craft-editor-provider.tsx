/**
 * Craft Editor Provider
 * Wraps the editor with Craft.js Editor component
 */

'use client';

import { Editor } from '@craftjs/core';
import { Resolvers } from '@/components/craft/resolvers';
import { useEditorProjectStore } from '@/lib/editor/state/use-editor-project-store';

export function CraftEditorProvider({ children }: { children: React.ReactNode }) {
  const { setCraftJson } = useEditorProjectStore();

  const handleNodesChange = (query: any) => {
    // Serialize Craft.js state
    try {
      const json = query.serialize();
      setCraftJson(json);
    } catch (error) {
      console.error('Error serializing Craft.js state:', error);
    }
  };

  return (
    <Editor
      resolver={Resolvers}
      onNodesChange={handleNodesChange}
      enabled={true}
    >
      {children}
    </Editor>
  );
}

