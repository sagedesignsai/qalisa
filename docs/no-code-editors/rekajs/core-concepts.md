# RekaJS Core Concepts

## State

The State is the core data structure in RekaJS. It's an Abstract Syntax Tree (AST) that represents your entire application structure.

```tsx
import * as t from '@rekajs/types';

const state = t.state({
  program: t.program({
    components: [
      // Components go here
    ],
  }),
});
```

### State Structure

```tsx
{
  program: {
    components: RekaComponent[],
    externals: {
      functions: ExternalFunc[],
      components: ExternalComponent[],
    },
  },
  extensions: {
    // Extension data
  },
}
```

## Components

A RekaComponent represents a reusable UI component with:
- **name**: Component identifier
- **props**: Component properties
- **state**: Component state (using `Val`)
- **template**: The component's UI structure

### Component Example

```tsx
t.rekaComponent({
  name: 'Button',
  props: [
    t.componentProp({
      name: 'label',
      init: t.literal({ value: 'Click me' }),
    }),
  ],
  state: [
    t.val({
      name: 'clicked',
      init: t.literal({ value: false }),
    }),
  ],
  template: t.tagTemplate({
    tag: 'button',
    props: {
      onClick: t.func({
        params: [],
        body: [
          t.val({
            name: 'clicked',
            init: t.literal({ value: true }),
          }),
        ],
      }),
    },
    children: [
      t.tagTemplate({
        tag: 'text',
        props: {
          value: t.identifier({ name: 'label' }),
        },
      }),
    ],
  }),
})
```

## Templates

Templates define the structure of a component's UI. There are several template types:

### TagTemplate

Represents HTML-like tags:

```tsx
t.tagTemplate({
  tag: 'div',
  props: {
    className: t.literal({ value: 'container' }),
  },
  children: [
    // Child templates
  ],
})
```

### ComponentTemplate

References another component:

```tsx
t.componentTemplate({
  component: t.identifier({ name: 'Button' }),
  props: {
    label: t.literal({ value: 'Submit' }),
  },
})
```

### ConditionalTemplate

Conditional rendering:

```tsx
t.conditionalTemplate({
  condition: t.identifier({ name: 'isVisible' }),
  true: t.tagTemplate({
    tag: 'div',
    props: {},
    children: [],
  }),
  false: t.tagTemplate({
    tag: 'div',
    props: {},
    children: [],
  }),
})
```

### EachTemplate

List rendering:

```tsx
t.eachTemplate({
  iterator: t.identifier({ name: 'items' }),
  alias: 'item',
  indexAlias: 'index',
  template: t.tagTemplate({
    tag: 'div',
    props: {},
    children: [],
  }),
})
```

## Expressions

Expressions are used in props and values throughout RekaJS templates. They enable dynamic values, computations, and function calls. All expressions evaluate to a value.

### Literal

Represents a constant value:

```tsx
t.literal({ value: 'Hello' })      // String
t.literal({ value: 42 })           // Number
t.literal({ value: true })          // Boolean
t.literal({ value: null })          // Null
t.literal({ value: undefined })     // Undefined
t.literal({ value: [1, 2, 3] })     // Array
t.literal({ value: { key: 'value' } }) // Object
```

### Identifier

Reference to a variable, prop, or state value:

```tsx
t.identifier({ name: 'counter' })           // State variable
t.identifier({ name: 'initialValue' })     // Prop
t.identifier({ name: 'item' })              // Loop variable (in EachTemplate)
t.identifier({ name: 'index' })              // Loop index (in EachTemplate)
```

### Binary Expression

Performs operations on two expressions. Supports arithmetic, comparison, and logical operations:

```tsx
// Arithmetic operators: '+', '-', '*', '/'
t.binaryExpression({
  left: t.identifier({ name: 'a' }),
  operator: '+',
  right: t.identifier({ name: 'b' }),
})

// Comparison operators: '===', '!==', '<', '>', '<=', '>='
t.binaryExpression({
  left: t.identifier({ name: 'count' }),
  operator: '>',
  right: t.literal({ value: 0 }),
})

// String concatenation
t.binaryExpression({
  left: t.literal({ value: 'Hello ' }),
  operator: '+',
  right: t.identifier({ name: 'name' }),
})
```

### Call Expression

Calls a function (internal or external):

```tsx
// External function (no parameters)
t.callExpression({
  identifier: {
    name: 'getDateTime',
    external: true,
  },
  params: {},
})

// External function with parameters
t.callExpression({
  identifier: {
    name: 'formatCurrency',
    external: true,
  },
  params: {
    amount: t.identifier({ name: 'price' }),
    currency: t.literal({ value: 'USD' }),
  },
})
```

### Member Expression

Accesses object properties:

```tsx
t.memberExpression({
  object: t.identifier({ name: 'user' }),
  property: t.identifier({ name: 'name' }),
})

// Equivalent to: user.name
```

### Conditional Expression

Ternary operator for conditional values:

```tsx
t.conditionalExpression({
  condition: t.identifier({ name: 'isVisible' }),
  true: t.literal({ value: 'Show' }),
  false: t.literal({ value: 'Hide' }),
})
```

## View Tree

The View tree is the computed, renderable output from State. It's a serializable JSON structure.

