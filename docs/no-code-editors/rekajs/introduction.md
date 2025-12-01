# RekaJS Introduction

## What is RekaJS?

RekaJS is a state management system for building no-code editors. It provides an AST-powered state system that enables end-users to create UI components that are nearly as complex as ones that developers could write in code.

## Motivation

Much of the complexity surrounding building no-code editors comes from architecting the state management system to power such editors. Questions like "how should the end user designs be stored and edited in a page editor?" are common challenges.

RekaJS solves this by providing:
- An AST-based state system
- An interpreter to efficiently compute renderable output
- A portable, framework-agnostic approach

It's primarily built to serve as the new state management system to power Craft.js and its page builders.

## Key Features

### AST-based State ⚡

At the core of Reka is the State data structure which is an Abstract Syntax Tree (AST). This enables end-users to build complex UI components with features that developers are familiar with from UI frameworks such as React:

- Component props
- Component state (using `Val`)
- Conditional rendering
- List rendering
- Expressions as props
- Component composition

### Portable 🚗

Reka computes a Component instance from its State by generating a `View` tree. This View tree is a simple serializable JSON structure, making it compatible with:
- React
- Vue
- Svelte
- Any UI framework that can render JSON

### Extensible State 🔨

Page builders often require additional data to be stored as part of the State. RekaJS allows you to extend the state with custom data through extensions.

### External Functionalities 🔥

You can expose additional functionalities for end-users to use, such as:
- Date/time functions
- API calls
- Utility functions
- Custom business logic

### Realtime Collaboration 🎉

RekaJS provides real-time collaboration capabilities via a fully-featured CRDT backed by Yjs.

## Basic Example

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
              name: 'counter',
              init: t.identifier({ name: 'initialValue' }),
            }),
          ],
          template: t.tagTemplate({
            tag: 'p',
            props: {},
            children: [
              t.tagTemplate({
                tag: 'text',
                props: {
                  value: t.literal({ value: 'My counter: ' }),
                },
              }),
              t.tagTemplate({
                tag: 'text',
                props: {
                  value: t.identifier({ name: 'counter' }),
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

This is equivalent to the following React code:

```tsx
const Counter = ({ initialValue = 0 }) => {
  const [counter, setCounter] = useState(initialValue);
  return <p>My Counter: {counter}</p>;
};
```

## Core Concepts

- **State**: The AST representation of your application
- **Component**: A reusable UI component with props and state
- **Template**: The structure of a component's UI
- **View**: The computed, renderable output from State
- **Frame**: An instance of a component with specific props
- **Extension**: Custom data and functionality added to State

## Use Cases

RekaJS is ideal for:
- No-code page builders
- Visual component editors
- Application builders
- Template editors
- Form builders with logic
- Interactive design tools

## Next Steps

- Read about [Core Concepts](./core-concepts.md)
- Explore the [API Reference](./api-reference.md)
- Follow the [Integration Guide](./integration-guide.md)

## References

- [Official Documentation](https://reka.js.org/docs/introduction)
- [GitHub Repository](https://github.com/prevwong/reka)

