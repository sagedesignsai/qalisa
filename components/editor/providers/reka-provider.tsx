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
  const [reka] = useState(() => createRekaInstance());

  useEffect(() => {
    const initialState = createInitialState();
    reka.load(initialState);
  }, [reka]);

  return <RekaProviderPrimitive reka={reka}>{children}</RekaProviderPrimitive>;
}

