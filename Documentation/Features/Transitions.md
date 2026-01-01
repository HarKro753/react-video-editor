Transitions provide smooth effects between timeline items, creating professional-looking video content with seamless scene changes. The DesignCombo Video Editor SDK supports various transition types that can be applied between track items.

## Transition Basics

Transitions are effects that occur between two timeline items, creating smooth visual connections.

### Transition Structure

```typescript
interface ITransition {
  id: string; // Unique identifier (format: "fromId-toId")
  kind: TransitionKind; // Transition kind
  duration: number; // Duration in milliseconds
  fromId: string; // Source item ID
  toId: string; // Target item ID
  trackId: string; // Track ID where transition occurs
  type: "transition"; // Type identifier
  direction?: string; // Direction for directional transitions
}
```

```typescript
// Transition kinds available in the SDK
type TransitionKind =
  | "none"
  | "fade"
  | "slide"
  | "wipe"
  | "flip"
  | "clockWipe"
  | "star"
  | "circle"
  | "rectangle";

// Direction types for directional transitions
type TransitionDirection =
  | "from-bottom"
  | "from-top"
  | "from-left"
  | "from-right";

// State structure for transitions
interface State {
  // ... other properties
  transitionIds: string[]; // Array of transition IDs
  transitionsMap: {
    // Map of transitions by ID
    [key: string]: ITransition;
  };
}
```

````

## Transition Types

### 1. No Transition

No transition effect between items.

```typescript

// No transition
dispatch(ADD_TRANSITION, {
  payload: {
    fromId: "item-1",
    toId: "item-2",
    trackId: "track-1",
    kind: "none",
    duration: 0,
    type: "transition"
  }
});
````

### 2. Fade Transitions

Smooth opacity changes between items.

```typescript
// Fade transition
dispatch(ADD_TRANSITION, {
  payload: {
    fromId: "item-1",
    toId: "item-2",
    trackId: "track-1",
    kind: "fade",
    duration: 1500,
    type: "transition",
  },
});
```

### 3. Slide Transitions

Items slide in from different directions.

```typescript
// Slide up
dispatch(ADD_TRANSITION, {
  payload: {
    fromId: "item-1",
    toId: "item-2",
    trackId: "track-1",
    kind: "slide",
    duration: 1500,
    type: "transition",
    direction: "from-bottom",
  },
});

// Slide down
dispatch(ADD_TRANSITION, {
  payload: {
    fromId: "item-1",
    toId: "item-2",
    trackId: "track-1",
    kind: "slide",
    duration: 1500,
    type: "transition",
    direction: "from-top",
  },
});

// Slide left
dispatch(ADD_TRANSITION, {
  payload: {
    fromId: "item-1",
    toId: "item-2",
    trackId: "track-1",
    kind: "slide",
    duration: 1500,
    type: "transition",
    direction: "from-right",
  },
});

// Slide right
dispatch(ADD_TRANSITION, {
  payload: {
    fromId: "item-1",
    toId: "item-2",
    trackId: "track-1",
    kind: "slide",
    duration: 1500,
    type: "transition",
    direction: "from-left",
  },
});
```

### 4. Wipe Transitions

Items are revealed by wiping across the screen.

```typescript
// Wipe up
dispatch(ADD_TRANSITION, {
  payload: {
    fromId: "item-1",
    toId: "item-2",
    trackId: "track-1",
    kind: "wipe",
    duration: 1500,
    type: "transition",
    direction: "from-bottom",
  },
});

// Wipe down
dispatch(ADD_TRANSITION, {
  payload: {
    fromId: "item-1",
    toId: "item-2",
    trackId: "track-1",
    kind: "wipe",
    duration: 1500,
    type: "transition",
    direction: "from-top",
  },
});

// Wipe left
dispatch(ADD_TRANSITION, {
  payload: {
    fromId: "item-1",
    toId: "item-2",
    trackId: "track-1",
    kind: "wipe",
    duration: 1500,
    type: "transition",
    direction: "from-right",
  },
});

