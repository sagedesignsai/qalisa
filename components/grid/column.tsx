/**
 * Column Component (Grid Version)
 * Vertical column layout component for grid system
 */

'use client';

import React from 'react';

export interface ColumnProps {
  gap?: number;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
  children?: React.ReactNode;
}

export const Column = ({ 
  gap = 16, 
  align = 'stretch', 
  justify = 'start', 
  children 
}: ColumnProps) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
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

