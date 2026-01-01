Get up and running with the DesignCombo Video Editor SDK in minutes.

## Basic Example

Here's a minimal example to get you started:

```typescript
function SimpleVideoEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize state manager
    const stateManager = new StateManager({
      size: { width: 1920, height: 1080 },
      fps: 30,
    });

    // Initialize timeline
    const timeline = new Timeline(canvasRef.current, {
      scale: { unit: 300, zoom: 1 / 300, segments: 5, index: 7 },
      duration: 10000,
      state: stateManager,
    });

    // Add a text element
    dispatch(ADD_TEXT, {
      payload: {
        text: "Welcome to DesignCombo!",
        fontSize: 48,
        fontFamily: "Arial",
        color: "#ffffff",
      },
      options: {
        targetTrackIndex: 0,
        isSelected: true,
      },
    });

    // Cleanup
    return () => {
      timeline.purge();
      stateManager.purge();
    };
  }, []);

  return (
    <div>
      <h1>DesignCombo Video Editor</h1>
      <canvas
        ref={canvasRef}
        width={1200}
        height={400}
        style={{ border: "1px solid #ccc" }}
      />
    </div>
  );
}

export default SimpleVideoEditor;
```

## Adding Different Elements

### Text Elements

```typescript
// Add text
dispatch(ADD_TEXT, {
  payload: {
    text: "Hello World",
    fontSize: 48,
    fontFamily: "Arial",
    color: "#ffffff",
    textAlign: "center",
  },
  options: {
    targetTrackIndex: 0,
    isSelected: true,
  },
});
```

### Image Elements

```typescript
// Add image
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
```

### Video Elements

```typescript
// Add video
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
```

### Audio Elements

```typescript
// Add audio
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

## Working with Elements

### Selecting Elements

```typescript
// Select elements by ID
dispatch(LAYER_SELECT, {
  payload: {
    trackItemIds: ["element-1", "element-2", "element-3"],
  },
});
```

### Updating Elements

```typescript
// Update text content
dispatch(EDIT_OBJECT, {
  payload: {
    "text-element-id": {
      details: {
        text: "Updated text content",
        fontSize: 64,
        color: "#ff0000",
      },
    },
  },
});

// Update display timing
dispatch(EDIT_OBJECT, {
  payload: {
    "element-id": {
      display: {
        from: 2000,
        to: 8000,
      },
    },
  },
});
```

### Deleting Elements

```typescript
// Delete elements
dispatch(LAYER_DELETE, {
  payload: {
    trackItemIds: ["element-1", "element-2"],
  },
});
```

## Timeline Controls

### Timeline Scale

```typescript
// Change timeline zoom level
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

### History Controls

```typescript
// Undo last action
dispatch(HISTORY_UNDO, {});

// Redo last undone action
dispatch(HISTORY_REDO, {});
```

## State Management

### Subscribing to Changes

```typescript
// Subscribe to active element changes
const subscription = stateManager.subscribeToActiveIds(({ activeIds }) => {
  console.log("Active elements:", activeIds);
});

// Subscribe to track changes
const trackSubscription = stateManager.subscribeToTracks(
  ({ tracks, changedTracks }) => {
    console.log("Tracks updated:", tracks);
    console.log("Changed tracks:", changedTracks);
  }
);

// Subscribe to track item changes
const itemSubscription = stateManager.subscribeToUpdateTrackItem(
  ({ trackItemsMap }) => {
    console.log("Track items updated:", trackItemsMap);
  }
);

// Subscribe to timing changes
const timingSubscription = stateManager.subscribeToUpdateTrackItemTiming(
  ({ trackItemsMap, changedTrimIds, changedDisplayIds }) => {
    console.log("Timing updated:", { changedTrimIds, changedDisplayIds });
  }
);

// Cleanup subscriptions
subscription.unsubscribe();
trackSubscription.unsubscribe();
itemSubscription.unsubscribe();
timingSubscription.unsubscribe();
```

### Getting Current State

```typescript
// Get current state
const state = stateManager.getState();

// Get all track items
const trackItems = state.trackItemsMap;

// Get active elements
const activeElements = state.activeIds;

// Get timeline scale
const scale = state.scale;

// Get project settings
const settings = {
  size: state.size,
  fps: state.fps,
  duration: state.duration,
};
```

## Export and Rendering

### Export Design

```typescript
// Export complete design
const designData = stateManager.exportState();

// Import design
stateManager.importState(designData);
```

### Design Loading

```typescript

// Load a complete design
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
```

### Design Resizing

```typescript
// Resize the design canvas
dispatch(DESIGN_RESIZE, {
  payload: {
    width: 1920,
    height: 1080,
  },
});
```

## Advanced Features

### Audio Visualizations

```typescript
// Add radial audio visualization
dispatch(ADD_RADIAL_AUDIO_BARS, {
  payload: {
    audioData: [0.1, 0.3, 0.5, 0.7, 0.9, 0.8, 0.6, 0.4],
  },
  options: {
    targetTrackIndex: 4,
  },
});

// Add linear audio visualization
dispatch(ADD_LINEAL_AUDIO_BARS, {
  payload: {
    audioData: [0.2, 0.4, 0.6, 0.8, 0.7, 0.5, 0.3, 0.1],
  },
  options: {
    targetTrackIndex: 5,
  },
});
```

### Progress Elements

```typescript
// Add progress bar
dispatch(ADD_PROGRESS_BAR, {
  payload: {
    progress: 0.75,
  },
  options: {
    targetTrackIndex: 6,
  },
});

// Add progress frame
dispatch(ADD_PROGRESS_FRAME, {
  payload: {
    progress: 0.5,
  },
  options: {
    targetTrackIndex: 7,
  },
});
```

### Bulk Operations

```typescript
// Perform multiple operations in a single transaction
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

## Next Steps

- Explore [Core Concepts](./core-concepts/architecture.mdx) to understand the architecture
- Learn about [State Management](./core-concepts/state-management.mdx)
- Check out [Track Items](./features/track-items.mdx) for advanced element handling
- See [Examples](./development/examples.mdx) for more complex use cases
