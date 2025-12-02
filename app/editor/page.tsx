/**
 * Editor Page
 * Main page builder editor interface
 * Wrapped with Grid Editor and Reka.js Provider
 */

'use client';

import dynamic from 'next/dynamic';
import { RekaProviderWrapper } from '@/components/editor/providers/reka-provider';
import { GridEditorProvider } from '@/components/editor/providers/grid-editor-provider';
import { EditorLayout } from '@/components/editor/layout/editor-layout';

// Client-side only rendering (requires browser APIs)
const EditorContent = dynamic(
  () =>
    Promise.resolve(function EditorContent() {
      return (
        <RekaProviderWrapper>
          <GridEditorProvider>
            <EditorLayout />
          </GridEditorProvider>
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

