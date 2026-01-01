The `@designcombo/state` package provides the core state management functionality for the video editor SDK. The state manager handles various types of events for adding, editing, and managing design elements in a timeline-based editor.

## StateManager Class

The `StateManager` class is the central state management system that handles all video editor data and operations.

### Initialization

```typescript
const stateManager = new StateManager(
  initialState, // Optional initial state
  config // Optional configuration
);
```

### Configuration Options

```typescript
interface StateManagerConfig {
  cors?: {
    audio?: boolean;
    video?: boolean;
    image?: boolean;
  };
  acceptsMap?: Record<string, string[]>;
  scale?: ITimelineScaleState;
}
```

### Default State

```typescript
const initialState: State = {
  size: { width: 1920, height: 1080 },
  fps: 30,
  tracks: [],
  trackItemIds: [],
  trackItemsMap: {},
  transitionIds: [],
  transitionsMap: {},
  scale: {
    index: 7,
    unit: 300,
    zoom: 1 / 300,
    segments: 5,
  },
  duration: 0,
  activeIds: [],
  structure: [],
  background: {
    type: "color",
    value: "transparent",
  },
};
```

## Event-Driven Architecture

The DesignCombo state system uses an event-driven architecture where you dispatch events to perform actions on the design state. All events are handled through the `@designcombo/events` system and processed by the state manager.

### Basic Usage

```typescript
// Dispatch an event
dispatch(ADD_TEXT, {
  payload: {
    text: "Hello World",
    fontSize: 24,
    color: "#000000",
  },
  options: {
    trackIndex: 0,
    isSelected: true,
  },
});
```

## Event Categories

Events are organized into several categories based on their functionality:

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

## Add Events

### ADD_TEXT

Adds a text element to the design.

**Payload:**

```typescript
{
  text: string;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: "left" | "center" | "right";
  lineHeight?: number;
  letterSpacing?: number;
}
```

**Options:**

```typescript
{
  targetTrackIndex?: number;
  targetTrackId?: string;
  isNewTrack?: boolean;
  isSelected?: boolean;
}
```

**Example:**

```typescript
dispatch(ADD_TEXT, {
  payload: {
    text: "Hello World",
    fontSize: 24,
    color: "#000000",
    fontFamily: "Arial",
    textAlign: "center",
  },
  options: {
    targetTrackIndex: 0,
    isSelected: true,
  },
});
```

### ADD_IMAGE

Adds an image to the design.

**Payload:**

```typescript
{
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}
```

**Options:**

```typescript
{
  targetTrackIndex?: number;
  targetTrackId?: string;
  scaleMode?: string;
  scaleAspectRatio?: number;
  isNewTrack?: boolean;
  isSelected?: boolean;
}
```

**Example:**

```typescript
dispatch(ADD_IMAGE, {
  payload: {
    src: "https://example.com/image.jpg",
    alt: "Sample image",
    width: 1920,
    height: 1080,
  },
  options: {
    targetTrackIndex: 1,
    scaleMode: "fit",
    isSelected: true,
  },
});
```

### ADD_VIDEO

Adds a video to the design.

**Payload:**

```typescript
{
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  duration?: number;
}
```

**Options:**

```typescript
{
  targetTrackIndex?: number;
  targetTrackId?: string;
  scaleMode?: string;
  scaleAspectRatio?: number;
  isNewTrack?: boolean;
  isSelected?: boolean;
}
```

### ADD_AUDIO

Adds an audio file to the design.

**Payload:**

```typescript
{
  src: string;
  alt?: string;
  duration?: number;
}
```

**Options:**

```typescript
{
  targetTrackIndex?: number;
  targetTrackId?: string;
  isNewTrack?: boolean;
  isSelected?: boolean;
}
```

### ADD_SHAPE

Adds a shape to the design.

**Payload:**

```typescript
{
  type: string;
  src?: string;
  width?: number;
  height?: number;
  color?: string;
}
```

**Options:**

```typescript
{
  targetTrackIndex?: number;
  targetTrackId?: string;
  scaleMode?: string;
  scaleAspectRatio?: number;
  isSelected?: boolean;
}
```

### Progress and Audio Visualization Elements

#### ADD_PROGRESS_BAR

**Payload:** `{ progress: number }`
**Options:** `{ targetTrackIndex?: number; targetTrackId?: string; isSelected?: boolean; }`

#### ADD_PROGRESS_FRAME

**Payload:** `{ progress: number }`
**Options:** `{ targetTrackIndex?: number; targetTrackId?: string; isSelected?: boolean; }`

#### ADD_PROGRESS_SQUARE

**Payload:** `{ progress: number }`
**Options:** `{ targetTrackIndex?: number; targetTrackId?: string; isSelected?: boolean; }`

