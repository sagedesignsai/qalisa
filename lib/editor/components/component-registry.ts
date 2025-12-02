/**
 * Component Registry
 * Central registry for all available editor components
 */

import type { ComponentDefinition } from '../types/component.types';
import { Container } from '@/components/craft/container';
import { Text } from '@/components/craft/text';
import { Button } from '@/components/craft/button';
import { 
  Type, 
  Square, 
  Image as ImageIcon, 
  Heading1, 
  Layout, 
  Columns,
  Minus,
  Layers,
  FileText,
} from 'lucide-react';

export const componentRegistry: ComponentDefinition[] = [
  {
    id: 'container',
    name: 'Container',
    category: 'layout',
    icon: 'Square',
    description: 'A container with droppable area',
    defaultProps: { padding: 20 },
    isContainer: true,
  },
  {
    id: 'text',
    name: 'Text',
    category: 'content',
    icon: 'Type',
    description: 'Text content',
    defaultProps: { text: 'Text', fontSize: 16 },
    isContainer: false,
  },
  {
    id: 'button',
    name: 'Button',
    category: 'commonly-used',
    icon: 'Square',
    description: 'Clickable button',
    defaultProps: { text: 'Button', variant: 'default' },
    isContainer: false,
  },
  {
    id: 'heading',
    name: 'Heading',
    category: 'content',
    icon: 'Heading1',
    description: 'Heading text (h1-h6)',
    defaultProps: { text: 'Heading', level: 1 },
    isContainer: false,
  },
  {
    id: 'image',
    name: 'Image',
    category: 'media',
    icon: 'Image',
    description: 'Image component',
    defaultProps: { src: '', alt: 'Image' },
    isContainer: false,
  },
  {
    id: 'row',
    name: 'Row',
    category: 'layout',
    icon: 'Layout',
    description: 'Horizontal row layout',
    defaultProps: { gap: 16 },
    isContainer: true,
  },
  {
    id: 'column',
    name: 'Column',
    category: 'layout',
    icon: 'Columns',
    description: 'Vertical column layout',
    defaultProps: { gap: 16 },
    isContainer: true,
  },
  {
    id: 'divider',
    name: 'Divider',
    category: 'layout',
    icon: 'Minus',
    description: 'Horizontal divider line',
    defaultProps: {},
    isContainer: false,
  },
  {
    id: 'spacer',
    name: 'Spacer',
    category: 'layout',
    icon: 'Layers',
    description: 'Empty space',
    defaultProps: { height: 20 },
    isContainer: false,
  },
];

export function getComponentById(id: string): ComponentDefinition | undefined {
  return componentRegistry.find((c) => c.id === id);
}

export function getComponentsByCategory(category: string): ComponentDefinition[] {
  if (category === 'all') {
    return componentRegistry;
  }
  return componentRegistry.filter((c) => c.category === category);
}

