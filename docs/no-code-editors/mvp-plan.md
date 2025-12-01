# No-Code Editor MVP Implementation Plan

## Overview

This document outlines the implementation plan for the MVP of the no-code editor system in Qalisa. The MVP will enable users to visually build and edit applications using drag-and-drop interfaces powered by CraftJS and RekaJS.

## Goals

### Primary Goals

1. **Visual Editor**: Enable drag-and-drop component placement
2. **Live Editing**: Real-time preview of changes
3. **Component Library**: Basic set of reusable components
4. **State Management**: Component props and state editing
5. **Save/Load**: Persist designs to database

### Secondary Goals

1. **AI Integration**: AI-assisted component generation
2. **Property Panel**: Visual property editing interface
3. **Component Templates**: Pre-built component templates
4. **Export**: Export designs as JSON/code

## Phase 1: Foundation Setup

### 1.1 Dependencies Installation

```bash
pnpm add @craftjs/core @rekajs/core @rekajs/types @rekajs/react
```

### 1.2 Project Structure

```
app/
├── editor/
│   ├── page.tsx              # Main editor page
│   └── layout.tsx            # Editor layout
components/
├── craft/
│   ├── resolvers.tsx         # Component resolvers
│   ├── container.tsx         # Container component
│   ├── text.tsx              # Text component
│   ├── button.tsx            # Button component
│   ├── toolbar.tsx           # Component toolbar
│   ├── property-panel.tsx    # Property editor
│   └── save-button.tsx       # Save functionality
├── reka/
│   ├── reka-provider.tsx     # RekaJS provider
│   ├── frame-renderer.tsx    # Frame renderer
│   └── state-manager.tsx     # State management
lib/
├── craft/
│   ├── instance.ts           # CraftJS instance
│   └── converters.ts         # State converters
└── reka/
    ├── instance.ts           # RekaJS instance
    ├── initial-state.ts     # Initial state
    └── externals.ts         # External functions/components
```

### 1.3 Database Schema

```prisma
model EditorProject {
  id        String   @id @default(cuid())
  userId    String
  name      String
  craftJson String?  // CraftJS serialized state
  rekaJson  String?  // RekaJS serialized state
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id])
}

model EditorComponent {
  id          String   @id @default(cuid())
  projectId   String
  name        String
  type        String   // 'craft' or 'reka'
  definition  Json     // Component definition
  createdAt   DateTime @default(now())
  
  project EditorProject @relation(fields: [projectId], references: [id])
}
```

## Phase 2: Core Editor Implementation

### 2.1 CraftJS Setup

**Tasks:**
- [ ] Create CraftJS Editor component
- [ ] Setup Frame component
- [ ] Create basic resolvers
- [ ] Implement drag & drop
- [ ] Add component selection

**Files:**
- `components/craft/editor.tsx`
- `components/craft/resolvers.tsx`
- `lib/craft/instance.ts`

### 2.2 RekaJS Setup

**Tasks:**
- [ ] Create RekaJS instance
- [ ] Setup initial state
- [ ] Create RekaProvider
- [ ] Implement frame creation
- [ ] Setup view rendering

**Files:**
- `lib/reka/instance.ts`
- `lib/reka/initial-state.ts`
- `components/reka/reka-provider.tsx`

### 2.3 State Synchronization

**Tasks:**
- [ ] Create CraftJS → RekaJS converter
- [ ] Create RekaJS → CraftJS converter
- [ ] Implement bidirectional sync
- [ ] Add debouncing
- [ ] Handle edge cases

**Files:**
- `lib/craft/converters.ts`
- `lib/reka/converters.ts`

## Phase 3: Component Library

### 3.1 Basic Components

**Components to Implement:**
- [ ] Container (div)
- [ ] Text
- [ ] Button
- [ ] Input
- [ ] Image
- [ ] Heading (h1-h6)
- [ ] Paragraph
- [ ] Link

**Files:**
- `components/craft/container.tsx`
- `components/craft/text.tsx`
- `components/craft/button.tsx`
- etc.

### 3.2 Component Properties

**Tasks:**
- [ ] Define prop types for each component
- [ ] Create property editors
- [ ] Implement prop validation
- [ ] Add default values

