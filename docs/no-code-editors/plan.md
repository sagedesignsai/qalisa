# Gutenberg-like Page Builder - Complete Implementation Plan

## Overview

This plan implements a comprehensive page builder system similar to WordPress Gutenberg, featuring:

- Visual drag-and-drop page composition using CraftJS
- AST-based state management with RekaJS (including loops, conditionals, complex components)
- Zustand for editor UI state management
- Three-panel layout: Left sidebar (elements/state), Center canvas, Right sidebar (properties)
- Dynamic page creation and rendering via Next.js API routes
- Component library with reusable blocks
- Advanced property editing (loops, conditionals, expressions)
- Save/load functionality with database persistence
- Modular architecture with clear Logic/State/UI separation

## Architecture Overview

### Modular Architecture Pattern

```
lib/editor/
├── logic/          # Business logic, utilities, transformations
├── state/          # Zustand stores for UI state management
├── types/          # TypeScript type definitions
└── hooks/          # Custom React hooks

components/editor/
├── layout/         # Layout components (three-panel structure)
├── left-sidebar/   # Left sidebar components
├── canvas/         # Canvas components
├── right-sidebar/  # Right sidebar components
└── shared/         # Shared editor components
```

### Three-Panel Layout Design

- **Left Sidebar**: Component palette, Global Variables, App Context (Props, State, Template)
- **Center Canvas**: Visual editing area with zoom, viewport controls, breadcrumb navigation
- **Right Sidebar**: Property panel with Visibility, Padding/Alignment, Loops, Conditionals, Props

## Implementation Phases

### Phase 1: Foundation & State Management

**Dependencies:**

```bash
pnpm add zustand @craftjs/core @rekajs/core @rekajs/types @rekajs/react
```

**Tasks:**

1. Install Zustand dependency
2. Extend Prisma schema with EditorProject, Page, Component models
3. Create Zustand stores for editor UI state:

   - `use-editor-ui-store.ts` - UI state (panels, zoom, viewport, selection)
   - `use-editor-project-store.ts` - Project state (current project, save status)
   - `use-component-palette-store.ts` - Component palette state (search, filters)
   - `use-property-panel-store.ts` - Property panel state (selected element, active tab)
   - `use-canvas-store.ts` - Canvas state (zoom, viewport size, grid)
   - `use-reka-state-store.ts` - RekaJS state (global variables, component state)
   - `use-editor-history-store.ts` - Undo/redo history

4. Create TypeScript types for editor state
5. Set up basic three-panel layout structure

**Files:**

- `lib/editor/state/use-editor-ui-store.ts`
- `lib/editor/state/use-editor-project-store.ts`
- `lib/editor/state/use-component-palette-store.ts`
- `lib/editor/state/use-property-panel-store.ts`
- `lib/editor/state/use-canvas-store.ts`
- `lib/editor/state/use-reka-state-store.ts`
- `lib/editor/state/use-editor-history-store.ts`
- `lib/editor/types/editor.types.ts`
- `lib/editor/types/component.types.ts`
- `lib/editor/types/state.types.ts`
- `components/editor/layout/editor-layout.tsx`
- `components/editor/layout/left-sidebar.tsx`
- `components/editor/layout/canvas-area.tsx`
- `components/editor/layout/right-sidebar.tsx`

### Phase 2: Database & API Routes

**Database Schema:**

```prisma
model EditorProject {
  id        String   @id @default(cuid())
  userId    String
  name      String
  craftJson Json?    // CraftJS serialized state
  rekaJson  Json?    // RekaJS AST state
  isDraft   Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user  User  @relation(fields: [userId], references: [id])
  pages Page[]
  
  @@index([userId])
  @@map("editor_projects")
}

model Page {
  id          String   @id @default(cuid())
  projectId   String?
  userId      String
  slug        String   @unique
  title       String
  craftJson   Json     // CraftJS state for rendering
  rekaJson    Json     // RekaJS AST for rendering
  published   Boolean  @default(false)
  publishedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user    User          @relation(fields: [userId], references: [id])
  project EditorProject? @relation(fields: [projectId], references: [id])
  
  @@index([slug])
  @@index([userId])
  @@map("pages")
}
```

