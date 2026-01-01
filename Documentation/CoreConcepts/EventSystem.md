The DesignCombo Video Editor SDK uses a centralized event system for communication between components. This event-driven architecture ensures loose coupling and predictable data flow. The event system is the backbone of the state management system, handling all operations through a unified dispatch mechanism.

## Event Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   UI Layer  │───►│ Event Bus   │───►│ State Layer │
│             │    │             │    │             │
│ • Buttons   │    │ • Dispatch  │    │ • Handlers  │
│ • Menus     │    │ • Filter    │    │ • Updates   │
│ • Keyboard  │    │ • Subscribe │    │ • Business  │
└─────────────┘    └─────────────┘    └─────────────┘
```

## Event Dispatching

### Basic Event Dispatch

```typescript
// Dispatch a simple event
dispatch(ADD_TEXT, {
  payload: {
    text: "Hello World",
    fontSize: 24,
    color: "#000000",
  },
  options: {
    targetTrackIndex: 0,
    isSelected: true,
  },
});
```

### Event Structure

```typescript
interface Event {
  type: string; // Event type
  payload?: any; // Event data
  options?: {
    // Event options
    targetTrackIndex?: number;
    targetTrackId?: string;
    isNewTrack?: boolean;
    isSelected?: boolean;
    scaleMode?: string;
    scaleAspectRatio?: number;
  };
  metadata?: {
    // Optional metadata
    timestamp: number;
    source: string;
    id: string;
  };
}
```

## Event Categories

The DesignCombo event system organizes events into several categories based on their functionality:

### Add Events

Events for adding new elements to the design:

- `ADD_TEXT` - Add text elements
- `ADD_IMAGE` - Add images
- `ADD_VIDEO` - Add videos
- `ADD_AUDIO` - Add audio files
- `ADD_SHAPE` - Add shapes
- `ADD_ILLUSTRATION` - Add illustrations
- `ADD_TEMPLATE` - Add templates
- `ADD_CAPTIONS` - Add captions
- `ADD_ANIMATION` - Add animations
- `ADD_COMPOSITION` - Add compositions
- `ADD_RECT` - Add rectangles
- `ADD_PROGRESS_BAR` - Add progress bars
- `ADD_PROGRESS_FRAME` - Add progress frames
- `ADD_PROGRESS_SQUARE` - Add progress squares
- `ADD_RADIAL_AUDIO_BARS` - Add radial audio visualizations
- `ADD_LINEAL_AUDIO_BARS` - Add linear audio visualizations
- `ADD_WAVE_AUDIO_BARS` - Add wave audio visualizations
- `ADD_HILL_AUDIO_BARS` - Add hill audio visualizations

### Edit Events

Events for editing existing elements:

- `EDIT_OBJECT` - Edit object properties
- `REPLACE_MEDIA` - Replace media files
- `EDIT_BACKGROUND_EDITOR` - Edit background

### Layer Events

Events for managing layers:

- `LAYER_SELECT` - Select layers
- `LAYER_COPY` - Copy layers
- `LAYER_DELETE` - Delete layers
- `LAYER_CLONE` - Clone layers
- `LAYER_REPLACE` - Replace layers
- `LAYER_MOVE` - Move layers
- `LAYER_RENAME` - Rename layers
- `LAYER_LOCKED` - Lock/unlock layers
- `LAYER_HIDDEN` - Show/hide layers

### Design Events

Events for managing the overall design:

- `DESIGN_LOAD` - Load a design
- `DESIGN_RESIZE` - Resize the design

### History Events

Events for undo/redo functionality:

- `HISTORY_UNDO` - Undo last action
- `HISTORY_REDO` - Redo last action

### Active Object Events

Events for managing selected objects:

- `ACTIVE_PASTE` - Paste active objects
- `ACTIVE_SPLIT` - Split active objects

### Timeline Scale Events

Events for managing timeline zoom:

- `TIMELINE_SCALE_CHANGED` - Change timeline scale

## Event Types

### 1. Add Events

Events for adding new elements to the timeline.

```typescript
// Add text element
dispatch(ADD_TEXT, {
  payload: {
    text: "Hello World",
    fontSize: 48,
    fontFamily: "Arial",
    color: "#ffffff",
  },
  options: {
    targetTrackIndex: 0,
    isSelected: true,
  },
});

// Add image element
dispatch(ADD_IMAGE, {
  payload: {
    src: "https://example.com/image.jpg",
    alt: "Sample image",
    width: 400,
    height: 300,
  },
  options: {
    targetTrackIndex: 1,
    scaleMode: "fit",
    isSelected: true,
  },
});

// Add video element
dispatch(ADD_VIDEO, {
  payload: {
    src: "https://example.com/video.mp4",
    duration: 10000,
  },
  options: {
    targetTrackIndex: 2,
    scaleMode: "fit",
    isSelected: true,
  },
});

