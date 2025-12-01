# No-Code Editor Architecture

## Overview

This document describes the architecture of the no-code editor system, explaining how CraftJS and RekaJS work together to provide a comprehensive visual editing experience.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Toolbar    │  │   Canvas     │  │  Properties  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    CraftJS Layer                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Editor Component                         │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │   Frame    │  │  Elements  │  │  Nodes     │     │  │
│  │  └────────────┘  └────────────┘  └────────────┘     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  • Drag & Drop Management                                   │
│  • Component Selection                                       │
│  • Visual Manipulation                                       │
│  • Serialization (JSON)                                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    RekaJS Layer                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              State Management                         │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │   State    │  │ Components │  │   View     │     │  │
│  │  │   (AST)    │  │            │  │   Tree     │     │  │
│  │  └────────────┘  └────────────┘  └────────────┘     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  • AST-based State                                          │
│  • Component Logic (Props, State, Templates)                │
│  • View Computation                                         │
│  • Extensions & Externals                                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Database   │  │   API       │  │  Storage     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Component Interaction Flow

### 1. User Interaction (CraftJS)

```
User Action (Drag, Drop, Select)
    │
    ▼
CraftJS Editor
    │
    ├─► Updates Node Tree
    ├─► Triggers onChange Callback
    └─► Serializes to JSON
```

### 2. State Synchronization

```
CraftJS JSON State
    │
    ▼
State Converter (CraftJS → RekaJS)
    │
    ▼
RekaJS State (AST)
    │
    ├─► Validates Structure
    ├─► Computes View Tree
    └─► Updates Extensions
```

### 3. Rendering

```
RekaJS View Tree
    │
    ▼
View Renderer
    │
    ├─► React Components
    ├─► Vue Components
    └─► Svelte Components
```

## Data Flow

### Creating a Component

1. **User drags component** → CraftJS captures the action
2. **CraftJS adds node** → Updates internal node tree
3. **State sync** → Converts CraftJS node to RekaJS component
4. **RekaJS processes** → Creates AST representation
5. **View computation** → Generates renderable view tree
6. **Render** → Displays component in canvas

### Editing Component Properties

1. **User selects component** → CraftJS highlights node
2. **Property panel updates** → Shows component props
3. **User edits property** → CraftJS updates node props
4. **State sync** → Updates RekaJS component props
5. **View recomputation** → RekaJS recalculates view
6. **Live update** → Canvas reflects changes immediately

### Saving State

1. **User clicks save** → Trigger save action
2. **CraftJS serializes** → Converts to JSON
3. **RekaJS serializes** → Converts AST to JSON
4. **API call** → Sends to backend
5. **Database storage** → Persists state

## Integration Points

### CraftJS → RekaJS Bridge

```tsx
// Converts CraftJS state to RekaJS state
function craftToReka(craftState: CraftState): RekaState {
  const components = craftState.nodes.map(node => {
    return t.rekaComponent({
      name: node.data.type,
      props: convertProps(node.data.props),
      state: [],
      template: convertTemplate(node),
    });
  });
  
  return t.state({
    program: t.program({ components }),
  });
}
```

### RekaJS → CraftJS Bridge

```tsx
// Converts RekaJS view to CraftJS nodes
function rekaToCraft(rekaView: View): CraftNodes {
  // Convert RekaJS view tree to CraftJS node structure
  return convertViewToNodes(rekaView);
}
```

## State Management Strategy

### Dual State System

1. **CraftJS State**: Manages visual editing state
   - Node positions
   - Selection state
   - Drag & drop state
   - UI state

2. **RekaJS State**: Manages component logic state
   - Component definitions
   - Props and state
   - Template structure
   - Business logic

### Synchronization

- **Bidirectional sync**: Changes in either system update the other
- **Debounced updates**: Prevent excessive recomputation
- **Transaction batching**: Group related changes
- **Conflict resolution**: Handle simultaneous edits

## Extension Points

### CraftJS Extensions

- Custom connectors
- Custom actions
- Custom queries
- Custom renderers

### RekaJS Extensions

- Custom state data
- Custom functions
- Custom components
- Custom templates

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**: Load components on demand
2. **View Caching**: Cache computed views
3. **Debouncing**: Debounce state updates
4. **Virtualization**: Virtualize large lists
5. **Memoization**: Memoize expensive computations

### Rendering Optimization

- Use React.memo for components
- Implement shouldComponentUpdate
- Use requestAnimationFrame for animations
- Batch DOM updates

## Security Considerations

### State Validation

- Validate AST structure
- Sanitize user input
- Validate component props
- Check external function calls

### Access Control

- User permissions
- Component restrictions
- Feature flags
- Rate limiting

## Collaboration Architecture

### Real-time Sync

```
User A                    User B
   │                         │
   ├─► CraftJS Editor        │
   │                         │
   ├─► State Sync            │
   │                         │
   ├─► RekaJS State          │
   │                         │
   ├─► Yjs CRDT ────────────►│
   │                         │
   └─► View Update           └─► View Update
```

### Conflict Resolution

- Operational Transformation (OT)
- CRDT (Conflict-free Replicated Data Types)
- Last-write-wins for simple cases
- Manual conflict resolution UI

## AI Integration Points

### Component Generation

1. **AI receives prompt** → Natural language description
2. **AI generates AST** → Creates RekaJS component structure
3. **State conversion** → Converts to CraftJS nodes
4. **Rendering** → Displays in editor

### Smart Suggestions

- Component recommendations
- Property suggestions
- Layout optimization
- Accessibility improvements

## Testing Strategy

### Unit Tests

- Component logic
- State conversion
- View computation
- Extension functionality

### Integration Tests

- CraftJS ↔ RekaJS sync
- Save/load functionality
- Collaboration features
- AI integration

### E2E Tests

- User workflows
- Drag & drop operations
- Property editing
- State persistence

## Future Enhancements

### Planned Features

1. **Version Control**: Git-like versioning for designs
2. **Component Library**: Shared component marketplace
3. **Templates**: Pre-built page templates
4. **Export Options**: Export to code, PDF, images
5. **Mobile Preview**: Real-time mobile preview
6. **Performance Analytics**: Component performance metrics

## References

- [CraftJS Documentation](../craftjs/)
- [RekaJS Documentation](../rekajs/)
- [MVP Implementation Plan](./mvp-plan.md)

