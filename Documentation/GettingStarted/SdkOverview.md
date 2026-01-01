A comprehensive React-based video editor SDK that provides a modular architecture for building custom video editing applications.

## Overview

The DesignCombo Video Editor SDK is a powerful, modular video editing solution built with React and TypeScript. It consists of three core packages that work together to provide a complete video editing experience:

- **@designcombo/state**: Central state management and business logic
- **@designcombo/timeline**: Canvas-based timeline visualization and interaction
- **@designcombo/types**: TypeScript type definitions and interfaces

## Quick Start

```bash
# Install the SDK
npm install @designcombo/state @designcombo/timeline @designcombo/types

# Or using pnpm
pnpm add @designcombo/state @designcombo/timeline @designcombo/types
```

```typescript
// Initialize state manager
const stateManager = new StateManager({
  size: { width: 1920, height: 1080 },
  fps: 30,
});

// Create timeline
const timeline = new Timeline(canvasElement, {
  scale: { unit: 300, zoom: 1 / 300, segments: 5, index: 7 },
  duration: 10000,
  state: stateManager,
});

// Add a text element
dispatch("add:text", {
  payload: {
    name: "Hello World",
    details: {
      text: "Hello World",
      fontSize: 48,
      fontFamily: "Arial",
      color: "#ffffff",
    },
  },
});
```

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   State Manager │    │   Timeline      │
│                 │    │                 │    │                 │
│ • UI Components │◄──►│ • State Store   │◄──►│ • Canvas        │
│ • Event Handlers│    │ • Event Handlers│    │ • Interactions  │
│ • User Actions  │    │ • Business Logic│    │ • Visualization │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Event System  │
                    │                 │
                    │ • Event Bus     │
                    │ • Event Filters │
                    │ • Event Handlers│
                    └─────────────────┘
```

## Key Features

- **Modular Architecture**: Separate concerns between state, timeline, and UI
- **Event-Driven**: Reactive system using a centralized event bus
- **TypeScript Support**: Full type safety and IntelliSense
- **Canvas-Based Timeline**: High-performance timeline visualization
- **Rich Media Support**: Text, images, videos, audio, shapes, and more
- **Animation System**: Built-in animation support with easing functions
- **Transition Effects**: Multiple transition types between elements
- **History Management**: Undo/redo functionality
- **Customizable**: Extensible architecture for custom elements and behaviors

## Package Structure

```
packages/
├── state/           # State management and business logic
├── timeline/        # Canvas timeline and interactions
├── types/           # TypeScript type definitions
└── typescript-config/ # Shared TypeScript configuration

apps/
└── react/           # Example React application
```

## Documentation Structure

1. **[Installation](./installation.mdx)** - Installation and setup
2. **[Quick Start](./quick-start.mdx)** - First steps with the SDK
3. **[Architecture](./core-concepts/architecture.mdx)** - Understanding the architecture
4. **[State Management](./core-concepts/state-management.mdx)** - Managing application state
5. **[Timeline System](./core-concepts/timeline-system.mdx)** - Timeline visualization and interaction
6. **[Event System](./core-concepts/event-system.mdx)** - Event-driven architecture
7. **[Track Items](./features/track-items.mdx)** - Working with media elements
8. **[Animations](./features/animations.mdx)** - Creating and managing animations
9. **[Transitions](./features/transitions.mdx)** - Transition effects between elements
10. **[API Reference](./development/api-reference.mdx)** - Complete API documentation
11. **[Customization Guide](./development/customization.mdx)** - Extending the SDK
12. **[Examples](./development/examples.mdx)** - Code examples and use cases

## License

This SDK is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.