**Tasks:**

1. Create API routes for projects (GET, POST, PUT, DELETE)
2. Create API routes for pages (GET, POST, PUT, DELETE, PUBLISH)
3. Implement authentication middleware for API routes
4. Add validation using Zod schemas
5. Create database migration

**Files:**

- `app/api/editor/projects/route.ts`
- `app/api/editor/projects/[id]/route.ts`
- `app/api/editor/pages/route.ts`
- `app/api/editor/pages/[slug]/route.ts`
- `app/api/editor/pages/[slug]/publish/route.ts`
- `lib/editor/validation/schemas.ts`

### Phase 3: Editor Core Setup

**Tasks:**

1. Set up CraftJS Editor component with resolvers
2. Set up RekaJS provider and instance with externals
3. Create state synchronization layer (logic):

   - `craft-to-reka.ts` - Convert CraftJS nodes to RekaJS AST
   - `reka-to-craft.ts` - Convert RekaJS AST to CraftJS nodes
   - `state-sync.ts` - Bidirectional synchronization with debouncing

4. Implement expression parser and validator
5. Connect Zustand stores to CraftJS/RekaJS editors
6. Implement basic save/load functionality

**Files:**

- `lib/editor/logic/craft-to-reka.ts`
- `lib/editor/logic/reka-to-craft.ts`
- `lib/editor/logic/state-sync.ts`
- `lib/editor/logic/expression-parser.ts`
- `lib/editor/logic/validation.ts`
- `lib/reka/instance.ts`
- `lib/reka/externals.ts`
- `components/editor/canvas/craft-editor-wrapper.tsx`
- `components/editor/canvas/reka-provider.tsx`

### Phase 4: Left Sidebar Implementation

**Tasks:**

1. Build sidebar tabs (Build/Connect)
2. Implement component search functionality (Ctrl+F)
3. Create component palette with categories:

   - Commonly used elements (Text, Column, Row, Container, Image, Button)
   - Layout elements (Container, Row, Column, Stack, Card, ListView, GridView, Spacer, Divider, etc.)

4. Build Global Variables section:

   - Add/edit/remove global variables
   - Variable type support (string, number, boolean, object, array)
   - Variable usage tracking

5. Create Components navigation (back arrow, component tree)
6. Build App context section:

   - Props editor (component properties)
   - State management UI (add/edit/remove state variables)
   - Template section (list of template elements with add buttons)

7. Implement drag-and-drop from palette to canvas

**Files:**

- `components/editor/left-sidebar/sidebar-tabs.tsx`
- `components/editor/left-sidebar/component-search.tsx`
- `components/editor/left-sidebar/component-palette.tsx`
- `components/editor/left-sidebar/commonly-used-section.tsx`
- `components/editor/left-sidebar/layout-elements-section.tsx`
- `components/editor/left-sidebar/component-item.tsx`
- `components/editor/left-sidebar/global-variables-section.tsx`
- `components/editor/left-sidebar/components-navigation.tsx`
- `components/editor/left-sidebar/app-context-section.tsx`
- `components/editor/left-sidebar/app-context-section/props-section.tsx`
- `components/editor/left-sidebar/app-context-section/state-section.tsx`
- `components/editor/left-sidebar/app-context-section/template-section.tsx`

### Phase 5: Canvas Area Implementation

**Tasks:**

1. Create canvas toolbar (zoom controls, viewport size selector)
2. Implement breadcrumb navigation showing selected element path
3. Set up CraftJS editor frame with proper styling
4. Add viewport size selector (1440 x 900 px, responsive breakpoints)
5. Implement zoom controls (80% default, min/max limits)
6. Add canvas grid/guides
7. Implement element selection highlighting
8. Add visual indicators for loop and conditional elements

