/**
 * Container Component
 * A draggable container component with droppable Canvas area
 */

'use client';

import { useNode } from '@craftjs/core';
import { Canvas } from '@craftjs/core';
import React from 'react';

export interface ContainerProps {
  padding?: number;
  background?: string;
  children?: React.ReactNode;
}

export const Container = ({ padding = 0, background, children }: ContainerProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      style={{
        padding: `${padding}px`,
        background: background || 'transparent',
        minHeight: '50px',
      }}
    >
      <Canvas id="container-canvas">{children}</Canvas>
    </div>
  );
};

Container.craft = {
  props: {
    padding: 0,
    background: 'transparent',
  },
  rules: {
    canMoveIn: () => true,
  },
  displayName: 'Container',
};

