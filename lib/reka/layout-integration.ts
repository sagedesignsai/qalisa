/**
 * Reka.js Layout Integration
 * Extends Reka.js AST with layout metadata
 * Creates converters between grid layout and Reka.js components
 */

import * as t from '@rekajs/types';
import type { GridLayoutItem, RekaComponentWithLayout } from '../editor/types/grid.types';
import type { GridComponentMetadata } from '../editor/types/grid.types';

/**
 * Extend Reka.js component with layout metadata
 */
export function addLayoutToRekaComponent(
  component: t.RekaComponent,
  layout: GridLayoutItem
): RekaComponentWithLayout {
  return {
    ...component,
    custom: {
      ...component.custom,
      layout: {
        x: layout.x,
        y: layout.y,
        w: layout.w,
        h: layout.h,
        minW: layout.minW,
        maxW: layout.maxW,
        minH: layout.minH,
        maxH: layout.maxH,
        locked: layout.locked,
      },
    },
  };
}

/**
 * Extract layout from Reka.js component
 */
export function getLayoutFromRekaComponent(
  component: t.RekaComponent
): GridLayoutItem | null {
  const layoutData = (component as RekaComponentWithLayout).custom?.layout;
  if (!layoutData) return null;

  // We need the component ID - this should be stored somewhere
  // For now, we'll generate it or get it from metadata
  return {
    i: component.name, // Use component name as ID temporarily
    x: layoutData.x,
    y: layoutData.y,
    w: layoutData.w,
    h: layoutData.h,
    minW: layoutData.minW,
    maxW: layoutData.maxW,
    minH: layoutData.minH,
    maxH: layoutData.maxH,
    locked: layoutData.locked,
    componentId: component.name,
    componentType: component.name,
  };
}

/**
 * Convert Grid Layout Item to Reka.js Component
 */
export function gridItemToRekaComponent(
  metadata: GridComponentMetadata,
  componentId: string
): t.RekaComponent {
  const { layout, props } = metadata;
  
  // Create a Reka component with layout metadata
  const component = t.rekaComponent({
    name: componentId,
    props: Object.entries(props).map(([key, value]) =>
      t.prop({
        key,
        value: valueToRekaValue(value),
      })
    ),
    state: [],
    template: createTemplateFromComponentType(layout.componentType, props),
  });

  // Add layout metadata
  return addLayoutToRekaComponent(component, layout);
}

/**
 * Convert Reka.js Component to Grid Layout Item
 */
export function rekaComponentToGridItem(
  component: t.RekaComponent,
  componentId: string
): GridLayoutItem | null {
  const layoutData = (component as RekaComponentWithLayout).custom?.layout;
  if (!layoutData) return null;

  return {
    i: componentId,
    x: layoutData.x,
    y: layoutData.y,
    w: layoutData.w,
    h: layoutData.h,
    minW: layoutData.minW,
    maxW: layoutData.maxW,
    minH: layoutData.minH,
    maxH: layoutData.maxH,
    locked: layoutData.locked,
    componentId,
    componentType: component.name,
  };
}

/**
 * Convert value to Reka.js value type
 */
function valueToRekaValue(value: unknown): t.Val {
  if (typeof value === 'string') {
    return t.literal({ value });
  }
  if (typeof value === 'number') {
    return t.literal({ value });
  }
  if (typeof value === 'boolean') {
    return t.literal({ value });
  }
  if (value === null || value === undefined) {
    return t.literal({ value: null });
  }
  // Default to string representation
  return t.literal({ value: String(value) });
}

/**
 * Create template from component type
 */
function createTemplateFromComponentType(
  componentType: string,
  props: Record<string, unknown>
): t.Template {
  // Map component types to templates
  switch (componentType.toLowerCase()) {
    case 'container':
      return t.tagTemplate({
        tag: 'div',
        props: {
          className: t.literal({ value: 'container' }),
          style: props.padding
            ? t.object({
                members: [
                  t.objectMember({
                    key: 'padding',
                    value: t.literal({ value: `${props.padding}px` }),
                  }),
                ],
              })
            : undefined,
        },
        children: [],
      });

    case 'text':
      return t.tagTemplate({
        tag: 'p',
        props: {
          children: t.literal({ value: (props.text as string) || 'Text' }),
        },
        children: [],
      });

    case 'button':
      return t.tagTemplate({
        tag: 'button',
        props: {
          children: t.literal({ value: (props.text as string) || 'Button' }),
        },
        children: [],
      });

    case 'heading':
      const level = (props.level as number) || 1;
      return t.tagTemplate({
        tag: `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
        props: {
          children: t.literal({ value: (props.text as string) || 'Heading' }),
        },
        children: [],
      });

    case 'image':
      return t.tagTemplate({
        tag: 'img',
        props: {
          src: t.literal({ value: (props.src as string) || '' }),
          alt: t.literal({ value: (props.alt as string) || 'Image' }),
        },
        children: [],
      });

    default:
      // Default to div
      return t.tagTemplate({
        tag: 'div',
        props: {},
        children: [],
      });
  }
}

/**
 * Extract props from Reka.js component
 */
export function extractPropsFromRekaComponent(
  component: t.RekaComponent
): Record<string, unknown> {
  const props: Record<string, unknown> = {};
  
  if (component.props) {
    for (const prop of component.props) {
      if (prop.value && 'value' in prop.value) {
        props[prop.key] = prop.value.value;
      }
    }
  }
  
  return props;
}

/**
 * Update Reka.js component props
 */
export function updateRekaComponentProps(
  component: t.RekaComponent,
  newProps: Record<string, unknown>
): t.RekaComponent {
  return {
    ...component,
    props: Object.entries(newProps).map(([key, value]) =>
      t.prop({
        key,
        value: valueToRekaValue(value),
      })
    ),
  };
}