#### ADD_RADIAL_AUDIO_BARS

**Payload:** `{ audioData: number[] }`
**Options:** `{ targetTrackIndex?: number; targetTrackId?: string; isSelected?: boolean; }`

#### ADD_LINEAL_AUDIO_BARS

**Payload:** `{ audioData: number[] }`
**Options:** `{ targetTrackIndex?: number; targetTrackId?: string; isSelected?: boolean; }`

#### ADD_WAVE_AUDIO_BARS

**Payload:** `{ audioData: number[] }`
**Options:** `{ targetTrackIndex?: number; targetTrackId?: string; isSelected?: boolean; }`

#### ADD_HILL_AUDIO_BARS

**Payload:** `{ audioData: number[] }`
**Options:** `{ targetTrackIndex?: number; targetTrackId?: string; isSelected?: boolean; }`

## Edit Events

### EDIT_OBJECT

Edits properties of existing objects.

**Payload:**

```typescript
{
  [itemId: string]: {
    details?: Record<string, any>;
    metadata?: Record<string, any>;
    display?: { from: number; to: number };
    playbackRate?: number;
    animations?: Record<string, any>;
  }
}
```

**Example:**

```typescript
dispatch(EDIT_OBJECT, {
  payload: {
    "item-123": {
      details: {
        text: "Updated text",
        fontSize: 32,
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
```

### REPLACE_MEDIA

Replaces media files in existing items.

**Payload:**

```typescript
{
  itemId: string;
  newSrc: string;
  alt?: string;
}
```

**Example:**

```typescript
dispatch(REPLACE_MEDIA, {
  payload: {
    itemId: "item-123",
    newSrc: "https://example.com/new-image.jpg",
    alt: "New image",
  },
});
```

### EDIT_BACKGROUND_EDITOR

Edits the background of the design.

**Payload:**

```typescript
{
  type: "color" | "image";
  value: string;
}
```

**Example:**

```typescript
dispatch(EDIT_BACKGROUND_EDITOR, {
  payload: {
    type: "color",
    value: "#ffffff",
  },
});
```

## Layer Events

### LAYER_SELECT

Selects layers in the design.

**Payload:**

```typescript
{
  trackItemIds: string[];
}
```

**Example:**

```typescript
dispatch(LAYER_SELECT, {
  payload: {
    trackItemIds: ["item-1", "item-2", "item-3"],
  },
});
```

### LAYER_DELETE

Deletes selected layers.

**Payload:**

```typescript
{
  trackItemIds: string[];
}
```

**Example:**

```typescript
dispatch(LAYER_DELETE, {
  payload: {
    trackItemIds: ["item-1", "item-2"],
  },
});
```

### LAYER_CLONE

Clones selected layers.

**Payload:**

```typescript
{
  trackItemIds: string[];
}
```

**Example:**

```typescript
dispatch(LAYER_CLONE, {
  payload: {
    trackItemIds: ["item-1"],
  },
});
```

## Design Events

### DESIGN_LOAD

Loads a complete design from data.

**Payload:**

```typescript
{
  fps: number;
  tracks: ITrack[];
  size: { width: number; height: number };
  trackItemIds: string[];
  trackItemsMap: Record<string, ITrackItem>;
  transitionIds: string[];
  transitionsMap: Record<string, any>;
}
```

**Example:**

```typescript
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

### DESIGN_RESIZE

Resizes the design canvas.

**Payload:**

```typescript
{
  width: number;
  height: number;
}
```

**Example:**

```typescript
dispatch(DESIGN_RESIZE, {
  payload: {
    width: 1920,
    height: 1080,
  },
});
```

## History Events

### HISTORY_UNDO

Undoes the last action.

**Payload:** None required

**Example:**

```typescript
dispatch(HISTORY_UNDO, {});
```

### HISTORY_REDO

Redoes the last undone action.

**Payload:** None required

**Example:**

```typescript
dispatch(HISTORY_REDO, {});
```

## Timeline Scale Events

### TIMELINE_SCALE_CHANGED

Changes the timeline zoom level.

**Payload:**

```typescript
{
  scale: {
    index: number;
    unit: number;
    zoom: number;
    segments: number;
  }
}
```

**Example:**

```typescript
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

## State Updates

### Basic State Updates

```typescript
// Update state with history tracking
stateManager.updateState(
  { activeIds: ["item1", "item2"] },
  { updateHistory: true, kind: "update" }
);

// Update state without history
stateManager.updateState({ scale: newScale }, { updateHistory: false });
```

### Update Options

```typescript
interface IUpdateStateOptions {
  updateHistory?: boolean; // Whether to track in history
  kind?: IKindHistory; // Type of operation for history
}
```

## Subscriptions

The StateManager provides various subscription methods for reactive updates.

### General State Subscription