// Wipe right
dispatch(ADD_TRANSITION, {
  payload: {
    fromId: "item-1",
    toId: "item-2",
    trackId: "track-1",
    kind: "wipe",
    duration: 1500,
    type: "transition",
    direction: "from-left",
  },
});
```

### 5. Flip Transitions

Items flip to reveal the next item.

```typescript
// Flip transition
dispatch(ADD_TRANSITION, {
  payload: {
    fromId: "item-1",
    toId: "item-2",
    trackId: "track-1",
    kind: "flip",
    duration: 1500,
    type: "transition",
  },
});
```

### 6. Clock Wipe Transitions

Items are revealed in a clock-like circular motion.

```typescript
// Clock wipe transition
dispatch(ADD_TRANSITION, {
  payload: {
    fromId: "item-1",
    toId: "item-2",
    trackId: "track-1",
    kind: "clockWipe",
    duration: 1500,
    type: "transition",
  },
});
```

### 7. Star Transitions

Items are revealed in a star-shaped pattern.

```typescript
// Star transition
dispatch(ADD_TRANSITION, {
  payload: {
    fromId: "item-1",
    toId: "item-2",
    trackId: "track-1",
    kind: "star",
    duration: 1500,
    type: "transition",
  },
});
```

### 8. Circle Transitions

Items are revealed in a circular pattern.

```typescript
// Circle transition
dispatch(ADD_TRANSITION, {
  payload: {
    fromId: "item-1",
    toId: "item-2",
    trackId: "track-1",
    kind: "circle",
    duration: 1500,
    type: "transition",
  },
});
```

### 9. Rectangle Transitions

Items are revealed in a rectangular pattern.

```typescript
// Rectangle transition
dispatch(ADD_TRANSITION, {
  payload: {
    fromId: "item-1",
    toId: "item-2",
    trackId: "track-1",
    kind: "rectangle",
    duration: 1500,
    type: "transition",
  },
});
```

## Transition Management

### Adding Transitions

```typescript
// Add single transition
dispatch(ADD_TRANSITION, {
  payload: {
    fromId: "item-1",
    toId: "item-2",
    trackId: "track-1",
    kind: "fade",
    duration: 1500,
    type: "transition",
  },
});

// Add multiple transitions using bulk operations

dispatch(EDIT_BULK, {
  payload: {
    actions: [
      {
        type: ADD_TRANSITION,
        payload: {
          fromId: "item-1",
          toId: "item-2",
          trackId: "track-1",
          kind: "fade",
          duration: 1500,
          type: "transition",
        },
      },
      {
        type: ADD_TRANSITION,
        payload: {
          fromId: "item-2",
          toId: "item-3",
          trackId: "track-1",
          kind: "slide",
          duration: 1500,
          type: "transition",
          direction: "from-bottom",
        },
      },
    ],
  },
});
```

### Updating Transitions

```typescript
// Update transition properties
dispatch(EDIT_OBJECT, {
  payload: {
    id: "item-1-item-2",
    updates: {
      duration: 2000,
      direction: "from-top",
    },
  },
});

// Update transition kind
dispatch(EDIT_OBJECT, {
  payload: {
    id: "item-1-item-2",
    updates: {
      kind: "slide",
      direction: "from-bottom",
    },
  },
});
```

### Removing Transitions

```typescript
// Remove transitions by ID
dispatch(LAYER_DELETE, {
  payload: {
    trackItemIds: ["item-1-item-2", "item-2-item-3"],
  },
});
```

## Transition Presets

### Built-in Transitions

The SDK includes a comprehensive set of built-in transitions:

```typescript
// Available transition kinds
const TRANSITION_KINDS = [
  "none",
  "fade",
  "slide",
  "wipe",
  "flip",
  "clockWipe",
  "star",
  "circle",
  "rectangle",
];

// Directional transitions
const DIRECTIONAL_TRANSITIONS = [
  "slide", // with direction: "from-bottom", "from-top", "from-left", "from-right"
  "wipe", // with direction: "from-bottom", "from-top", "from-left", "from-right"
];
```

### Using Built-in Transitions

```typescript
// Apply a fade transition
dispatch(ADD_TRANSITION, {
  payload: {
    fromId: "item-1",
    toId: "item-2",
    trackId: "track-1",
    kind: "fade",
    duration: 1500,
    type: "transition",
  },
});