**Files:**
- `components/craft/property-panel.tsx`
- `components/craft/property-editors/`

## Phase 4: UI Components

### 4.1 Toolbar

**Features:**
- [ ] Component palette
- [ ] Add component buttons
- [ ] Undo/redo
- [ ] Save button
- [ ] Export button

**Files:**
- `components/craft/toolbar.tsx`

### 4.2 Property Panel

**Features:**
- [ ] Component selection
- [ ] Property editing
- [ ] Style editing
- [ ] Layout options

**Files:**
- `components/craft/property-panel.tsx`

### 4.3 Canvas

**Features:**
- [ ] Visual editing area
- [ ] Component selection
- [ ] Drag handles
- [ ] Resize handles
- [ ] Grid/snap guides

**Files:**
- `components/craft/canvas.tsx`

## Phase 5: State Persistence

### 5.1 Save Functionality

**Tasks:**
- [ ] Serialize CraftJS state
- [ ] Serialize RekaJS state
- [ ] Create API endpoint
- [ ] Save to database
- [ ] Handle errors

**Files:**
- `app/api/editor/save/route.ts`
- `components/craft/save-button.tsx`

### 5.2 Load Functionality

**Tasks:**
- [ ] Load from database
- [ ] Deserialize state
- [ ] Restore editor state
- [ ] Handle missing data

**Files:**
- `app/api/editor/load/route.ts`
- `app/editor/[id]/page.tsx`

## Phase 6: AI Integration

### 6.1 Component Generation

**Tasks:**
- [ ] AI prompt interface
- [ ] Generate RekaJS AST
- [ ] Convert to CraftJS nodes
- [ ] Insert into editor

**Files:**
- `components/ai/component-generator.tsx`
- `lib/ai/reka-generator.ts`

### 6.2 Smart Suggestions

**Tasks:**
- [ ] Component recommendations
- [ ] Property suggestions
- [ ] Layout suggestions
- [ ] Accessibility hints

**Files:**
- `components/ai/suggestions.tsx`

## Phase 7: Testing & Polish

### 7.1 Testing

**Tasks:**
- [ ] Unit tests for converters
- [ ] Integration tests for sync
- [ ] E2E tests for workflows
- [ ] Performance testing

### 7.2 Polish

**Tasks:**
- [ ] Error handling
- [ ] Loading states
- [ ] Animations
- [ ] Responsive design
- [ ] Accessibility

## Implementation Timeline

### Week 1: Foundation
- Setup dependencies
- Create project structure
- Database schema
- Basic CraftJS setup

### Week 2: Core Editor
- RekaJS integration
- State synchronization
- Basic components

### Week 3: Component Library
- Implement all basic components
- Property panels
- Component templates

### Week 4: UI & Persistence
- Toolbar and panels
- Save/load functionality
- API endpoints

### Week 5: AI Integration
- Component generation
- Smart suggestions
- AI prompts

### Week 6: Testing & Polish
- Comprehensive testing
- Bug fixes
- Performance optimization
- Documentation

## Success Metrics

### Technical Metrics
- [ ] Editor loads in < 2 seconds
- [ ] State sync completes in < 100ms
- [ ] Save/load works reliably
- [ ] No memory leaks
- [ ] Works on modern browsers

### User Metrics
- [ ] Users can create basic pages
- [ ] Users can edit component properties
- [ ] Users can save and load projects
- [ ] AI generates usable components

## Risk Mitigation

### Technical Risks
1. **State Sync Complexity**: Start simple, iterate
2. **Performance Issues**: Profile early, optimize
3. **Browser Compatibility**: Test on multiple browsers

### User Experience Risks
1. **Learning Curve**: Provide tutorials and tooltips
2. **Feature Overload**: Keep MVP focused
3. **Error Handling**: Clear error messages

## Next Steps

1. Review and approve this plan
2. Set up development environment
3. Begin Phase 1 implementation
4. Regular progress reviews
5. Iterate based on feedback

## References

- [CraftJS Documentation](./craftjs/)
- [RekaJS Documentation](./rekajs/)
- [Architecture Document](./architecture.md)

