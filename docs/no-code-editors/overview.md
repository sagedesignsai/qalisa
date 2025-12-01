# No-Code Editor System Overview

## Introduction

This document provides an overview of the no-code editor system being implemented in Qalisa. The system enables users to build and live-edit applications using visual, drag-and-drop interfaces without writing code.

## Architecture

The no-code editor system is built on two core technologies:

1. **CraftJS** - A React framework for building drag-and-drop page editors
2. **RekaJS** - An AST-based state management system for no-code editors

### How They Work Together

- **CraftJS** provides the visual editing interface, drag-and-drop functionality, and component manipulation
- **RekaJS** manages the underlying state as an Abstract Syntax Tree (AST), enabling complex component logic and stateful interactions
- Together, they enable users to create sophisticated UI components with state management, props, and templating capabilities

## Key Features

### Visual Editing
- Drag-and-drop component placement
- Live preview of changes
- Visual component selection and manipulation
- Inline editing capabilities

### Component System
- Reusable component library
- Custom component creation
- Component props and state management
- Nested component structures

### State Management
- AST-based state representation
- Serializable state (JSON)
- Component state and props
- External function integration

### AI Integration
- AI-assisted component generation
- Smart suggestions and autocomplete
- Natural language to component conversion
- Code generation from visual designs

## Documentation Structure

```
docs/no-code-editors/
├── overview.md (this file)
├── craftjs/
│   ├── introduction.md
│   ├── core-concepts.md
│   ├── api-reference.md
│   └── integration-guide.md
├── rekajs/
│   ├── introduction.md
│   ├── core-concepts.md
│   ├── api-reference.md
│   └── integration-guide.md
├── architecture.md
└── mvp-plan.md
```

## References

- [CraftJS Documentation](https://craft.js.org/docs/overview)
- [RekaJS Documentation](https://reka.js.org/docs/introduction)

