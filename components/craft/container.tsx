/**
 * Container Component
 * Following Craft.js tutorial pattern
 * When used with <Element canvas is={Container}>, the Element itself is the droppable region
 * Container just renders its children directly
 */

'use client';

import React from 'react';

export interface ContainerProps {
  padding?: number;
  background?: string;
  children?: React.ReactNode;
}

export const Container = ({ padding = 0, background, children }: ContainerProps) => {
  return (
    <div
      className="w-full min-h-[400px]"
      style={{
        padding: `${padding}px`,
        background: background || 'transparent',
        minHeight: '400px',
        width: '100%',
      }}
    >
      {children}
    </div>
  );
};