```typescript
// Subscribe to all state changes
const subscription = stateManager.subscribe((state) => {
  console.log("State updated:", state);
});

// Unsubscribe
subscription.unsubscribe();
```

### Selective Subscriptions

```typescript
// Subscribe to active item changes
stateManager.subscribeToActiveIds(({ activeIds }) => {
  console.log("Active items:", activeIds);
});

// Subscribe to track changes
stateManager.subscribeToTracks(({ tracks, changedTracks }) => {
  console.log("Tracks updated:", tracks);
  console.log("Changed tracks:", changedTracks);
});

// Subscribe to track item changes
stateManager.subscribeToUpdateTrackItem(({ trackItemsMap }) => {
  console.log("Track items updated:", trackItemsMap);
});

// Subscribe to timing changes
stateManager.subscribeToUpdateTrackItemTiming(
  ({ trackItemsMap, changedTrimIds, changedDisplayIds }) => {
    console.log("Timing updated:", { changedTrimIds, changedDisplayIds });
  }
);

// Subscribe to animation changes
stateManager.subscribeToUpdateAnimations(
  ({ trackItemsMap, changedAnimationIds }) => {
    console.log("Animations updated:", changedAnimationIds);
  }
);

// Subscribe to item detail changes
stateManager.subscribeToUpdateItemDetails(({ trackItemsMap }) => {
  console.log("Item details updated:", trackItemsMap);
});

// Subscribe to scale changes
stateManager.subscribeToScale(({ scale }) => {
  console.log("Scale updated:", scale);
});

// Subscribe to FPS changes
stateManager.subscribeToFps(({ fps }) => {
  console.log("FPS updated:", fps);
});

// Subscribe to duration changes
stateManager.subscribeToDuration(({ duration }) => {
  console.log("Duration updated:", duration);
});

// Subscribe to add/remove operations
stateManager.subscribeToAddOrRemoveItems(({ trackItemIds }) => {
  console.log("Items added/removed:", trackItemIds);
});

// Subscribe to complete state changes
stateManager.subscribeToState(
  ({
    tracks,
    trackItemIds,
    trackItemsMap,
    transitionIds,
    transitionsMap,
    structure,
  }) => {
    console.log("Complete state updated");
  }
);

// Subscribe to design size and background changes
stateManager.subscribeToUpdateStateDetails(({ size, background }) => {
  console.log("Design updated:", { size, background });
});
```

## History Management

The StateManager includes built-in undo/redo functionality.

### History Operations

```typescript
// Undo last operation
stateManager.undo();

// Redo last undone operation
stateManager.redo();

// Subscribe to history state
stateManager.subscribeToHistory((history) => {
  console.log("History state:", history);
});

// Get current history state
const historyState = stateManager.getStateHistory();
```

### History Configuration

```typescript
// Configure history settings
const stateManager = new StateManager(initialState, {
  history: {
    maxSteps: 50, // Maximum number of history steps
    enabled: true, // Enable/disable history tracking
  },
});
```

## State Structure

The state object contains the following main properties:

```typescript
interface State {
  // Design properties
  size: { width: number; height: number };
  fps: number;
  duration: number;

  // Timeline and tracks
  tracks: ITrack[];
  trackItemIds: string[];
  trackItemsMap: Record<string, ITrackItem>;

  // Transitions
  transitionIds: string[];
  transitionsMap: Record<string, any>;

  // Selection and active items
  activeIds: string[];

  // Timeline scale
  scale: {
    index: number;
    unit: number;
    zoom: number;
    segments: number;
  };

  // Background
  background: {
    type: "color" | "image";
    value: string;
  };

  // Structure (for complex compositions)
  structure: any[];
}
```

### Track Structure

```typescript
interface ITrack {
  id: string;
  name: string;
  type: string;
  magnetic?: boolean;
  accepts?: string[];
  visible?: boolean;
  locked?: boolean;
}
```

### Track Item Structure

```typescript
interface ITrackItem {
  id: string;
  type: string;
  display: {
    from: number;
    to: number;
  };
  details: Record<string, any>;
  metadata?: Record<string, any>;
  animations?: Record<string, any>;
  playbackRate?: number;
}

// For video and audio items (trimable elements)
interface ITrimableItem extends ITrackItem {
  trim: {
    from: number;
    to: number;
  };
  isMain: boolean;
}
```

## Event Options

Most events support common options:

### Add Event Options

```typescript
{
  targetTrackIndex?: number;    // Target track index
  targetTrackId?: string;       // Target track ID
  isNewTrack?: boolean;         // Create new track if needed
  isSelected?: boolean;         // Select item after adding
  scaleMode?: string;           // Scaling mode for media
  scaleAspectRatio?: number;    // Aspect ratio for scaling
}
```

### Common Options