**Files:**

- `components/editor/canvas/canvas-toolbar.tsx`
- `components/editor/canvas/canvas-viewport.tsx`
- `components/editor/canvas/breadcrumb.tsx`
- `components/editor/canvas/craft-editor-wrapper.tsx`
- `components/editor/shared/header-toolbar.tsx`

### Phase 6: Right Sidebar - Property Panel

**Tasks:**

1. Build property panel container with tabs
2. Create visibility section:

   - Conditional toggle
   - Responsive view toggles (desktop, tablet, mobile)
   - Opacity slider
   - Animated opacity toggle

3. Create padding & alignment section:

   - Visual padding controls (Top, Bottom, Left, Right)
   - 3x3 alignment grid for X and Y axis

4. **Build Loop section (EachTemplate)**:

   - Iterator expression input (e.g., `$getPosts()`)
   - Expose variables controls
   - Index variable toggle
   - Variable alias input (e.g., "For post")
   - Expression validation and error handling

5. **Build Conditional section (ConditionalTemplate)**:

   - Condition expression input (e.g., `counter > 0`)
   - True/false template preview
   - Expression validation

6. Create Class List section (CSS classes management)
7. Create Component Props section (edit component properties)
8. Create element-specific property sections:

   - Column Properties (Main Axis Size, Alignment, Spacing)
   - Row Properties
   - Generic element properties

9. Implement expression input control with autocomplete
10. Implement variable selector dropdown
11. Connect property changes to RekaJS AST state

**Files:**

- `components/editor/right-sidebar/property-panel.tsx`
- `components/editor/right-sidebar/property-sections/visibility-section.tsx`
- `components/editor/right-sidebar/property-sections/padding-alignment-section.tsx`
- `components/editor/right-sidebar/property-sections/loop-section.tsx`
- `components/editor/right-sidebar/property-sections/conditional-section.tsx`
- `components/editor/right-sidebar/property-sections/class-list-section.tsx`
- `components/editor/right-sidebar/property-sections/component-props-section.tsx`
- `components/editor/right-sidebar/property-sections/column-properties-section.tsx`
- `components/editor/right-sidebar/property-sections/row-properties-section.tsx`
- `components/editor/right-sidebar/property-sections/element-properties-section.tsx`
- `components/editor/right-sidebar/property-controls/expression-input.tsx`
- `components/editor/right-sidebar/property-controls/variable-selector.tsx`
- `components/editor/right-sidebar/property-controls/toggle-control.tsx`
- `components/editor/right-sidebar/property-controls/slider-control.tsx`
- `components/editor/right-sidebar/property-controls/alignment-grid.tsx`
- `components/editor/right-sidebar/property-controls/padding-control.tsx`
- `components/editor/right-sidebar/property-controls/responsive-toggle.tsx`

### Phase 7: Component Library & Advanced Features

**Tasks:**

1. Create base block components:

   - Container, Text, Heading (h1-h6), Button, Image
   - Row, Column, Spacer, Divider, Stack, Card

2. Implement CraftJS wrappers for each block with useNode
3. Create property panels for each block type
4. Add block metadata and icons
5. Register blocks in component registry
6. **Implement EachTemplate support (loops/lists)**:

   - Render list items dynamically
   - Support iterator expressions (functions, arrays)
   - Handle variable exposure (item, index)
   - Visual indicator for loop elements
   - Support nested loops

7. **Implement ConditionalTemplate support**:

   - Conditional rendering based on expressions
   - True/false branch management
   - Visual indicator for conditional elements
   - Complex conditional expressions

8. **Implement global variables management**:

   - Add/edit/remove global variables
   - Variable type support
   - Variable usage tracking
   - Access variables in expressions

