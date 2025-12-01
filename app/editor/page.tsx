/**
 * Editor Page
 * Main page builder editor interface
 * Wrapped with Craft.js Editor and Reka.js Provider
 */

'use client';

import dynamic from 'next/dynamic';
import { RekaProviderWrapper } from '@/components/editor/providers/reka-provider';
import { CraftEditorProvider } from '@/components/editor/providers/craft-editor-provider';
import { EditorLayout } from '@/components/editor/layout/editor-layout';

// Client-side only rendering for Craft.js (requires browser APIs)
const EditorContent = dynamic(
  () =>
    Promise.resolve(function EditorContent() {
      return (
        <RekaProviderWrapper>
          <CraftEditorProvider>
            <EditorLayout />
          </CraftEditorProvider>
        </RekaProviderWrapper>
      );
    }),
  { ssr: false }
);

export default function EditorPage() {
  return (
    <div className="h-screen w-screen">
      <EditorContent />
    </div>
  );
}

