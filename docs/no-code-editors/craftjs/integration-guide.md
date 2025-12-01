# CraftJS Integration Guide

## Installation

Install CraftJS core package:

```bash
pnpm add @craftjs/core
```

## Basic Setup

### 1. Create Component Resolver

First, create a resolver that maps component names to React components:

```tsx
// components/craft/resolvers.tsx
import { Button } from '@/components/ui/button';
import { Container } from '@/components/craft/container';
import { Text } from '@/components/craft/text';

export const Resolvers = {
  Button,
  Container,
  Text,
};
```

### 2. Create Editable Components

Create components that can be edited in CraftJS:

```tsx
// components/craft/container.tsx
import { useNode } from '@craftjs/core';
import { Element } from '@craftjs/core';

export const Container = ({ children, padding = 0, ...props }) => {
  const { connectors: { connect, drag } } = useNode();
  
  return (
    <div
      ref={(ref) => connect(drag(ref))}
      style={{ padding }}
      {...props}
    >
      {children}
    </div>
  );
};

Container.craft = {
  props: {
    padding: 0,
  },
  rules: {
    canMoveIn: () => true,
  },
};
```

### 3. Setup Editor

Wrap your application with the Editor component:

```tsx
// app/editor/page.tsx
'use client';

import { Editor, Frame } from '@craftjs/core';
import { Resolvers } from '@/components/craft/resolvers';

export default function EditorPage() {
  return (
    <Editor resolver={Resolvers}>
      <Frame>
        <Element canvas is={Container} padding={20}>
          {/* Your components */}
        </Element>
      </Frame>
    </Editor>
  );
}
```

## Advanced Integration

### Custom Toolbar

Create a toolbar with component options:

```tsx
// components/craft/toolbar.tsx
'use client';

import { useEditor } from '@craftjs/core';
import { Button } from '@/components/ui/button';

export const Toolbar = () => {
  const { actions, query } = useEditor();
  
  const addComponent = (type: string) => {
    const node = query.node('ROOT').get();
    actions.add(
      {
        type,
        props: {},
      },
      'ROOT',
      node.data.nodes.length
    );
  };
  
  return (
    <div className="toolbar">
      <Button onClick={() => addComponent('Button')}>
        Add Button
      </Button>
      <Button onClick={() => addComponent('Text')}>
        Add Text
      </Button>
    </div>
  );
};
```

### Save/Load Functionality

```tsx
// components/craft/save-button.tsx
'use client';

import { useEditor } from '@craftjs/core';
import { Button } from '@/components/ui/button';

export const SaveButton = () => {
  const { query } = useEditor();
  
  const handleSave = async () => {
    const json = query.serialize();
    
    await fetch('/api/editor/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ json }),
    });
  };
  
  return <Button onClick={handleSave}>Save</Button>;
};
```

### Property Panel

Create a panel to edit component properties:

```tsx
// components/craft/property-panel.tsx
'use client';

import { useEditor, useNode } from '@craftjs/core';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const PropertyPanel = () => {
  const { selected } = useEditor((state) => ({
    selected: state.events.selected,
  }));
  
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));
  
  if (!selected) return null;
  
  return (
    <div className="property-panel">
      <div>
        <Label>Text</Label>
        <Input
          value={props.text || ''}
          onChange={(e) => setProp((props) => {
            props.text = e.target.value;
          })}
        />
      </div>
    </div>
  );
};
```

## Integration with Next.js

### Server-Side Rendering

CraftJS requires client-side rendering. Use dynamic imports:

```tsx
// app/editor/page.tsx
import dynamic from 'next/dynamic';

const Editor = dynamic(
  () => import('@/components/craft/editor'),
  { ssr: false }
);

export default function EditorPage() {
  return <Editor />;
}
```

### API Routes for Saving

```tsx
// app/api/editor/save/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { json } = await req.json();
  
  // Save to database
  // await prisma.editorState.create({
  //   data: {
  //     userId: session.user.id,
  //     json,
  //   },
  // });
  
  return NextResponse.json({ success: true });
}
```

## Best Practices

### 1. Component Organization

```
components/
├── craft/
│   ├── resolvers.tsx
│   ├── container.tsx
│   ├── text.tsx
│   ├── toolbar.tsx
│   └── property-panel.tsx
└── ui/
    └── button.tsx
```

### 2. Type Safety

Create TypeScript types for your components:

```tsx
// types/craft.ts
export interface CraftComponent {
  type: string;
  props: Record<string, any>;
  custom?: Record<string, any>;
}
```

### 3. Error Handling

Wrap the editor in an error boundary:

```tsx
import { ErrorBoundary } from '@/components/error-boundary';

<ErrorBoundary>
  <Editor resolver={Resolvers}>
    <Frame>
      {/* Components */}
    </Frame>
  </Editor>
</ErrorBoundary>
```

### 4. Performance Optimization

Use React.memo for expensive components:

```tsx
export const Container = React.memo(({ children, ...props }) => {
  // Component implementation
});
```

## Troubleshooting

### Common Issues

1. **Components not rendering**: Ensure resolver includes all components
2. **Drag not working**: Check that connectors are properly set up
3. **State not saving**: Verify serialization is working correctly
4. **SSR errors**: Use dynamic imports for client-only components

## Next Steps

- Read about [RekaJS Integration](../rekajs/integration-guide.md)
- Review the [Architecture](../architecture.md) document
- Check the [MVP Plan](../mvp-plan.md)