9. **Implement component state management**:

   - Add/edit/remove component state variables
   - State initialization expressions
   - State update handlers
   - State in event handlers

**Files:**

- `components/blocks/container.tsx`
- `components/blocks/text.tsx`
- `components/blocks/heading.tsx`
- `components/blocks/button.tsx`
- `components/blocks/image.tsx`
- `components/blocks/row.tsx`
- `components/blocks/column.tsx`
- `components/blocks/spacer.tsx`
- `components/blocks/divider.tsx`
- `components/blocks/stack.tsx`
- `components/blocks/card.tsx`
- `lib/blocks/resolvers.tsx`
- `lib/blocks/registry.ts`
- `lib/blocks/definitions.ts`
- `lib/editor/logic/loop-helpers.ts`
- `lib/editor/logic/conditional-helpers.ts`
- `lib/editor/logic/variable-manager.ts`
- `lib/editor/logic/template-helpers.ts`

### Phase 8: External Functions & Components

**Tasks:**

1. Register external functions:

   - `getPosts()` - Fetch data from API
   - `formatDate()` - Date formatting
   - `formatCurrency()` - Currency formatting
   - Custom utility functions

2. Register external React components:

   - UI library components (Button, Input, etc.)
   - Custom business components

3. Implement function parameter management
4. Add function result preview
5. Create external component wrapper for RekaJS

**Files:**

- `lib/reka/externals.ts`
- `lib/reka/external-functions.ts`
- `lib/reka/external-components.ts`
- `components/editor/shared/external-component-wrapper.tsx`

### Phase 9: Dynamic Page Rendering

**Tasks:**

1. Create dynamic route `app/pages/[slug]/page.tsx`
2. Implement server-side page renderer:

   - Load RekaJS AST from database
   - Create frame from AST
   - Render view tree to React components

3. Create component resolver for runtime rendering
4. Handle loading states and error boundaries
5. Add preview mode for unpublished pages
6. Implement SEO-friendly rendering

**Files:**

- `app/pages/[slug]/page.tsx`
- `app/pages/[slug]/layout.tsx`
- `lib/render/page-renderer.tsx`
- `lib/render/component-resolver.tsx`
- `lib/render/view-to-react.tsx`

### Phase 10: Advanced UI Features

**Tasks:**

1. Build bottom bar:

   - Syncing toggle indicator
   - Remove Frame button
   - Edit Frame Props button
   - Toggle View button

2. Implement undo/redo with history store
3. Add version history
4. Create component templates
5. Add responsive preview modes
6. Implement export functionality (JSON, HTML, Code)
7. Add keyboard shortcuts
8. Implement expression autocomplete

**Files:**

- `components/editor/shared/bottom-bar.tsx`
- `components/editor/shared/undo-redo.tsx`
- `components/editor/shared/preview-button.tsx`
- `components/editor/shared/save-button.tsx`
- `lib/editor/logic/export.ts`
- `lib/editor/logic/keyboard-shortcuts.ts`
- `lib/editor/logic/expression-autocomplete.ts`

### Phase 11: AI Integration

**Tasks:**

1. Integrate AI component generation:

   - AI prompt interface
   - Generate RekaJS AST from natural language
   - Convert to CraftJS nodes
   - Insert into editor

2. Add smart suggestions:

   - Component recommendations
   - Property suggestions
   - Layout suggestions
   - Expression suggestions

3. Implement natural language to component conversion
4. Add AI-assisted expression writing

**Files:**

- `components/editor/ai/component-generator.tsx`
- `components/editor/ai/suggestions.tsx`
- `lib/ai/reka-generator.ts`
- `lib/ai/expression-assistant.ts`

### Phase 12: Testing & Polish

**Tasks:**

1. Unit tests:

   - State converters (CraftJS ↔ RekaJS)
   - Expression parser and validator
   - Loop and conditional helpers
   - Variable manager

