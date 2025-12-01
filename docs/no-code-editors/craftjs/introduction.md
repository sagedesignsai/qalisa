# CraftJS Introduction

## What is CraftJS?

CraftJS is a React framework for building powerful drag-and-drop page editors. It provides a modular approach to creating customizable page builders, allowing developers to build editors without being constrained by predefined components or layouts.

## Motivation

Building page editors is often a complex task. Existing libraries typically come with fully working editors out of the box, but customizing them usually requires modifying the library itself. CraftJS solves this by modularizing the building blocks of a page editor, giving developers full control over the editing experience.

## Key Features

### 1. It's Just React

CraftJS is built entirely with React. You design your editor using familiar React components and patterns. There's no need to learn a complex plugin system or new paradigms.

### 2. Control How Components Are Edited

Developers have full control over how components are edited. You can implement:
- Content-editable text
- Drag-to-resize components
- Modal-based property editors
- Inline editing interfaces
- Custom editing workflows

### 3. User Components with Droppable Regions

CraftJS allows you to create components with droppable regions, enabling users to drag and drop other components into designated areas. This facilitates the creation of nested, complex layouts.

### 4. Extensible

CraftJS offers an expressive API for reading and manipulating the editor state. This makes it easy to implement features like:
- Component duplication
- Undo/redo functionality
- Component deletion
- Custom actions and commands

### 5. Serializable State

The editor's state can be serialized into JSON, making it easy to:
- Save designs to a database
- Load previously saved designs
- Share designs between users
- Version control designs

## Basic Example

```tsx
import { Editor, Frame, Element } from '@craftjs/core';

const App = () => {
  return (
    <Editor resolver={Resolvers}>
      <Frame>
        <Element canvas is={Container} padding={5}>
          <Button text="Click me" />
        </Element>
      </Frame>
    </Editor>
  );
};
```

## Core Concepts

- **Editor**: The root component that wraps your entire editor
- **Frame**: The canvas where users build their pages
- **Element**: A wrapper that makes components editable
- **Resolver**: Maps component names to actual React components
- **Node**: Internal representation of components in the editor

## Use Cases

CraftJS is ideal for building:
- Page builders
- Website editors
- Email template builders
- Dashboard builders
- Form builders
- Content management systems

## Next Steps

- Read about [Core Concepts](./core-concepts.md)
- Explore the [API Reference](./api-reference.md)
- Follow the [Integration Guide](./integration-guide.md)

## References

- [Official Documentation](https://craft.js.org/docs/overview)
- [GitHub Repository](https://github.com/prevwong/craft.js)

