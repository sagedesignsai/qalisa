# Craft.js Implementation Guide

## Canvas Area & Drag-and-Drop Implementation

### ✅ Fixed According to Craft.js Best Practices

#### 1. **Frame Usage**
- Frame either loads from `data` OR has `children`, never both
- When loading saved state: `<Frame data={parsedJson} />`
- When starting fresh: `<Frame><Element canvas is={Container} /></Frame>`

#### 2. **Container Component**
- Uses `<Element canvas is="div">` instead of `<Canvas>` component
- This is the Craft.js best practice for creating droppable regions
- Structure: Container → Element (canvas) → Components

#### 3. **Component Connectors**
All components properly use:
```tsx
const { connectors: { connect, drag } } = useNode();
return <div ref={(ref) => connect(drag(ref))}>...</div>
```

#### 4. **Component Addition**
- Uses `actions.addNodeTree()` to add components
- Finds the canvas node (Element with canvas prop)
- Adds components to the correct parent and index

#### 5. **Layout Components (Row, Column)**
- Also use `<Element canvas>` for droppable regions
- Properly connected with `useNode` hook

## Component Structure

```
Frame
  └─ Element (canvas, is=Container)
      └─ Container Component
          └─ Element (canvas, is="div")
              └─ User Components (Text, Button, etc.)
```

## Drag-and-Drop Flow

1. User clicks component in palette
2. `handleAddComponent()` finds the canvas node
3. Uses `actions.addNodeTree()` to add component
4. Craft.js handles rendering and drag-and-drop automatically
5. Components can be dragged within canvas using Craft.js built-in system

## Key Files

- `components/editor/layout/canvas-area.tsx` - Canvas area with Frame
- `components/craft/container.tsx` - Container with Element canvas
- `components/editor/left-sidebar/component-item.tsx` - Component addition logic
- `components/editor/providers/craft-editor-provider.tsx` - Editor wrapper

