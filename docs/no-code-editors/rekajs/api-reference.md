# RekaJS API Reference

## Reka Instance

### Reka.create()

Creates a new Reka instance.

```tsx
import { Reka } from '@rekajs/core';

const reka = Reka.create(options?);
```

#### Options

```tsx
interface RekaOptions {
  externals?: {
    functions?: ExternalFunc[];
    components?: ExternalComponent[];
  };
  extensions?: Extension[];
}
```

### reka.load()

Loads state into Reka.

```tsx
reka.load(state: State): void
```

### reka.change()

Executes a mutation function within a transaction.

```tsx
reka.change((state: State) => void): void
```

### reka.createFrame()

Creates a frame (component instance) and computes its view.

```tsx
reka.createFrame(options: CreateFrameOptions): Promise<Frame>
```

#### Options

```tsx
interface CreateFrameOptions {
  id: string;
  component: {
    name: string;
    props?: Record<string, Expression>;
  };
}
```

### reka.getExtension()

Gets an extension by key.

```tsx
reka.getExtension<T>(extension: Extension<T>): ExtensionInstance<T>
```

## Types

### State

```tsx
interface State {
  program: Program;
  extensions?: Record<string, any>;
}
```

### Program

```tsx
interface Program {
  components: RekaComponent[];
  externals?: {
    functions?: ExternalFunc[];
    components?: ExternalComponent[];
  };
}
```

### RekaComponent

```tsx
interface RekaComponent {
  type: 'RekaComponent';
  name: string;
  props: ComponentProp[];
  state: Val[];
  template: Template;
}
```

### ComponentProp

```tsx
interface ComponentProp {
  type: 'ComponentProp';
  name: string;
  init: Expression;
}
```

### Val

Represents component state.

```tsx
interface Val {
  type: 'Val';
  name: string;
  init: Expression;
}
```

### Template Types

#### TagTemplate

```tsx
interface TagTemplate {
  type: 'TagTemplate';
  tag: string;
  props: Record<string, Expression>;
  children: Template[];
}
```

#### ComponentTemplate

```tsx
interface ComponentTemplate {
  type: 'ComponentTemplate';
  component: Identifier;
  props: Record<string, Expression>;
}
```

#### ConditionalTemplate

```tsx
interface ConditionalTemplate {
  type: 'ConditionalTemplate';
  condition: Expression;
  true: Template;
  false: Template;
}
```

#### EachTemplate

```tsx
interface EachTemplate {
  type: 'EachTemplate';
  iterator: Expression;
  alias: string;
  indexAlias?: string;
  template: Template;
}
```

### Expression Types

#### Literal

```tsx
interface Literal {
  type: 'Literal';
  value: any;
}
```

#### Identifier

```tsx
interface Identifier {
  type: 'Identifier';
  name: string;
}
```

#### BinaryExpression

```tsx
interface BinaryExpression {
  type: 'BinaryExpression';
  left: Expression;
  operator: '+' | '-' | '*' | '/' | '===' | '!==' | '<' | '>' | '<=' | '>=';
  right: Expression;
}
```

### MemberExpression

```tsx
interface MemberExpression {
  type: 'MemberExpression';
  object: Expression;
  property: Identifier;
}
```

### ConditionalExpression

```tsx
interface ConditionalExpression {
  type: 'ConditionalExpression';
  condition: Expression;
  true: Expression;
  false: Expression;
}
```

#### CallExpression

```tsx
interface CallExpression {
  type: 'CallExpression';
  identifier: {
    name: string;
    external?: boolean;
  };
  params: Record<string, Expression>;
}
```

#### Func

```tsx
interface Func {
  type: 'Func';
  params: string[];
  body: Statement[];
}
```

### Statement Types

#### Val

```tsx
interface Val {
  type: 'Val';
  name: string;
  init: Expression;
}
```

#### If

```tsx
interface If {
  type: 'If';
  condition: Expression;
  true: Statement[];
  false?: Statement[];
}
```

#### Return

```tsx
interface Return {
  type: 'Return';
  value: Expression;
}
```

### Frame

```tsx
interface Frame {
  id: string;
  view: View;
  component: {
    name: string;
    props: Record<string, any>;
  };
}
```

### View Types

#### RekaComponentView

```tsx
interface RekaComponentView {
  type: 'RekaComponentView';
  component: {
    type: 'RekaComponent';
    component: string;
  };
  root: View;
}
```

#### TagView

```tsx
interface TagView {
  type: 'TagView';
  tag: string;
  props: Record<string, any>;
  children: View[];
}
```

## Extensions

### createExtension()

Creates a new extension.

```tsx
import { createExtension } from '@rekajs/core';

const MyExtension = createExtension<ExtensionState>({
  key: 'myExtension',
  state: {
    // Initial state
  },
  init: (extension) => {
    // Initialize extension
  },
});
```