// Add audio element
dispatch(ADD_AUDIO, {
  payload: {
    src: "https://example.com/audio.mp3",
    duration: 5000,
  },
  options: {
    targetTrackIndex: 3,
    isSelected: false,
  },
});
```

### 2. Edit Events

Events for editing existing elements.

```typescript
// Edit object properties
dispatch(EDIT_OBJECT, {
  payload: {
    "item-123": {
      details: {
        text: "Updated text",
        fontSize: 64,
        color: "#ff0000",
      },
      display: {
        from: 0,
        to: 5000,
      },
      playbackRate: 1.5,
    },
  },
});

// Replace media in existing item
dispatch(REPLACE_MEDIA, {
  payload: {
    itemId: "item-123",
    newSrc: "https://example.com/new-image.jpg",
    alt: "New image",
  },
});

// Edit background
dispatch(EDIT_BACKGROUND_EDITOR, {
  payload: {
    type: "color",
    value: "#ffffff",
  },
});
```

### 3. Layer Events

Events for managing timeline layers and items.

```typescript
// Select items
dispatch(LAYER_SELECT, {
  payload: {
    trackItemIds: ["item-1", "item-2", "item-3"],
  },
});

// Delete items
dispatch(LAYER_DELETE, {
  payload: {
    trackItemIds: ["item-1", "item-2"],
  },
});

// Clone items
dispatch(LAYER_CLONE, {
  payload: {
    trackItemIds: ["item-1"],
  },
});

// Copy items to clipboard
dispatch(LAYER_COPY, {});
```

### 4. History Events

Events for undo/redo functionality.

```typescript
// Undo last operation
dispatch(HISTORY_UNDO, {});

// Redo last undone operation
dispatch(HISTORY_REDO, {});
```

### 5. Design Events

Events for project-level operations.

```typescript
// Load design
dispatch(DESIGN_LOAD, {
  payload: {
    fps: 30,
    tracks: [...],
    size: { width: 1920, height: 1080 },
    trackItemIds: [...],
    trackItemsMap: {...},
    transitionIds: [...],
    transitionsMap: {...}
  }
});

// Resize design
dispatch(DESIGN_RESIZE, {
  payload: {
    width: 1920,
    height: 1080
  }
});
```

### 6. Timeline Scale Events

Events for timeline zoom and scale management.

```typescript
// Change timeline scale
dispatch(TIMELINE_SCALE_CHANGED, {
  payload: {
    scale: {
      index: 7,
      unit: 300,
      zoom: 1 / 300,
      segments: 5,
    },
  },
});
```

### 7. Active Object Events

Events for managing selected objects.

```typescript
// Paste active objects
dispatch(ACTIVE_PASTE, {});

// Split active objects at specific time
dispatch(ACTIVE_SPLIT, {
  options: {
    time: 2500,
  },
});
```

## Bulk Operations

### EDIT_BULK

Performs multiple operations in a single transaction.

```typescript
dispatch(EDIT_BULK, {
  payload: {
    actions: [
      {
        type: ADD_TEXT,
        payload: { text: "First item" },
      },
      {
        type: ADD_IMAGE,
        payload: { src: "image.jpg" },
      },
    ],
  },
});
```

## Event Subscriptions

### Subscribe to Events

```typescript
// Subscribe to specific event type
const subscription = subscribe(ADD_TEXT, (event) => {
  console.log("Text added:", event.payload);
});

// Subscribe to multiple event types
const multiSubscription = subscribe([ADD_TEXT, ADD_IMAGE], (event) => {
  console.log("Element added:", event.type, event.payload);
});

// Subscribe to all events
const allSubscription = subscribe("*", (event) => {
  console.log("All events:", event.type, event.payload);
});

// Unsubscribe
unsubscribe(subscription);
unsubscribe(multiSubscription);
unsubscribe(allSubscription);
```

### Event Filters

```typescript
// Subscribe with filter
const filteredSubscription = subscribe(
  "add:*",
  (event) => {
    console.log("Add event:", event.type, event.payload);
  },
  {
    filter: (event) => {
      // Only process events with specific conditions
      return event.payload.name.includes("Important");
    },
  }
);
```

## Important Notes

1. **Event Order**: Events are processed asynchronously, so the order of operations matters
2. **State Updates**: All state updates are handled automatically by the state manager
3. **History**: Most operations are automatically added to the undo/redo history
4. **Validation**: The system validates inputs and handles errors gracefully
5. **Performance**: Bulk operations should be used for multiple related changes
6. **Tracks**: Items are automatically placed on appropriate tracks based on their type
7. **Timing**: All items have timing information (from/to) for timeline positioning

## Next Steps

- Learn about [Track Items](./features/track-items.mdx)
- Understand [Animations](./features/animations.mdx)
- Explore [Transitions](./features/transitions.mdx)
- Check out [Examples](./development/examples.mdx) for practical usage