- `targetTrackIndex`: Specifies which track to add the item to
- `targetTrackId`: Alternative to trackIndex, uses track ID
- `isNewTrack`: Creates a new track if the target doesn't exist
- `isSelected`: Automatically selects the item after adding
- `scaleMode`: Controls how media items are scaled ("fit", "fill", "stretch")
- `scaleAspectRatio`: Maintains aspect ratio during scaling

## Examples

### Complete Workflow Example

```typescript
  ADD_TEXT,
  ADD_IMAGE,
  LAYER_SELECT,
  EDIT_OBJECT,
  HISTORY_UNDO
} from "@designcombo/state";

// 1. Add text element
dispatch(ADD_TEXT, {
  payload: {
    text: "Welcome to DesignCombo",
    fontSize: 48,
    color: "#ffffff",
    fontFamily: "Arial",
    textAlign: "center"
  },
  options: {
    targetTrackIndex: 0,
    isSelected: true
  }
});

// 2. Add background image
dispatch(ADD_IMAGE, {
  payload: {
    src: "https://example.com/background.jpg",
    alt: "Background"
  },
  options: {
    targetTrackIndex: 1,
    scaleMode: "fill"
  }
});

// 3. Select multiple items
dispatch(LAYER_SELECT, {
  payload: {
    trackItemIds: ["text-1", "image-1"]
  }
});

// 4. Edit text properties
dispatch(EDIT_OBJECT, {
  payload: {
    "text-1": {
      details: {
        fontSize: 64,
        color: "#ff0000"
      }
    }
  }
});

// 5. Undo last action
dispatch(HISTORY_UNDO, {});
```

### Media Management Example

```typescript
// Add video with specific timing
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

// Replace media in existing item
dispatch(REPLACE_MEDIA, {
  payload: {
    itemId: "video-1",
    newSrc: "https://example.com/new-video.mp4",
    alt: "Updated video",
  },
});
```

### Audio Visualization Example

```typescript
// Add audio file
dispatch(ADD_AUDIO, {
  payload: {
    src: "https://example.com/audio.mp3",
    duration: 5000,
  },
  options: {
    targetTrackIndex: 3,
  },
});

// Add audio visualization
dispatch(ADD_RADIAL_AUDIO_BARS, {
  payload: {
    audioData: [0.1, 0.3, 0.5, 0.7, 0.9, 0.8, 0.6, 0.4],
  },
  options: {
    targetTrackIndex: 4,
  },
});
```

## State Operations

## State Persistence

### Export State

```typescript
// Export current state
const exportedState = stateManager.exportState();

// Export state as JSON
const stateJson = JSON.stringify(exportedState);
```

### Import State

```typescript
// Import state from object
stateManager.importState(importedState);

// Import state from JSON
const state = JSON.parse(stateJson);
stateManager.importState(state);
```

## Performance Optimization

### Selective Updates

```typescript
// Only update specific parts of state
stateManager.updateState(
  {
    activeIds: ["item-1"],
    scale: { unit: 300, zoom: 1 / 300, segments: 5, index: 7 },
  },
  { updateHistory: true }
);
```

### Batch Updates

```typescript
// Batch multiple updates
stateManager.batchUpdate(() => {
  stateManager.addTrackItem(item1);
  stateManager.addTrackItem(item2);
  stateManager.updateTrackItemTiming("item-3", timing);
});
```

## Error Handling

```typescript
// Subscribe to errors
stateManager.subscribeToErrors((error) => {
  console.error("State manager error:", error);
});

// Handle specific error types
stateManager.subscribeToErrors((error) => {
  switch (error.type) {
    case "VALIDATION_ERROR":
      console.error("Validation failed:", error.message);
      break;
    case "OPERATION_ERROR":
      console.error("Operation failed:", error.message);
      break;
    default:
      console.error("Unknown error:", error);
  }
});
```

## Important Notes

1. **Event Order**: Events are processed asynchronously, so the order of operations matters
2. **State Updates**: All state updates are handled automatically by the state manager
3. **History**: Most operations are automatically added to the undo/redo history
4. **Validation**: The system validates inputs and handles errors gracefully
5. **Performance**: Bulk operations should be used for multiple related changes
6. **Tracks**: Items are automatically placed on appropriate tracks based on their type
7. **Timing**: All items have timing information (from/to) for timeline positioning

## Error Handling

The system handles various error scenarios:

- Invalid payload data
- Missing required properties
- Network errors for media loading
- Invalid track assignments
- Timeline conflicts

Errors are logged and the system continues to function gracefully.

## Next Steps

- Learn about the [Timeline System](./timeline-system.mdx)
- Understand the [Event System](./event-system.mdx)
- Explore [Track Items](./features/track-items.mdx)
- Check out [Examples](./development/examples.mdx) for practical usage
