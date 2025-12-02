/**
 * Reka Provider Wrapper
 * Provides Reka instance to the editor
 */

'use client';

import { RekaProvider as RekaProviderPrimitive } from '@rekajs/react';
import { createRekaInstance } from '@/lib/reka/instance';
import { createInitialState } from '@/lib/reka/initial-state';
import { useEffect, useState } from 'react';

export function RekaProviderWrapper({ children }: { children: React.ReactNode }) {
  const [reka] = useState(() => {
    try {
      return createRekaInstance();
    } catch (error) {
      console.error('Failed to create Reka instance:', error);
      return null;
    }
  });

  useEffect(() => {
    if (!reka) return;
    
    try {
      const initialState = createInitialState();
      reka.load(initialState, { sync: false });
    } catch (error) {
      console.error('Failed to load initial state:', error);
    }
  }, [reka]);

  if (!reka) {
    // Fallback: render children without Reka provider if initialization fails
    return <>{children}</>;
  }

  return <RekaProviderPrimitive reka={reka}>{children}</RekaProviderPrimitive>;
}