## React Integration

### RekaProvider

Provides Reka instance to React components.

```tsx
import { RekaProvider } from '@rekajs/react';

<RekaProvider reka={reka}>
  {children}
</RekaProvider>
```

### useReka

Hook to access Reka instance.

```tsx
import { useReka } from '@rekajs/react';

const { reka } = useReka();
```

### RekaView

Component to render a View.

```tsx
import { RekaView } from '@rekajs/react';

<RekaView view={frame.view} />
```

## Collaboration

### createCollabExtension()

Creates a collaboration extension using Yjs.

```tsx
import { createCollabExtension } from '@rekajs/collaboration';
import * as Y from 'yjs';

const doc = new Y.Doc();
const type = doc.getMap('my-collaborative-editor');

const reka = Reka.create({
  extensions: [createCollabExtension(type)],
});
```

## Type Helpers

### Type Factory Functions

All types can be created using factory functions from `@rekajs/types`:

```tsx
import * as t from '@rekajs/types';

t.state({ program: t.program({ components: [] }) })
t.rekaComponent({ name: 'App', props: [], state: [], template: ... })
t.tagTemplate({ tag: 'div', props: {}, children: [] })
t.literal({ value: 'Hello' })
t.identifier({ name: 'counter' })
t.binaryExpression({ left: ..., operator: '+', right: ... })
t.callExpression({ identifier: { name: 'func' }, params: {} })
t.componentProp({ name: 'prop', init: ... })
t.val({ name: 'state', init: ... })
```

## Examples

### Creating a Simple Component

```tsx
import { Reka } from '@rekajs/core';
import * as t from '@rekajs/types';

const reka = Reka.create();

reka.load(
  t.state({
    program: t.program({
      components: [
        t.rekaComponent({
          name: 'Hello',
          props: [],
          state: [],
          template: t.tagTemplate({
            tag: 'h1',
            props: {},
            children: [
              t.tagTemplate({
                tag: 'text',
                props: {
                  value: t.literal({ value: 'Hello World' }),
                },
              }),
            ],
          }),
        }),
      ],
    }),
  })
);
```

### Creating a Frame

```tsx
const frame = await reka.createFrame({
  id: 'hello-frame',
  component: {
    name: 'Hello',
    props: {},
  },
});
```

### Using External Functions

```tsx
const reka = Reka.create({
  externals: {
    functions: [
      t.externalFunc({
        name: 'formatDate',
        func: (timestamp: number) => {
          return new Date(timestamp).toLocaleDateString();
        },
      }),
    ],
  },
});
```

### Using Extensions

```tsx
const CommentExtension = createExtension({
  key: 'comments',
  state: {
    comments: [],
  },
  init: (extension) => {
    // Setup extension
  },
});

const reka = Reka.create({
  extensions: [CommentExtension],
});

reka.change(() => {
  reka.getExtension(CommentExtension).state.comments.push({
    templateId: 'some-id',
    content: 'This is a comment',
  });
});
```

### Complex Component with State and Events

```tsx
import { Reka } from '@rekajs/core';
import * as t from '@rekajs/types';

const reka = Reka.create();

reka.load(
  t.state({
    program: t.program({
      components: [
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
              init: t.identifier({ name: 'initialValue' }),
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
        }),
      ],
    }),
  })
);
```

### Conditional Rendering

```tsx
t.rekaComponent({
  name: 'ConditionalComponent',
  props: [],
  state: [
    t.val({
      name: 'isVisible',
      init: t.literal({ value: true }),
    }),
  ],
  template: t.conditionalTemplate({
    condition: t.identifier({ name: 'isVisible' }),
    true: t.tagTemplate({
      tag: 'div',
      props: {},
      children: [
        t.tagTemplate({
          tag: 'text',
          props: {
            value: t.literal({ value: 'Visible content' }),
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
            value: t.literal({ value: 'Hidden content' }),
          },
        }),
      ],
    }),
  }),
})
```

### List Rendering

```tsx
t.rekaComponent({
  name: 'ListComponent',
  props: [
    t.componentProp({
      name: 'items',
      init: t.literal({ value: ['Item 1', 'Item 2', 'Item 3'] }),
    }),
  ],
  state: [],
  template: t.tagTemplate({
    tag: 'ul',
    props: {},
    children: [
      t.eachTemplate({
        iterator: t.identifier({ name: 'items' }),
        alias: 'item',
        indexAlias: 'index',
        template: t.tagTemplate({
          tag: 'li',
          props: {},
          children: [
            t.tagTemplate({
              tag: 'text',
              props: {
                value: t.identifier({ name: 'item' }),
              },
            }),
          ],
        }),
      }),
    ],
  }),
})
```

## References

- [Official Documentation](https://reka.js.org/docs/introduction)
- [GitHub Repository](https://github.com/prevwong/reka)