### Creating a Frame

```tsx
import { Reka } from '@rekajs/core';

const reka = Reka.create();

const frame = await reka.createFrame({
  id: 'my-frame',
  component: {
    name: 'Counter',
    props: {
      initialValue: t.literal({ value: 10 }),
    },
  },
});

console.log(frame.view);
```

### View Structure

```tsx
{
  type: 'RekaComponentView',
  component: {
    type: 'RekaComponent',
    component: 'Counter',
  },
  root: {
    type: 'TagView',
    tag: 'p',
    props: {},
    children: [
      {
        type: 'TagView',
        tag: 'text',
        props: { value: 'My counter: ' },
      },
      {
        type: 'TagView',
        tag: 'text',
        props: { value: 10 },
      },
    ],
  },
}
```

## Extensions

Extensions allow you to add custom data to the State:

```tsx
import { createExtension } from '@rekajs/core';

type CommentState = {
  comments: Array<{
    templateId: string;
    content: string;
  }>;
};

const CommentExtension = createExtension<CommentState>({
  key: 'comments',
  state: {
    comments: [],
  },
  init: (extension) => {
    // Initialize extension
  },
});
```

## Externals

Externals expose functions and components for use in templates:

### External Functions

```tsx
const reka = Reka.create({
  externals: {
    functions: [
      t.externalFunc({
        name: 'getDateTime',
        func: () => {
          return Date.now();
        },
      }),
    ],
  },
});
```

### External Components

```tsx
const reka = Reka.create({
  externals: {
    components: [
      t.externalComponent({
        name: 'CustomButton',
        component: CustomButton,
      }),
    ],
  },
});
```

## State Mutations

Modify state using `reka.change()`. All state mutations must happen within a `change` callback to ensure proper state management and view recomputation.

### Basic Mutation

```tsx
reka.change(() => {
  const component = reka.state.program.components.find(
    (c) => c.name === 'Counter'
  );
  
  component.state.push(
    t.val({
      name: 'newState',
      init: t.literal({ value: 0 }),
    })
  );
});
```

### Adding Components

```tsx
reka.change(() => {
  reka.state.program.components.push(
    t.rekaComponent({
      name: 'NewComponent',
      props: [],
      state: [],
      template: t.tagTemplate({
        tag: 'div',
        props: {},
        children: [],
      }),
    })
  );
});
```

### Modifying Templates

```tsx
reka.change(() => {
  const component = reka.state.program.components.find(
    (c) => c.name === 'App'
  );
  
  // Add a child to the template
  component.template.children.push(
    t.tagTemplate({
      tag: 'p',
      props: {},
      children: [
        t.tagTemplate({
          tag: 'text',
          props: {
            value: t.literal({ value: 'New paragraph' }),
          },
        }),
      ],
    })
  );
});
```

### Updating Component Props

```tsx
reka.change(() => {
  const component = reka.state.program.components.find(
    (c) => c.name === 'Button'
  );
  
  const prop = component.props.find((p) => p.name === 'label');
  if (prop) {
    prop.init = t.literal({ value: 'New Label' });
  }
});
```

## React Integration

Use `@rekajs/react` for React integration:

```tsx
import { RekaProvider, useReka } from '@rekajs/react';

function App() {
  const reka = Reka.create();
  
  return (
    <RekaProvider reka={reka}>
      <MyComponent />
    </RekaProvider>
  );
}

function MyComponent() {
  const { reka } = useReka();
  const frame = await reka.createFrame({
    id: 'my-frame',
    component: { name: 'Counter' },
  });
  
  return <RekaView view={frame.view} />;
}
```

## Statements

Statements are used in function bodies and component logic:

### Val Statement

Creates or updates a state variable:

```tsx
t.val({
  name: 'counter',
  init: t.literal({ value: 0 }),
})

// Update existing value
t.val({
  name: 'counter',
  init: t.binaryExpression({
    left: t.identifier({ name: 'counter' }),
    operator: '+',
    right: t.literal({ value: 1 }),
  }),
})
```

### If Statement

Conditional execution:

```tsx
t.if({
  condition: t.identifier({ name: 'isVisible' }),
  true: [
    // Statements to execute if true
  ],
  false: [
    // Statements to execute if false (optional)
  ],
})
```

### Return Statement

Returns a value from a function:

```tsx
t.return({
  value: t.identifier({ name: 'result' }),
})
```

## Best Practices

1. **Keep State Serializable**: Ensure all state can be serialized to JSON (no functions, classes, or circular references)
2. **Use Extensions for Custom Data**: Don't modify core state structure directly; use extensions
3. **Optimize View Computation**: Views are computed on-demand; cache frames when possible
4. **Handle Errors**: Wrap frame creation in try-catch blocks
5. **Type Safety**: Use TypeScript for better type safety with RekaJS types
6. **State Mutations**: Always wrap state changes in `reka.change()` callbacks
7. **Component Organization**: Keep components focused and reusable
8. **Expression Complexity**: Keep expressions simple; use functions for complex logic
9. **External Functions**: Use external functions for side effects and API calls
10. **Template Structure**: Keep templates shallow when possible for better performance

## Next Steps

- Read the [API Reference](./api-reference.md)
- Follow the [Integration Guide](./integration-guide.md)