// Apply a directional transition
dispatch(ADD_TRANSITION, {
  payload: {
    fromId: "item-1",
    toId: "item-2",
    trackId: "track-1",
    kind: "slide",
    duration: 1500,
    type: "transition",
    direction: "from-bottom",
  },
});
```

## Transition Sequences

### Creating Sequences

```typescript
// Create transition sequence
const sequence = [
  {
    fromId: "item-1",
    toId: "item-2",
    trackId: "track-1",
    kind: "fade",
    duration: 1500,
    type: "transition",
  },
  {
    fromId: "item-2",
    toId: "item-3",
    trackId: "track-1",
    kind: "slide",
    duration: 1500,
    type: "transition",
    direction: "from-bottom",
  },
  {
    fromId: "item-3",
    toId: "item-4",
    trackId: "track-1",
    kind: "flip",
    duration: 1500,
    type: "transition",
  },
];

// Apply sequence using bulk operations
dispatch(EDIT_BULK, {
  payload: {
    actions: sequence.map((transition, index) => ({
      type: ADD_TRANSITION,
      payload: transition,
    })),
  },
});
```

## Transition Performance

### Optimization

```typescript
// Enable transition optimization
timeline.enableTransitionOptimization({
  useHardwareAcceleration: true,
  preloadTransitions: true,
  maxConcurrent: 5,
});

// Set transition quality
timeline.setTransitionQuality({
  quality: "high", // "low", "medium", "high"
  antialiasing: true,
  smoothing: true,
});
```

## Transition Events

### Lifecycle Events

```typescript
// Subscribe to transition events
stateManager.subscribeToTransitions(({ transitionIds, transitionsMap }) => {
  console.log("Transitions updated:", transitionIds);
  console.log("Transition details:", transitionsMap);
});

// Access transition data
const state = stateManager.getState();
console.log("All transitions:", state.transitionsMap);
console.log("Transition IDs:", state.transitionIds);

// Get specific transition
const transition = state.transitionsMap["item-1-item-2"];
console.log("Transition details:", transition);
```

## Advanced Transitions

### Custom Transition Effects

```typescript
// Register custom transition
timeline.registerTransition("custom", {
  render: (fromItem, toItem, progress, canvas) => {
    // Custom rendering logic
    const ctx = canvas.getContext("2d");

    // Example: custom wave effect
    const wave = Math.sin(progress * Math.PI * 4) * 20;

    // Render from item
    ctx.globalAlpha = 1 - progress;
    renderItem(fromItem, ctx);

    // Render to item with wave offset
    ctx.globalAlpha = progress;
    ctx.save();
    ctx.translate(wave, 0);
    renderItem(toItem, ctx);
    ctx.restore();
  },
});

// Use custom transition
dispatch(ADD_TRANSITION, {
  payload: {
    fromId: "item-1",
    toId: "item-2",
    trackId: "track-1",
    kind: "custom",
    duration: 2000,
    type: "transition",
  },
});
```

### Transition Masks

```typescript
// Apply transition mask using built-in transitions
dispatch(ADD_TRANSITION, {
  payload: {
    fromId: "item-1",
    toId: "item-2",
    trackId: "track-1",
    kind: "circle",
    duration: 1500,
    type: "transition",
  },
});
```

## Important Notes

1. **Transition Timing**: Transitions work with the `display` timing of track items
2. **Performance**: Complex transitions may impact rendering performance
3. **Compatibility**: Not all transition types work with all item types
4. **Hardware Acceleration**: Enable for better performance on supported devices
5. **Memory Management**: Clean up custom transitions to prevent memory leaks

## Next Steps

- Explore the [API Reference](./development/api-reference.mdx)
- Check out [Examples](./development/examples.mdx) for practical usage
- Understand [Customization](./development/customization.mdx) for advanced usage
