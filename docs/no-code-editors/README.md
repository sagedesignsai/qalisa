# No-Code Editor Documentation

Welcome to the no-code editor documentation for Qalisa. This documentation covers the implementation of a visual, drag-and-drop application builder using CraftJS and RekaJS.

## Quick Start

1. Read the [Overview](./overview.md) to understand the system
2. Review the [Architecture](./architecture.md) to see how components work together
3. Check the [MVP Plan](./mvp-plan.md) for implementation details
4. Study the [Research and Workflows](./research-and-workflows.md) for advanced features and patterns
5. Explore [CraftJS](./craftjs/) and [RekaJS](./rekajs/) documentation

## Documentation Structure

```
docs/no-code-editors/
├── README.md (this file)
├── overview.md              # System overview and features
├── architecture.md         # System architecture and data flow
├── mvp-plan.md             # MVP implementation plan
├── research-and-workflows.md # Advanced features, patterns, and UI/UX workflows
├── craftjs/
│   ├── introduction.md     # CraftJS introduction
│   ├── core-concepts.md    # Core concepts and patterns
│   ├── api-reference.md    # Complete API reference
│   └── integration-guide.md # Integration guide
└── rekajs/
    ├── introduction.md     # RekaJS introduction
    ├── core-concepts.md    # Core concepts and patterns
    ├── api-reference.md    # Complete API reference
    └── integration-guide.md # Integration guide
```

## Key Concepts

### CraftJS
- **Purpose**: Visual drag-and-drop editor interface
- **Key Features**: Component manipulation, selection, serialization
- **Use Case**: User-facing editing experience

### RekaJS
- **Purpose**: AST-based state management
- **Key Features**: Component logic, props, state, templates
- **Use Case**: Underlying state representation and computation

### Integration
- CraftJS handles the visual editing experience
- RekaJS manages the component logic and state
- They work together through state synchronization

## Getting Started

### For Developers

1. **Setup**: Follow the integration guides for [CraftJS](./craftjs/integration-guide.md) and [RekaJS](./rekajs/integration-guide.md)
2. **Architecture**: Understand the [system architecture](./architecture.md)
3. **Research**: Study [Research and Workflows](./research-and-workflows.md) for advanced features (loops, conditionals, state management)
4. **Implementation**: Follow the [MVP plan](./mvp-plan.md)

### For Users

- The editor provides a visual interface for building applications
- Drag and drop components onto the canvas
- Edit properties in the property panel
- Save and load your designs

## Resources

### Official Documentation
- [CraftJS](https://craft.js.org/docs/overview)
- [RekaJS](https://reka.js.org/docs/introduction)

### Related Documentation
- [AI SDK Documentation](../ai-sdk/)
- [Project README](../../README.md)

## Contributing

When adding new features or components:
1. Update relevant documentation
2. Add examples to integration guides
3. Update the architecture document if needed
4. Keep the MVP plan current

## Support

For questions or issues:
- Check the API references
- Review the integration guides
- Consult the architecture document
- Open an issue in the repository

