# CraftJS Core Concepts

## Editor

The `Editor` component is the root of your CraftJS application. It provides the context and state management for the entire editor.

```tsx
import { Editor } from '@craftjs/core';

<Editor resolver={Resolvers}>
  {/* Your editor content */}
</Editor>
```

### Props

- `resolver`: An object that maps component names to React components
- `onRender`: Callback when a component is rendered
- `onNodesChange`: Callback when nodes change
- `enabled`: Enable/disable the editor

## Frame

The `Frame` component represents the canvas where users build their pages. It's where all editable components live.

```tsx
import { Frame } from '@craftjs/core';

<Frame>
  {/* Editable components */}
</Frame>
```

### Props

- `json`: Load editor state from JSON
- `data`: Load editor state from object
- `onChange`: Callback when frame content changes

## Element

The `Element` component is a wrapper that makes any component editable. It provides drag-and-drop functionality and selection capabilities.

```tsx
import { Element } from '@craftjs/core';

<Element canvas is={Container}>
  <Button />
</Element>
```

### Props

- `canvas`: Makes the element a droppable region
- `is`: The component to render
- `custom`: Custom props to pass to the component

## Canvas

The `Canvas` component is a special component that creates a droppable region within user-defined components. It allows users to drag and drop other components into designated areas.

```tsx
import { Canvas } from '@craftjs/core';
import { useNode } from '@craftjs/core';

const Container = () => {
  const { connectors: { drag } } = useNode();
  
  return (
    <div ref={drag}>
      <Canvas id="drop_section">
        {/* Users can drag/drop components into this section */}
        <TextComponent />
      </Canvas>
    </div>
  );
};
```

### Key Points

- `Canvas` creates droppable regions within components
- Each `Canvas` should have a unique `id` prop
- Components can be nested with multiple `Canvas` components
- The `Canvas` component enables nested drag-and-drop functionality

## useEditor Hook

The `useEditor` hook provides access to the editor's API and state.

```tsx
import { useEditor } from '@craftjs/core';

const MyComponent = () => {
  const { actions, query, enabled } = useEditor();
  
  const handleSave = () => {
    const json = query.serialize();
    // Save to database
  };
  
  return <button onClick={handleSave}>Save</button>;
};
```

### Available Properties

- `actions`: Methods to manipulate the editor state
- `query`: Methods to read the editor state
- `enabled`: Whether the editor is enabled
- `history`: Undo/redo functionality

## useNode Hook

The `useNode` hook provides information about the current node and methods to update it. It can accept a selector function to subscribe to specific parts of the node state.

```tsx
import { useNode } from '@craftjs/core';

const Button = ({ text }) => {
  const { 
    connectors: { connect, drag }, 
    actions: { setProp },
    isClicked 
  } = useNode((state) => ({
    isClicked: state.events.selected,
  }));
  
  return (
    <div ref={(ref) => connect(drag(ref))}>
      <button onClick={() => setProp((props) => props.text = 'Clicked!')}>
        {text}
      </button>
      {isClicked && (
        <Modal>
          <input
            type="text"
            value={text}
            onChange={(e) => setProp((props) => props.text = e.target.value)}
          />
        </Modal>
      )}
    </div>
  );
};
```

### Available Properties

- `connectors`: Methods to connect nodes
  - `connect`: Connects the node to the editor
  - `drag`: Makes the node draggable
  - `select`: Makes the node selectable
  - `hover`: Handles hover events
- `actions`: Methods to update the node
  - `setProp`: Update node props
  - `setCustom`: Update custom node data
- `id`: The node's unique identifier
- `data`: The node's data (type, props, custom, nodes, parent, etc.)
- `inNodeContext`: Whether component is in node context (boolean)

## Resolver

A resolver is an object that maps component names to actual React components. This allows CraftJS to render components dynamically.

```tsx
const Resolvers = {
  Button: Button,
  Container: Container,
  Text: Text,
};
```

## Node Tree

CraftJS represents components as a tree of nodes. Each node has:
- An `id`: Unique identifier
- A `type`: Component type
- `props`: Component properties
- `nodes`: Child nodes
- `custom`: Custom data

