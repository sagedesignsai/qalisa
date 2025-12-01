/**
 * Text Component
 * An editable text component
 */

'use client';

import { useNode } from '@craftjs/core';
import React from 'react';

export interface TextProps {
  text?: string;
  fontSize?: number;
  color?: string;
  align?: 'left' | 'center' | 'right';
}

export const Text = ({ text = 'Text', fontSize = 16, color = '#000', align = 'left' }: TextProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <p
      ref={(ref) => connect(drag(ref))}
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

Text.craft = {
  props: {
    text: 'Text',
    fontSize: 16,
    color: '#000',
    align: 'left',
  },
  displayName: 'Text',
};

