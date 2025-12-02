/**
 * Heading Component (Grid Version)
 * Simple heading component for grid system
 */

'use client';

import React from 'react';

export interface HeadingProps {
  text?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  align?: 'left' | 'center' | 'right';
}

export const Heading = ({ 
  text = 'Heading', 
  level = 1, 
  align = 'left' 
}: HeadingProps) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag
      style={{
        textAlign: align,
        margin: 0,
        padding: '8px',
        fontWeight: level === 1 ? 700 : level === 2 ? 600 : 500,
        fontSize: level === 1 ? '2rem' : level === 2 ? '1.5rem' : level === 3 ? '1.25rem' : '1rem',
      }}
    >
      {text}
    </Tag>
  );
};