## Serialization

The editor state can be serialized to JSON:

```tsx
const { query } = useEditor();
const json = query.serialize();
```

And deserialized:

```tsx
<Frame json={jsonString}>
  {/* Components will be restored */}
</Frame>
```

## Component Design Patterns

### Editable Component

A basic editable component that can be dragged and selected:

```tsx
import { useNode } from '@craftjs/core';

const EditableButton = ({ text }) => {
  const { connectors: { connect, drag } } = useNode();
  
  return (
    <button ref={(ref) => connect(drag(ref))}>
      {text}
    </button>
  );
};
```

### Container Component with Canvas

A container component that allows other components to be dropped into it:

```tsx
import { Canvas } from '@craftjs/core';
import { useNode } from '@craftjs/core';

const Container = ({ children }) => {
  const { connectors: { drag } } = useNode();
  
  return (
    <div ref={drag}>
      <Canvas id="drop_section">
        {children}
      </Canvas>
    </div>
  );
};
```

### Component with Custom Editing

A component that shows a modal when clicked for editing:

```tsx
import { useNode } from '@craftjs/core';

const TextComponent = ({ text }) => {
  const { 
    connectors: { connect, drag },
    isClicked,
    actions: { setProp }
  } = useNode((state) => ({
    isClicked: state.events.selected,
  }));
  
  return (
    <div ref={(dom) => connect(drag(dom))}>
      <h2>{text}</h2>
      {isClicked && (
        <Modal>
          <input
            type="text"
            value={text}
            onChange={(e) => setProp((props) => props.text = e.target.value)}
          />
        </Modal>
      )}
    </div>
  );
};
```

### Component Duplication Example

Using the editor API to duplicate components:

```tsx
import { useEditor, useNode } from '@craftjs/core';

const Container = () => {
  const { 
    actions: { add },
    query: { createNode, node }
  } = useEditor();
  
  const { id, connectors: { drag, connect } } = useNode();
  
  return (
    <div ref={(dom) => connect(drag(dom))}>
      {/* Component content */}
      <a onClick={() => {
        const { data: { type, props } } = node(id).get();
        add(
          createNode(React.createElement(type, props))
        );
      }}>
        Make a copy of me
      </a>
    </div>
  );
};
```

## NodeHelpers

CraftJS provides helper functions to work with nodes. These are available through the query API:

```tsx
import { useEditor } from '@craftjs/core';

const MyComponent = () => {
  const { query } = useEditor();
  const nodeHelpers = query.node('some-node-id');
  
  // Get ancestors
  const ancestors = nodeHelpers.ancestors();
  
  // Get linked nodes
  const linkedNodes = nodeHelpers.linkedNodes();
  
  // Get child nodes
  const childNodes = nodeHelpers.childNodes();
  
  // Check if root
  const isRoot = nodeHelpers.isRoot();
  
  // Check if canvas
  const isCanvas = nodeHelpers.isCanvas();
  
  // Check if linked node
  const isLinkedNode = nodeHelpers.isLinkedNode();
};
```

### Available Helpers

- `ancestors()`: Returns an array of ancestor node IDs
- `linkedNodes()`: Returns an array of linked node IDs
- `childNodes()`: Returns an array of child node IDs
- `isRoot()`: Determines if a node is the root node
- `isCanvas()`: Checks if a node is a canvas
- `isLinkedNode()`: Checks if a node is linked to its parent via an arbitrary ID

## Best Practices

1. **Separate Concerns**: Keep editable components separate from display components
2. **Use Resolvers**: Always use resolvers for dynamic component rendering
3. **Handle Serialization**: Ensure all component props are serializable (no functions, classes, or circular references)
4. **Optimize Performance**: Use React.memo for expensive components
5. **Error Boundaries**: Wrap the editor in error boundaries
6. **Canvas IDs**: Always provide unique IDs for Canvas components
7. **Connector Pattern**: Use the `connect(drag(ref))` pattern for draggable components
8. **State Selectors**: Use selectors in `useNode` to subscribe only to needed state

## Next Steps

- Read the [API Reference](./api-reference.md)
- Follow the [Integration Guide](./integration-guide.md)

