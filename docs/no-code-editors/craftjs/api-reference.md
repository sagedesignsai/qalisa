# CraftJS API Reference

## Components

### Editor

The root component that wraps your entire editor.

```tsx
import { Editor } from '@craftjs/core';

<Editor
  resolver={Resolvers}
  enabled={true}
  onRender={onRender}
  onNodesChange={onNodesChange}
>
  {children}
</Editor>
```

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `resolver` | `object` | Maps component names to React components |
| `enabled` | `boolean` | Enable/disable the editor (default: `true`) |
| `onRender` | `(render: RenderNode) => ReactNode` | Callback when rendering a node |
| `onNodesChange` | `(query: QueryCallbacks) => void` | Callback when nodes change |
| `onBeforeMove` | `(from: NodeId, to: NodeId) => boolean` | Callback before moving a node |

### Frame

The canvas where users build their pages.

```tsx
import { Frame } from '@craftjs/core';

<Frame
  json={jsonString}
  data={dataObject}
  onChange={onChange}
>
  {children}
</Frame>
```

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `json` | `string` | Load editor state from JSON string |
| `data` | `object` | Load editor state from object |
| `onChange` | `(query: QueryCallbacks) => void` | Callback when frame content changes |

### Element

Wrapper component that makes components editable.

```tsx
import { Element } from '@craftjs/core';

<Element
  canvas={true}
  is={Component}
  custom={{ customProp: 'value' }}
>
  {children}
</Element>
```

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `canvas` | `boolean` | Makes the element a droppable region |
| `is` | `React.ComponentType` | The component to render |
| `custom` | `object` | Custom props to pass to the component |

### Canvas

A special component that creates droppable regions within user-defined components.

```tsx
import { Canvas } from '@craftjs/core';

<Canvas id="unique-id">
  {/* Droppable children */}
</Canvas>
```

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `id` | `string` | Unique identifier for the canvas (required) |
| `flex` | `boolean` | Enable flex layout |
| `direction` | `'row' \| 'column'` | Flex direction |
| `padding` | `number` | Padding value |

## Hooks

### useEditor

Provides access to the editor's API and state.

```tsx
import { useEditor } from '@craftjs/core';

const { actions, query, enabled, history } = useEditor();
```

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `actions` | `EditorActions` | Methods to manipulate editor state |
| `query` | `QueryCallbacks` | Methods to read editor state |
| `enabled` | `boolean` | Whether the editor is enabled |
| `history` | `History` | Undo/redo functionality |

### useNode

Provides information about the current node.

```tsx
import { useNode } from '@craftjs/core';

const {
  connectors,
  actions,
  id,
  data,
  inNodeContext
} = useNode();
```

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `connectors` | `NodeConnectors` | Methods to connect nodes |
| `actions` | `NodeActions` | Methods to update the node |
| `id` | `string` | The node's unique identifier |
| `data` | `NodeData` | The node's data |
| `inNodeContext` | `boolean` | Whether component is in node context |

## Actions API

### EditorActions

Methods available from `useEditor().actions`:

```tsx
actions.add(node: Node, parentId: NodeId, index?: number): void
actions.delete(nodeId: NodeId): void
actions.move(nodeId: NodeId, targetId: NodeId, index?: number): void
actions.setProp(nodeId: NodeId, callback: (props: any) => void): void
actions.setCustom(nodeId: NodeId, callback: (custom: any) => void): void
actions.setOptions(options: EditorOptions): void
actions.history.undo(): void
actions.history.redo(): void
actions.history.clear(): void
```

### NodeActions

Methods available from `useNode().actions`:

```tsx
actions.setProp(callback: (props: any) => void): void
actions.setCustom(callback: (custom: any) => void): void
```

## Query API

### QueryCallbacks

Methods available from `useEditor().query`:

