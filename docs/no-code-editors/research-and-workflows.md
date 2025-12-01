# RekaJS & CraftJS Research and Workflows

## Overview

This document provides comprehensive research findings on RekaJS advanced features, CraftJS integration patterns, and UI/UX workflows for building a Gutenberg-like page builder system.

## Table of Contents

1. [RekaJS Advanced Features](#rekajs-advanced-features)
2. [CraftJS Integration Patterns](#craftjs-integration-patterns)
3. [State Synchronization](#state-synchronization)
4. [UI/UX Workflows](#uiux-workflows)
5. [Best Practices](#best-practices)
6. [Implementation Patterns](#implementation-patterns)

---

## RekaJS Advanced Features

### 1. EachTemplate (Loops/Lists)

EachTemplate enables rendering elements multiple times from a list, similar to React's `map()` function.

#### Structure

```typescript
interface EachTemplate {
  type: 'EachTemplate';
  iterator: Expression;        // Array or function that returns array
  alias: string;               // Variable name for current item (e.g., 'item', 'post')
  indexAlias?: string;         // Optional variable name for index
  template: Template;          // Template to render for each item
}
```

#### Example: Rendering a List of Posts

```typescript
import * as t from '@rekajs/types';

t.rekaComponent({
  name: 'PostList',
  props: [
    t.componentProp({
      name: 'posts',
      init: t.literal({ 
        value: [
          { name: 'Post 1', description: 'Description 1', image: 'url1' },
          { name: 'Post 2', description: 'Description 2', image: 'url2' }
        ] 
      }),
    }),
  ],
  state: [],
  template: t.tagTemplate({
    tag: 'div',
    props: {},
    children: [
      t.eachTemplate({
        iterator: t.identifier({ name: 'posts' }),
        alias: 'post',
        indexAlias: 'index',
        template: t.componentTemplate({
          component: t.identifier({ name: 'Card' }),
          props: {
            name: t.memberExpression({
              object: t.identifier({ name: 'post' }),
              property: t.identifier({ name: 'name' }),
            }),
            description: t.memberExpression({
              object: t.identifier({ name: 'post' }),
              property: t.identifier({ name: 'description' }),
            }),
            image: t.memberExpression({
              object: t.identifier({ name: 'post' }),
              property: t.identifier({ name: 'image' }),
            }),
          },
        }),
      }),
    ],
  }),
})
```

#### Using External Functions for Data Fetching

```typescript
// Register external function
const reka = Reka.create({
  externals: {
    functions: [
      t.externalFunc({
        name: 'getPosts',
        func: async () => {
          const response = await fetch('/api/posts');
          return response.json();
        },
      }),
    ],
  },
});

// Use in template
t.eachTemplate({
  iterator: t.callExpression({
    identifier: {
      name: 'getPosts',
      external: true,
    },
    params: {},
  }),
  alias: 'post',
  template: t.tagTemplate({
    tag: 'div',
    props: {},
    children: [
      t.tagTemplate({
        tag: 'text',
        props: {
          value: t.memberExpression({
            object: t.identifier({ name: 'post' }),
            property: t.identifier({ name: 'name' }),
          }),
        },
      }),
    ],
  }),
})
```

#### Key Features

- **Iterator Expression**: Can be an identifier (variable), call expression (function), or member expression (object property)
- **Variable Exposure**: The `alias` variable is available within the template scope
- **Index Access**: Optional `indexAlias` provides access to the current index
- **Nested Loops**: EachTemplate can be nested for multi-dimensional arrays

### 2. ConditionalTemplate

ConditionalTemplate enables conditional rendering based on expressions.

#### Structure

```typescript
interface ConditionalTemplate {
  type: 'ConditionalTemplate';
  condition: Expression;      // Boolean expression
  true: Template;             // Template when condition is true
  false: Template;            // Template when condition is false
}
```

#### Example: Conditional Visibility

```typescript
t.rekaComponent({
  name: 'ConditionalComponent',
  props: [],
  state: [
    t.val({
      name: 'counter',
      init: t.literal({ value: 0 }),
    }),
    t.val({
      name: 'isVisible',
      init: t.literal({ value: true }),
    }),
  ],
  template: t.conditionalTemplate({
    condition: t.binaryExpression({
      left: t.identifier({ name: 'counter' }),
      operator: '>',
      right: t.literal({ value: 0 }),
    }),
    true: t.tagTemplate({
      tag: 'div',
      props: {},
      children: [
        t.tagTemplate({
          tag: 'text',
          props: {
            value: t.literal({ value: 'Counter is greater than 0' }),
          },
        }),
      ],
    }),
    false: t.tagTemplate({
      tag: 'div',
      props: {},
      children: [
        t.tagTemplate({
          tag: 'text',
          props: {
            value: t.literal({ value: 'Counter is 0 or less' }),
          },
        }),
      ],
    }),
  }),
})
```

#### Complex Conditional Expressions

```typescript
// Multiple conditions with logical operators
t.conditionalTemplate({
  condition: t.binaryExpression({
    left: t.binaryExpression({
      left: t.identifier({ name: 'counter' }),
      operator: '>',
      right: t.literal({ value: 0 }),
    }),
    operator: '===',
    right: t.literal({ value: true }),
  }),
  true: t.tagTemplate({ /* ... */ }),
  false: t.tagTemplate({ /* ... */ }),
})

// Using member expressions
t.conditionalTemplate({
  condition: t.memberExpression({
    object: t.identifier({ name: 'user' }),
    property: t.identifier({ name: 'isAuthenticated' }),
  }),
  true: t.tagTemplate({ /* ... */ }),
  false: t.tagTemplate({ /* ... */ }),
})
```

### 3. Component State Management

RekaJS components can have internal state using `Val` statements.

#### Basic State

```typescript
t.rekaComponent({
  name: 'Counter',
  props: [
    t.componentProp({
      name: 'initialValue',
      init: t.literal({ value: 0 }),
    }),
  ],
  state: [
    t.val({
      name: 'count',
      init: t.identifier({ name: 'initialValue' }), // Initialize from prop
    }),
  ],
  template: t.tagTemplate({
    tag: 'div',
    props: {},
    children: [
      t.tagTemplate({
        tag: 'text',
        props: {
          value: t.identifier({ name: 'count' }),
        },
      }),
      t.tagTemplate({
        tag: 'button',
        props: {
          onClick: t.func({
            params: [],
            body: [
              t.val({
                name: 'count',
                init: t.binaryExpression({
                  left: t.identifier({ name: 'count' }),
                  operator: '+',
                  right: t.literal({ value: 1 }),
                }),
              }),
            ],
          }),
        },
        children: [
          t.tagTemplate({
            tag: 'text',
            props: {
              value: t.literal({ value: 'Increment' }),
            },
          }),
        ],
      }),
    ],
  }),
})
```

#### Multiple State Variables

```typescript
state: [
  t.val({
    name: 'text',
    init: t.literal({ value: 'Bye' }),
  }),
  t.val({
    name: 'counter',
    init: t.literal({ value: 0 }),
  }),
  t.val({
    name: 'isLoading',
    init: t.literal({ value: false }),
  }),
]
```

### 4. Global Variables

Global variables can be accessed across all components.

#### Implementation Pattern

```typescript
// In RekaJS state
const state = t.state({
  program: t.program({
    components: [
      // Components here
    ],
    externals: {
      functions: [
        t.externalFunc({
          name: 'getGlobalVar',
          func: (name: string) => {
            // Access global variables
            return globalVars[name];
          },
        }),
      ],
    },
  }),
  extensions: {
    globalVars: {
      text: 'Bye',
      counter: 0,
      theme: 'dark',
    },
  },
});
```

### 5. Component Props

Components can accept props that can be used in templates.

#### Prop Definition

```typescript
t.rekaComponent({
  name: 'Card',
  props: [
    t.componentProp({
      name: 'name',
      init: t.literal({ value: 'Default Name' }),
    }),
    t.componentProp({
      name: 'description',
      init: t.literal({ value: '' }),
    }),
    t.componentProp({
      name: 'image',
      init: t.literal({ value: '' }),
    }),
  ],
  state: [],
  template: t.tagTemplate({
    tag: 'div',
    props: {},
    children: [
      t.tagTemplate({
        tag: 'img',
        props: {
          src: t.identifier({ name: 'image' }),
        },
      }),
      t.tagTemplate({
        tag: 'h2',
        props: {},
        children: [
          t.tagTemplate({
            tag: 'text',
            props: {
              value: t.identifier({ name: 'name' }),
            },
          }),
        ],
      }),
      t.tagTemplate({
        tag: 'p',
        props: {},
        children: [
          t.tagTemplate({
            tag: 'text',
            props: {
              value: t.identifier({ name: 'description' }),
            },
          }),
        ],
      }),
    ],
  }),
})
```

#### Using Props in ComponentTemplate

```typescript
t.componentTemplate({
  component: t.identifier({ name: 'Card' }),
  props: {
    name: t.literal({ value: 'Interesting Post' }),
    description: t.literal({ value: 'This is a description' }),
    image: t.literal({ value: 'https://example.com/image.jpg' }),
  },
})
```

#### Dynamic Props from Loops

```typescript
t.eachTemplate({
  iterator: t.identifier({ name: 'posts' }),
  alias: 'post',
  template: t.componentTemplate({
    component: t.identifier({ name: 'Card' }),
    props: {
      name: t.memberExpression({
        object: t.identifier({ name: 'post' }),
        property: t.identifier({ name: 'name' }),
      }),
      description: t.memberExpression({
        object: t.identifier({ name: 'post' }),
        property: t.identifier({ name: 'description' }),
      }),
      image: t.memberExpression({
        object: t.identifier({ name: 'post' }),
        property: t.identifier({ name: 'image' }),
      }),
    },
  }),
})
```

### 6. External Functions

External functions allow calling JavaScript functions from RekaJS templates.

#### Registration

```typescript
const reka = Reka.create({
  externals: {
    functions: [
      t.externalFunc({
        name: 'formatDate',
        func: (timestamp: number) => {
          return new Date(timestamp).toLocaleDateString();
        },
      }),
      t.externalFunc({
        name: 'formatCurrency',
        func: (amount: number, currency: string = 'USD') => {
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
          }).format(amount);
        },
      }),
      t.externalFunc({
        name: 'getPosts',
        func: async () => {
          const response = await fetch('/api/posts');
          return response.json();
        },
      }),
    ],
  },
});
```

#### Usage in Templates

```typescript
t.tagTemplate({
  tag: 'div',
  props: {},
  children: [
    t.tagTemplate({
      tag: 'text',
      props: {
        value: t.callExpression({
          identifier: {
            name: 'formatDate',
            external: true,
          },
          params: {
            timestamp: t.identifier({ name: 'currentTime' }),
          },
        }),
      },
    }),
  ],
})
```

### 7. External Components

External components allow using React components within RekaJS templates.

#### Registration

```typescript
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const reka = Reka.create({
  externals: {
    components: [
      t.externalComponent({
        name: 'Button',
        component: Button,
      }),
      t.externalComponent({
        name: 'Input',
        component: Input,
      }),
    ],
  },
});
```

#### Usage

```typescript
t.componentTemplate({
  component: t.identifier({ name: 'Button' }),
  props: {
    onClick: t.func({
      params: [],
      body: [
        t.val({
          name: 'counter',
          init: t.binaryExpression({
            left: t.identifier({ name: 'counter' }),
            operator: '+',
            right: t.literal({ value: 1 }),
          }),
        }),
      ],
    }),
    variant: t.literal({ value: 'primary' }),
  },
})
```

---

## CraftJS Integration Patterns

### 1. Basic Editor Setup

```typescript
import { Editor, Frame, Element } from '@craftjs/core';

const Resolvers = {
  Container: Container,
  Text: Text,
  Button: Button,
  Card: Card,
};

function EditorPage() {
  return (
    <Editor resolver={Resolvers}>
      <Frame>
        <Element canvas is={Container} padding={20}>
          {/* Components */}
        </Element>
      </Frame>
    </Editor>
  );
}
```

### 2. Component Resolvers

Resolvers map component names to React components.

```typescript
// lib/blocks/resolvers.tsx
import { Container } from '@/components/blocks/container';
import { Text } from '@/components/blocks/text';
import { Button } from '@/components/blocks/button';
import { Card } from '@/components/blocks/card';

export const Resolvers = {
  Container,
  Text,
  Button,
  Card,
  // Add more components as needed
};
```

### 3. Editable Components

Components must use `useNode` hook to be editable.

```typescript
import { useNode } from '@craftjs/core';

export const Text = ({ content }) => {
  const { 
    connectors: { connect, drag },
    actions: { setProp },
    isSelected 
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  return (
    <p
      ref={(ref) => connect(drag(ref))}
      className={isSelected ? 'selected' : ''}
      onClick={() => setProp((props) => {
        // Edit logic
      })}
    >
      {content}
    </p>
  );
};

Text.craft = {
  props: {
    content: 'Default text',
  },
  rules: {
    canMoveIn: () => true,
  },
};
```

### 4. Container Components with Canvas

Containers can have droppable regions using `Canvas`.

```typescript
import { Canvas } from '@craftjs/core';
import { useNode } from '@craftjs/core';

export const Container = ({ children, padding = 0 }) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      style={{ padding }}
    >
      <Canvas id="container-canvas">
        {children}
      </Canvas>
    </div>
  );
};
```

### 5. Serialization

CraftJS state can be serialized to JSON.

```typescript
import { useEditor } from '@craftjs/core';

function SaveButton() {
  const { query } = useEditor();

  const handleSave = () => {
    const json = query.serialize();
    // Save to database
    fetch('/api/editor/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ json }),
    });
  };

  return <button onClick={handleSave}>Save</button>;
}
```

### 6. Loading State

```typescript
function EditorPage({ projectId }) {
  const [json, setJson] = useState(null);

  useEffect(() => {
    fetch(`/api/editor/projects/${projectId}`)
      .then(res => res.json())
      .then(data => setJson(data.craftJson));
  }, [projectId]);

  return (
    <Editor resolver={Resolvers}>
      <Frame json={json}>
        {/* Components */}
      </Frame>
    </Editor>
  );
}
```

---

## State Synchronization

### 1. CraftJS to RekaJS Conversion

Converting CraftJS node tree to RekaJS AST.

```typescript
// lib/editor/logic/craft-to-reka.ts
import type { Node } from '@craftjs/core';
import * as t from '@rekajs/types';

export function craftNodeToRekaTemplate(node: Node): t.Template {
  const { type, props, nodes } = node.data;

  // Convert props to RekaJS expressions
  const rekaProps: Record<string, t.Expression> = {};
  Object.entries(props).forEach(([key, value]) => {
    rekaProps[key] = valueToExpression(value);
  });

  // Convert children
  const children: t.Template[] = [];
  if (nodes && nodes.length > 0) {
    nodes.forEach((childId: string) => {
      const childNode = getNodeById(childId);
      if (childNode) {
        children.push(craftNodeToRekaTemplate(childNode));
      }
    });
  }

  // Check if it's a component or tag
  if (typeof type === 'string' && type.startsWith('text')) {
    return t.tagTemplate({
      tag: 'text',
      props: {
        value: rekaProps.value || t.literal({ value: '' }),
      },
    });
  }

  if (typeof type === 'string') {
    return t.tagTemplate({
      tag: type,
      props: rekaProps,
      children,
    });
  }

  // Component template
  return t.componentTemplate({
    component: t.identifier({ name: type.displayName || type.name }),
    props: rekaProps,
  });
}

function valueToExpression(value: any): t.Expression {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return t.literal({ value });
  }
  if (typeof value === 'object' && value !== null) {
    // Check if it's already an expression
    if (value.type) {
      return value as t.Expression;
    }
    // Convert object to literal
    return t.literal({ value });
  }
  return t.literal({ value: null });
}
```

### 2. RekaJS to CraftJS Conversion

Converting RekaJS AST to CraftJS nodes.

```typescript
// lib/editor/logic/reka-to-craft.ts
import * as t from '@rekajs/types';
import type { Node } from '@craftjs/core';

export function rekaTemplateToCraftNode(
  template: t.Template,
  nodeId: string
): Node {
  switch (template.type) {
    case 'TagTemplate':
      return {
        id: nodeId,
        data: {
          type: template.tag,
          props: expressionToValue(template.props),
          nodes: template.children.map((child, index) => 
            rekaTemplateToCraftNode(child, `${nodeId}-${index}`).id
          ),
          displayName: template.tag,
          custom: {},
          parent: null,
          isCanvas: false,
          hidden: false,
          linkedNodes: {},
        },
      };

    case 'ComponentTemplate':
      return {
        id: nodeId,
        data: {
          type: template.component.name,
          props: expressionToValue(template.props),
          nodes: [],
          displayName: template.component.name,
          custom: {},
          parent: null,
          isCanvas: false,
          hidden: false,
          linkedNodes: {},
        },
      };

    case 'ConditionalTemplate':
      // Convert to a wrapper component
      return {
        id: nodeId,
        data: {
          type: 'ConditionalWrapper',
          props: {
            condition: template.condition,
            trueTemplate: template.true,
            falseTemplate: template.false,
          },
          nodes: [],
          displayName: 'Conditional',
          custom: {},
          parent: null,
          isCanvas: false,
          hidden: false,
          linkedNodes: {},
        },
      };

    case 'EachTemplate':
      // Convert to a wrapper component
      return {
        id: nodeId,
        data: {
          type: 'EachWrapper',
          props: {
            iterator: template.iterator,
            alias: template.alias,
            indexAlias: template.indexAlias,
            template: template.template,
          },
          nodes: [],
          displayName: 'Each',
          custom: {},
          parent: null,
          isCanvas: false,
          hidden: false,
          linkedNodes: {},
        },
      };

    default:
      throw new Error(`Unknown template type: ${(template as any).type}`);
  }
}

function expressionToValue(expressions: Record<string, t.Expression>): Record<string, any> {
  const values: Record<string, any> = {};
  Object.entries(expressions).forEach(([key, expr]) => {
    values[key] = expressionToValueHelper(expr);
  });
  return values;
}

function expressionToValueHelper(expr: t.Expression): any {
  switch (expr.type) {
    case 'Literal':
      return expr.value;
    case 'Identifier':
      return { __identifier: expr.name };
    case 'BinaryExpression':
      return { __binary: { left: expr.left, operator: expr.operator, right: expr.right } };
    case 'CallExpression':
      return { __call: { name: expr.identifier.name, params: expr.params } };
    case 'MemberExpression':
      return { __member: { object: expr.object, property: expr.property.name } };
    default:
      return null;
  }
}
```

### 3. Bidirectional Sync

Synchronizing changes between CraftJS and RekaJS.

```typescript
// lib/editor/logic/state-sync.ts
import { useEditor } from '@craftjs/core';
import { useReka } from '@rekajs/react';
import { craftNodeToRekaTemplate } from './craft-to-reka';
import { rekaTemplateToCraftNode } from './reka-to-craft';

export function useStateSync() {
  const { query, actions } = useEditor();
  const { reka } = useReka();

  // Sync CraftJS changes to RekaJS
  const syncCraftToReka = useCallback(() => {
    const nodes = query.getNodes();
    const rootNode = nodes['ROOT'];
    
    if (rootNode) {
      reka.change(() => {
        const rekaTemplate = craftNodeToRekaTemplate(rootNode);
        // Update RekaJS state
        const component = reka.state.program.components.find(c => c.name === 'App');
        if (component) {
          component.template = rekaTemplate;
        }
      });
    }
  }, [query, reka]);

  // Sync RekaJS changes to CraftJS
  const syncRekaToCraft = useCallback(() => {
    const component = reka.state.program.components.find(c => c.name === 'App');
    if (component) {
      const craftNode = rekaTemplateToCraftNode(component.template, 'ROOT');
      // Update CraftJS state
      const json = JSON.stringify({ ROOT: craftNode });
      actions.deserialize(json);
    }
  }, [reka, actions]);

  return { syncCraftToReka, syncRekaToCraft };
}
```

---

## UI/UX Workflows

### 1. Three-Panel Layout Workflow

#### Left Sidebar - Component Palette

**User Flow:**
1. User opens editor → Left sidebar shows component palette
2. User searches for component (Ctrl+F) → Filtered results appear
3. User clicks/drags component → Component added to canvas
4. User selects component → Right sidebar shows properties

**Implementation:**
```typescript
// components/editor/left-sidebar/component-palette.tsx
function ComponentPalette() {
  const [searchQuery, setSearchQuery] = useState('');
  const { addComponent } = useComponentPaletteStore();

  const filteredComponents = useMemo(() => {
    return components.filter(comp => 
      comp.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div>
      <ComponentSearch 
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search for widget... (Ctrl + F)"
      />
      <CommonlyUsedSection />
      <LayoutElementsSection />
    </div>
  );
}
```

#### Center Canvas - Visual Editing

**User Flow:**
1. User drags component to canvas → Component appears
2. User clicks component → Component selected, breadcrumb updates
3. User drags component → Component moves
4. User resizes component → Size updates in real-time
5. User edits content → Inline editing or property panel

**Implementation:**
```typescript
// components/editor/canvas/craft-editor-wrapper.tsx
function CraftEditorWrapper() {
  const { zoom, viewportSize } = useEditorUIStore();
  const { selectedElementId } = useEditorUIStore();

  return (
    <div style={{ transform: `scale(${zoom / 100})` }}>
      <Editor resolver={Resolvers}>
        <Frame>
          <CraftCanvas />
        </Frame>
      </Editor>
    </div>
  );
}
```

#### Right Sidebar - Property Panel

**User Flow:**
1. User selects element → Property panel shows element properties
2. User edits property → Value updates in real-time
3. User adds loop → Loop section appears, iterator input shown
4. User adds conditional → Conditional section appears, condition input shown
5. User changes CSS classes → Class list updates

**Implementation:**
```typescript
// components/editor/right-sidebar/property-panel.tsx
function PropertyPanel() {
  const { selectedElementId } = useEditorUIStore();
  const element = useSelectedElement();

  if (!element) return null;

  return (
    <div>
      <VisibilitySection element={element} />
      <PaddingAlignmentSection element={element} />
      {element.type === 'EachTemplate' && (
        <LoopSection element={element} />
      )}
      {element.type === 'ConditionalTemplate' && (
        <ConditionalSection element={element} />
      )}
      <ClassListSection element={element} />
      <ComponentPropsSection element={element} />
    </div>
  );
}
```

### 2. Loop Configuration Workflow

**User Flow:**
1. User selects element → Right sidebar shows properties
2. User clicks "Add Loop" → Loop section expands
3. User enters iterator expression (e.g., `$getPosts()`) → Expression validated
4. User sets alias (e.g., "post") → Variable exposed in template
5. User toggles "Add index variable" → Index variable available
6. User edits template → Template rendered for each item

**Implementation:**
```typescript
// components/editor/right-sidebar/property-sections/loop-section.tsx
function LoopSection({ element }) {
  const { updateElement } = useEditorProjectStore();

  const handleIteratorChange = (expression: string) => {
    updateElement(element.id, {
      iterator: parseExpression(expression),
    });
  };

  const handleAliasChange = (alias: string) => {
    updateElement(element.id, {
      alias,
    });
  };

  return (
    <div>
      <ExpressionInput
        label="Iterator"
        value={element.iterator}
        onChange={handleIteratorChange}
        placeholder="$getPosts()"
      />
      <Input
        label="For"
        value={element.alias}
        onChange={handleAliasChange}
        placeholder="post"
      />
      <Toggle
        label="Add index variable"
        checked={!!element.indexAlias}
        onChange={(checked) => {
          updateElement(element.id, {
            indexAlias: checked ? 'index' : undefined,
          });
        }}
      />
    </div>
  );
}
```

### 3. Conditional Rendering Workflow

**User Flow:**
1. User selects element → Right sidebar shows properties
2. User clicks "Add Conditional" → Conditional section expands
3. User enters condition (e.g., `counter > 0`) → Expression validated
4. User edits true branch → Template for true condition
5. User edits false branch → Template for false condition
6. User sees preview → Conditional rendering shown

**Implementation:**
```typescript
// components/editor/right-sidebar/property-sections/conditional-section.tsx
function ConditionalSection({ element }) {
  const { updateElement } = useEditorProjectStore();

  const handleConditionChange = (expression: string) => {
    updateElement(element.id, {
      condition: parseExpression(expression),
    });
  };

  return (
    <div>
      <ExpressionInput
        label="Condition"
        value={element.condition}
        onChange={handleConditionChange}
        placeholder="counter > 0"
      />
      <TemplateEditor
        label="True"
        template={element.true}
        onChange={(template) => {
          updateElement(element.id, { true: template });
        }}
      />
      <TemplateEditor
        label="False"
        template={element.false}
        onChange={(template) => {
          updateElement(element.id, { false: template });
        }}
      />
    </div>
  );
}
```

### 4. Component State Management Workflow

**User Flow:**
1. User opens left sidebar → "App" section shows Props, State, Template
2. User clicks "Add State" → State variable dialog appears
3. User enters name and initial value → State variable added
4. User uses state in template → State value displayed
5. User updates state via interaction → State updates, view re-renders

**Implementation:**
```typescript
// components/editor/left-sidebar/app-context-section/state-section.tsx
function StateSection() {
  const { reka } = useReka();
  const component = reka.state.program.components.find(c => c.name === 'App');

  const addState = (name: string, init: t.Expression) => {
    reka.change(() => {
      component.state.push(t.val({ name, init }));
    });
  };

  const updateState = (name: string, init: t.Expression) => {
    reka.change(() => {
      const stateVar = component.state.find(s => s.name === name);
      if (stateVar) {
        stateVar.init = init;
      }
    });
  };

  return (
    <div>
      <h3>State</h3>
      {component.state.map((stateVar) => (
        <StateVariableEditor
          key={stateVar.name}
          variable={stateVar}
          onUpdate={updateState}
        />
      ))}
      <Button onClick={() => openAddStateDialog(addState)}>
        Add State Variable
      </Button>
    </div>
  );
}
```

### 5. Global Variables Workflow

**User Flow:**
1. User opens left sidebar → "Global Variables" section visible
2. User clicks "Add Variable" → Variable dialog appears
3. User enters name, type, and value → Variable added
4. User uses variable in expressions → Variable accessible everywhere
5. User updates variable → All usages update

**Implementation:**
```typescript
// components/editor/left-sidebar/global-variables-section.tsx
function GlobalVariablesSection() {
  const { globalVariables, addGlobalVariable } = useRekaStateStore();

  return (
    <div>
      <h3>Global Variables</h3>
      {Object.entries(globalVariables).map(([name, value]) => (
        <VariableEditor
          key={name}
          name={name}
          value={value}
          onUpdate={(newValue) => {
            updateGlobalVariable(name, newValue);
          }}
        />
      ))}
      <Button onClick={() => openAddVariableDialog(addGlobalVariable)}>
        Add Variable
      </Button>
    </div>
  );
}
```

---

## Best Practices

### 1. Component Organization

- **Separate editable components from display components**
- **Use resolvers for dynamic component resolution**
- **Keep component props serializable** (no functions, classes, circular references)
- **Use TypeScript for type safety**

### 2. State Management

- **Use Zustand for UI state** (panels, zoom, selection)
- **Use RekaJS for component logic state** (props, state, templates)
- **Use CraftJS for visual editing state** (node tree, positions)
- **Sync states bidirectionally** with debouncing

### 3. Performance

- **Debounce state updates** to prevent excessive recomputation
- **Memoize expensive computations** using React.memo
- **Lazy load components** that aren't immediately needed
- **Cache computed views** when possible
- **Use React.memo for expensive components**

### 4. Error Handling

- **Validate expressions** before execution
- **Handle errors gracefully** with error boundaries
- **Show user-friendly error messages**
- **Log errors for debugging**

### 5. User Experience

- **Provide visual feedback** for all actions
- **Show loading states** during async operations
- **Implement undo/redo** functionality
- **Add keyboard shortcuts** for common actions
- **Provide tooltips** and help text
- **Show validation errors** inline

### 6. Expression Handling

- **Validate expressions** before saving
- **Provide autocomplete** for variables and functions
- **Show expression preview** when possible
- **Handle expression errors** gracefully
- **Support common operators** and functions

---

## Implementation Patterns

### 1. Expression Input Component

```typescript
// components/editor/right-sidebar/property-controls/expression-input.tsx
function ExpressionInput({ value, onChange, placeholder }) {
  const [input, setInput] = useState(expressionToString(value));
  const [error, setError] = useState(null);

  const handleChange = (newValue: string) => {
    setInput(newValue);
    try {
      const parsed = parseExpression(newValue);
      setError(null);
      onChange(parsed);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <Input
        value={input}
        onChange={handleChange}
        placeholder={placeholder}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}
```

### 2. Variable Selector

```typescript
// components/editor/right-sidebar/property-controls/variable-selector.tsx
function VariableSelector({ onSelect }) {
  const { reka } = useReka();
  const component = reka.state.program.components.find(c => c.name === 'App');
  
  const availableVariables = [
    ...component.props.map(p => ({ name: p.name, type: 'prop' })),
    ...component.state.map(s => ({ name: s.name, type: 'state' })),
    // Add global variables
  ];

  return (
    <Select onValueChange={onSelect}>
      {availableVariables.map(v => (
        <SelectItem key={v.name} value={v.name}>
          {v.name} ({v.type})
        </SelectItem>
      ))}
    </Select>
  );
}
```

### 3. Template Editor

```typescript
// components/editor/shared/template-editor.tsx
function TemplateEditor({ template, onChange }) {
  const { reka } = useReka();

  return (
    <div>
      <ComponentPalette onSelect={(component) => {
        const newTemplate = t.componentTemplate({
          component: t.identifier({ name: component }),
          props: {},
        });
        onChange(newTemplate);
      }} />
      <TemplateTree
        template={template}
        onUpdate={onChange}
      />
    </div>
  );
}
```

---

## References

- [RekaJS Official Documentation](https://reka.js.org/docs/introduction)
- [CraftJS Official Documentation](https://craft.js.org/docs/overview)
- [RekaJS GitHub Repository](https://github.com/prevwong/reka)
- [CraftJS GitHub Repository](https://github.com/prevwong/craft.js)