2. Integration tests:

   - State synchronization
   - Save/load functionality
   - Loop rendering
   - Conditional rendering

3. E2E tests:

   - User workflows (create page, add loop, add conditional)
   - Property editing
   - State persistence

4. Performance optimization:

   - Debounce state updates
   - Memoize expensive computations
   - Lazy load components
   - Cache computed views

5. Error handling:

   - Expression validation errors
   - State sync errors
   - Render errors

6. Accessibility:

   - Keyboard navigation
   - Screen reader support
   - ARIA labels

7. Documentation:

   - Component usage guides
   - Expression syntax guide
   - Workflow documentation

## Key Technical Decisions

### State Management Strategy

- **Zustand** for all editor UI state (panels, zoom, selection, etc.)
- **CraftJS** manages its own internal node tree state
- **RekaJS** manages AST-based component state (props, state, templates, loops, conditionals)
- Zustand stores sync with CraftJS/RekaJS on user actions with debouncing

### Expression Handling

- Parse and validate RekaJS expressions before execution
- Support identifiers, literals, binary expressions, call expressions, member expressions
- Provide autocomplete for variables and functions
- Show validation errors inline

### Loop Implementation

- EachTemplate renders multiple items from iterator expression
- Support external functions (e.g., `$getPosts()`)
- Expose variables (item, index) in template scope
- Visual indicators for loop elements in canvas

### Conditional Implementation

- ConditionalTemplate renders based on boolean expression
- Support complex expressions (binary, logical operators)
- Manage true/false branches separately
- Visual indicators for conditional elements

### Component State

- Use Val statements for component state
- Initialize from props or literals
- Update state via event handlers (onClick, etc.)
- State available in template expressions

## Success Criteria

1. Users can create pages visually using drag-and-drop
2. Three-panel layout works responsively
3. Zustand stores manage all UI state correctly
4. Users can create loops/lists using EachTemplate
5. Users can create conditional rendering
6. Users can manage global variables
7. Users can manage component state
8. Users can use external functions in expressions
9. Pages can be saved and loaded from database
10. Published pages render correctly at `/pages/[slug]`
11. Components can be edited via property panels
12. Expression validation works correctly
13. State persists correctly between editor sessions
14. Server-side rendering works for published pages
15. Clear separation between Logic/State/UI layers

## File Structure

```
app/
├── editor/
│   ├── page.tsx                    # New project editor
│   └── [projectId]/
│       └── page.tsx                # Edit existing project
├── pages/
│   └── [slug]/
│       ├── page.tsx                # Dynamic page renderer
│       └── layout.tsx              # Page layout wrapper
└── api/
    └── editor/
        ├── projects/
        │   ├── route.ts
        │   └── [id]/route.ts
        ├── pages/
        │   ├── route.ts
        │   └── [slug]/
        │       ├── route.ts
        │       └── publish/route.ts
        └── components/route.ts

components/
├── editor/
│   ├── layout/                     # Layout components
│   ├── left-sidebar/               # Left sidebar components
│   ├── canvas/                     # Canvas components
│   ├── right-sidebar/              # Right sidebar components
│   ├── shared/                     # Shared editor components
│   └── ai/                         # AI integration components
└── blocks/                         # Block components

lib/
├── editor/
│   ├── state/                      # Zustand stores
│   ├── logic/                      # Business logic
│   ├── types/                      # TypeScript types
│   └── hooks/                      # Custom React hooks
├── render/
│   ├── page-renderer.tsx
│   └── component-resolver.tsx
├── reka/
│   ├── instance.ts
│   └── externals.ts
└── blocks/
    ├── resolvers.tsx
    ├── registry.ts
    └── definitions.ts
```

## References

- [Research and Workflows](./research-and-workflows.md)
- [Architecture Document](./architecture.md)
- [CraftJS Documentation](./craftjs/)
- [RekaJS Documentation](./rekajs/)