```tsx
// Serialization
query.serialize(): string
query.deserialize(json: string): void
query.getSerializedNodes(): SerializedNodes

// Node access
query.getNodes(): Record<NodeId, Node>
query.node(nodeId: NodeId).get(): Node
query.node(nodeId: NodeId).data(): NodeData

// Node state queries
query.node(nodeId: NodeId).canMoveIn(targetId: NodeId): boolean
query.node(nodeId: NodeId).canMoveOut(): boolean
query.node(nodeId: NodeId).isDragging(): boolean
query.node(nodeId: NodeId).isHovered(): boolean
query.node(nodeId: NodeId).isSelected(): boolean
query.node(nodeId: NodeId).isDeletable(): boolean
query.node(nodeId: NodeId).isDroppable(targetId: NodeId): boolean

// Node helpers
query.node(nodeId: NodeId).ancestors(): NodeId[]
query.node(nodeId: NodeId).linkedNodes(): NodeId[]
query.node(nodeId: NodeId).childNodes(): NodeId[]
query.node(nodeId: NodeId).isRoot(): boolean
query.node(nodeId: NodeId).isCanvas(): boolean
query.node(nodeId: NodeId).isLinkedNode(): boolean

// Node creation
query.createNode(element: ReactElement): Node

// Events
query.getEvent(eventType: string): EventHandler
```

## Connectors

### NodeConnectors

Methods available from `useNode().connectors`:

```tsx
connectors.connect(element: HTMLElement): void
connectors.drag(element: HTMLElement): void
connectors.select(element: HTMLElement): void
connectors.hover(element: HTMLElement): void
```

## Types

### NodeId

```tsx
type NodeId = string;
```

### Node

```tsx
interface Node {
  id: NodeId;
  data: NodeData;
  events: Record<string, EventHandler>;
  dom: HTMLElement | null;
  related: Record<string, NodeId>;
  rules: NodeRules;
}
```

### NodeData

```tsx
interface NodeData {
  type: string | React.ComponentType;
  props: Record<string, any>;
  displayName: string;
  custom: Record<string, any>;
  nodes: NodeId[];
  parent: NodeId | null;
  isCanvas: boolean;
  hidden: boolean;
  linkedNodes: Record<string, NodeId>;
}
```

## Examples

### Serialize Editor State

```tsx
const SaveButton = () => {
  const { query } = useEditor();
  
  const handleSave = () => {
    const json = query.serialize();
    // Save to database
    fetch('/api/save', {
      method: 'POST',
      body: JSON.stringify({ json }),
    });
  };
  
  return <button onClick={handleSave}>Save</button>;
};
```

### Load Editor State

```tsx
const App = () => {
  const [json, setJson] = useState(null);
  
  useEffect(() => {
    fetch('/api/load')
      .then(res => res.json())
      .then(data => setJson(data.json));
  }, []);
  
  return (
    <Editor resolver={Resolvers}>
      <Frame json={json}>
        {/* Components */}
      </Frame>
    </Editor>
  );
};
```

### Update Node Props

```tsx
const EditableButton = ({ text }) => {
  const { actions: { setProp } } = useNode();
  
  return (
    <button
      onClick={() => setProp((props) => {
        props.text = 'Clicked!';
      })}
    >
      {text}
    </button>
  );
};
```

### Component with Canvas

```tsx
import { Canvas } from '@craftjs/core';
import { useNode } from '@craftjs/core';

const Container = () => {
  const { connectors: { drag } } = useNode();
  
  return (
    <div ref={drag}>
      <Canvas id="drop_section">
        {/* Droppable area */}
      </Canvas>
    </div>
  );
};
```

### Using Node Helpers

```tsx
const MyComponent = () => {
  const { query } = useEditor();
  const nodeId = 'some-node-id';
  
  const nodeHelpers = query.node(nodeId);
  const ancestors = nodeHelpers.ancestors();
  const isRoot = nodeHelpers.isRoot();
  const childNodes = nodeHelpers.childNodes();
  
  return <div>{/* Component */}</div>;
};
```

### Component Duplication

```tsx
const DuplicatableComponent = () => {
  const { 
    actions: { add },
    query: { createNode, node }
  } = useEditor();
  
  const { id } = useNode();
  
  const handleDuplicate = () => {
    const { data: { type, props } } = node(id).get();
    const newNode = createNode(React.createElement(type, props));
    add(newNode, id);
  };
  
  return (
    <div>
      <button onClick={handleDuplicate}>Duplicate</button>
    </div>
  );
};
```

## References

- [Official API Documentation](https://craft.js.org/docs/api-reference)
- [GitHub Repository](https://github.com/prevwong/craft.js)

