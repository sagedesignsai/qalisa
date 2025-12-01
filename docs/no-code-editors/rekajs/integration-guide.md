# RekaJS Integration Guide

## Installation

Install RekaJS core and React packages:

```bash
pnpm add @rekajs/core @rekajs/types @rekajs/react
```

For collaboration features:

```bash
pnpm add @rekajs/collaboration yjs y-webrtc
```

## Basic Setup

### 1. Create Reka Instance

```tsx
// lib/reka/instance.ts
import { Reka } from '@rekajs/core';

export const createRekaInstance = () => {
  return Reka.create({
    externals: {
      functions: [
        // External functions
      ],
      components: [
        // External components
      ],
    },
    extensions: [
      // Extensions
    ],
  });
};
```

### 2. Initialize State

```tsx
// lib/reka/initial-state.ts
import * as t from '@rekajs/types';

export const createInitialState = () => {
  return t.state({
    program: t.program({
      components: [
        t.rekaComponent({
          name: 'App',
          props: [],
          state: [],
          template: t.tagTemplate({
            tag: 'div',
            props: {},
            children: [],
          }),
        }),
      ],
    }),
  });
};
```

### 3. Setup React Provider

```tsx
// components/reka/reka-provider.tsx
'use client';

import { RekaProvider } from '@rekajs/react';
import { createRekaInstance } from '@/lib/reka/instance';
import { createInitialState } from '@/lib/reka/initial-state';
import { useEffect, useState } from 'react';

export function RekaProviderWrapper({ children }: { children: React.ReactNode }) {
  const [reka] = useState(() => createRekaInstance());
  
  useEffect(() => {
    const initialState = createInitialState();
    reka.load(initialState);
  }, [reka]);
  
  return <RekaProvider reka={reka}>{children}</RekaProvider>;
}
```

## Advanced Integration

### External Functions

Expose utility functions for use in templates:

```tsx
// lib/reka/externals.ts
import * as t from '@rekajs/types';

export const externalFunctions = [
  t.externalFunc({
    name: 'getCurrentTime',
    func: () => Date.now(),
  }),
  t.externalFunc({
    name: 'formatCurrency',
    func: (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    },
  }),
];
```

### External Components

Expose React components for use in templates:

```tsx
// lib/reka/externals.ts
import * as t from '@rekajs/types';
import { Button } from '@/components/ui/button';

export const externalComponents = [
  t.externalComponent({
    name: 'Button',
    component: Button,
  }),
];
```

### Custom Extensions

Create extensions for custom functionality:

```tsx
// lib/reka/extensions.ts
import { createExtension } from '@rekajs/core';

export const CommentExtension = createExtension({
  key: 'comments',
  state: {
    comments: [] as Array<{
      templateId: string;
      content: string;
      author: string;
    }>,
  },
  init: (extension) => {
    // Initialize extension logic
  },
});
```

### Creating and Rendering Frames

```tsx
// components/reka/frame-renderer.tsx
'use client';

import { useReka } from '@rekajs/react';
import { RekaView } from '@rekajs/react';
import { useEffect, useState } from 'react';
import * as t from '@rekajs/types';

export function FrameRenderer({ componentName, props }: {
  componentName: string;
  props?: Record<string, any>;
}) {
  const { reka } = useReka();
  const [frame, setFrame] = useState(null);
  
  useEffect(() => {
    const createFrame = async () => {
      const frameProps = Object.entries(props || {}).reduce(
        (acc, [key, value]) => {
          acc[key] = t.literal({ value });
          return acc;
        },
        {} as Record<string, t.Expression>
      );
      
      const newFrame = await reka.createFrame({
        id: `frame-${Date.now()}`,
        component: {
          name: componentName,
          props: frameProps,
        },
      });
      
      setFrame(newFrame);
    };
    
    createFrame();
  }, [reka, componentName, props]);
  
  if (!frame) return <div>Loading...</div>;
  
  return <RekaView view={frame.view} />;
}
```

## Integration with Next.js

### Server-Side State Loading

```tsx
// app/api/reka/state/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Load state from database
  // const state = await prisma.rekaState.findFirst({
  //   where: { userId: session.user.id },
  // });
  
  return NextResponse.json({ state: null });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { state } = await req.json();
  
  // Save state to database
  // await prisma.rekaState.upsert({
  //   where: { userId: session.user.id },
  //   create: {
  //     userId: session.user.id,
  //     state: JSON.stringify(state),
  //   },
  //   update: {
  //     state: JSON.stringify(state),
  //   },
  // });
  
  return NextResponse.json({ success: true });
}
```

### Client-Side State Management

```tsx
// hooks/use-reka-state.ts
'use client';

import { useReka } from '@rekajs/react';
import { useEffect } from 'react';

export function useRekaState() {
  const { reka } = useReka();
  
  const saveState = async () => {
    const state = reka.state;
    
    await fetch('/api/reka/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state }),
    });
  };
  
  const loadState = async () => {
    const response = await fetch('/api/reka/state');
    const { state } = await response.json();
    
    if (state) {
      reka.load(state);
    }
  };
  
  return { saveState, loadState };
}
```

## Collaboration Setup

### WebRTC Collaboration

```tsx
// lib/reka/collaboration.ts
import { Reka } from '@rekajs/core';
import { createCollabExtension } from '@rekajs/collaboration';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';

export const createCollaborativeReka = (roomId: string) => {
  const doc = new Y.Doc();
  const type = doc.getMap('reka-editor');
  
  const reka = Reka.create({
    extensions: [createCollabExtension(type)],
  });
  
  reka.load(t.unflatten(type.getMap('document')));
  
  const provider = new WebrtcProvider(roomId, doc);
  
  return { reka, provider, doc };
};
```

## Best Practices

### 1. State Organization

```
lib/reka/
├── instance.ts
├── initial-state.ts
├── externals.ts
├── extensions.ts
└── collaboration.ts
```

### 2. Component Structure

```
components/reka/
├── reka-provider.tsx
├── frame-renderer.tsx
└── state-editor.tsx
```

### 3. Type Safety

Create TypeScript types for your state:

```tsx
// types/reka.ts
import type { State } from '@rekajs/types';

export interface CustomRekaState extends State {
  extensions: {
    comments: CommentExtensionState;
  };
}
```

### 4. Error Handling

```tsx
try {
  const frame = await reka.createFrame({
    id: 'my-frame',
    component: { name: 'MyComponent' },
  });
} catch (error) {
  console.error('Failed to create frame:', error);
}
```

### 5. Performance

- Cache frames when possible
- Use React.memo for expensive components
- Debounce state updates
- Optimize view computation

## Troubleshooting

### Common Issues

1. **State not loading**: Ensure state structure matches expected format
2. **Components not rendering**: Check that components exist in state
3. **External functions not working**: Verify externals are properly configured
4. **Collaboration not syncing**: Check WebRTC connection and Yjs setup

## Next Steps

- Read about [CraftJS Integration](../craftjs/integration-guide.md)
- Review the [Architecture](../architecture.md) document
- Check the [MVP Plan](../mvp-plan.md)

