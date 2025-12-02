/**
 * Text Component (Grid Version)
 * Simple text component for grid system
 */

'use client';

import React from 'react';

export interface TextProps {
  text?: string;
  fontSize?: number;
  color?: string;
  align?: 'left' | 'center' | 'right';
}

export const Text = ({ 
  text = 'Text', 
  fontSize = 16, 
  color = '#000', 
  align = 'left' 
}: TextProps) => {
  return (
    <p
      style={{
        fontSize: `${fontSize}px`,
        color,
        textAlign: align,
        margin: 0,
        padding: '8px',
      }}
    >
      {text}
    </p>
  );
};

