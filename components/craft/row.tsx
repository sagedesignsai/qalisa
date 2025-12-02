/**
 * Row Component
 * Horizontal row layout with droppable columns
 */

'use client';

import React from 'react';

export interface RowProps {
  gap?: number;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
  children?: React.ReactNode;
}

export const Row = ({ gap = 16, align = 'stretch', justify = 'start', children }: RowProps) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: `${gap}px`,
        alignItems: align,
        justifyContent: justify,
        minHeight: '50px',
      }}
    >
      {children}
    </div>
  );
};

