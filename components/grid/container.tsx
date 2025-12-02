/**
 * Container Component (Grid Version)
 * Container component for grid system
 */

'use client';

import React from 'react';

export interface ContainerProps {
  padding?: number;
  background?: string;
  children?: React.ReactNode;
}

export const Container = ({ 
  padding = 0, 
  background, 
  children 
}: ContainerProps) => {
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

