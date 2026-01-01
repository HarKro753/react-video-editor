The `@designcombo/timeline` package provides the canvas-based timeline visualization and interaction system for the video editor SDK.

## Timeline Class

### Constructor

```typescript
new Timeline(canvas: HTMLCanvasElement, options: TimelineOptions)
```

Creates a new timeline instance.

**Parameters:**

- `canvas`: HTML canvas element to render the timeline
- `options`: Configuration options for the timeline

### TimelineOptions Interface

```typescript
interface TimelineOptions {
  // Required properties
  width: number;
  height: number;
  scale: ITimelineScaleState;
  duration: number;

  // Optional properties
  bounding?: {
    width: number;
    height: number;
  };
  selectionColor?: string;
  selectionBorderColor?: string;
  onScroll?: (scrollData: ScrollData) => void;
  onResizeCanvas?: (size: Size) => void;
  state?: any;
  spacing?: {
    left: number;
    right: number;
  };
  sizesMap?: Record<string, number>;
  itemTypes?: string[];
  acceptsMap?: Record<string, string[]>;
  guideLineColor?: string;
}
```

### Methods

#### `purge()`

Cleans up resources and event listeners.

```typescript
timeline.purge(): void
```

#### `setViewportPos(posX: number, posY: number)`

Sets the viewport position.

```typescript
timeline.setViewportPos(posX: number, posY: number): void
```

#### `scrollTo(options: ScrollOptions)`

Scrolls to a specific position.

```typescript
interface ScrollOptions {
  scrollLeft?: number;
  scrollTop?: number;
}

timeline.scrollTo(options: ScrollOptions): void
```

#### `registerItems(items: Record<string, typeof TimelineItem>)`

Registers custom timeline items.

```typescript
Timeline.registerItems({
  CustomText: CustomTextItem,
  CustomAudio: CustomAudioItem,
  // ... more items
});
```

## Base Item Classes

### Resizable

Base class for items that can be resized horizontally.

```typescript
class CustomItem extends Resizable {
  static type = "CustomItem";

  constructor(props: ResizableProps) {
    super(props);
  }

  _render(ctx: CanvasRenderingContext2D) {
    super._render(ctx);
    // Custom rendering logic
  }
}
```

**Properties:**

- `width`: Item width
- `duration`: Media duration
- `playbackRate`: Playback speed
- `display`: Display properties

**Methods:**

- `setCoords()`: Updates item coordinates
- `setDimensions(width: number, height: number)`: Sets item dimensions

### Trimmable

Base class for items that can be trimmed (audio/video).

```typescript
class CustomMediaItem extends Trimmable {
  static type = "CustomMediaItem";

  constructor(props: TrimmableProps) {
    super(props);
  }
}
```

**Properties:**

- `trim`: Trim information
- `duration`: Media duration
- `playbackRate`: Playback speed
- `display`: Display properties

**Methods:**

- `setTrim(trim: ITrim)`: Sets trim values
- `getTrimmedDuration()`: Gets trimmed duration

### Control

Base class for interactive controls.

```typescript
const control = new Control({
  x: 0.5,
  y: 0,
  render: (ctx, left, top, styleOverride, fabricObject) => {
    // Custom control rendering
  },
  actionHandler: resize.common,
  cursorStyleHandler: scaleSkewCursorStyleHandler,
  actionName: "resizing",
  sizeX: 20,
  sizeY: 32,
  offsetX: 10,
});
```

**Constructor Options:**

- `x`: Relative X position (-0.5 to 0.5)
- `y`: Relative Y position (-0.5 to 0.5)
- `render`: Custom rendering function
- `actionHandler`: Action handler function
- `cursorStyleHandler`: Cursor style handler
- `actionName`: Action name for events
- `sizeX`: Control width
- `sizeY`: Control height
- `offsetX`: X offset
- `offsetY`: Y offset

### Track

Base class for track containers.

```typescript
class CustomTrack extends TrackBase {
  static type = "CustomTrack";

  constructor(props: TrackItemProps) {
    super(props);
  }
}
```

**Properties:**

- `items`: Array of track items
- `magnetic`: Whether the track accepts dropped items
- `height`: Track height

**Methods:**

- `addItem(item: TimelineItem)`: Adds item to track
- `removeItem(item: TimelineItem)`: Removes item from track
- `getItems()`: Returns all items in track

### Helper

Base class for helper/utility items.

```typescript
class CustomHelper extends HelperBase {
  static type = "CustomHelper";

  constructor(props: HelperProps) {
    super(props);
  }
}
```

## Control System

### Built-in Action Handlers

```typescript
// Common resize handler
resize.common;

// Audio-specific resize handler
resize.audio;

// Media-specific resize handler
resize.media;

// Transition-specific resize handler
resize.transition;
```

### Control Utilities

```typescript
const { scaleSkewCursorStyleHandler } = controlsUtils;
```

### Creating Custom Controls

```typescript
export const createCustomControls = () => ({
  left: new Control({
    x: -0.5,
    y: 0,
    render: drawLeftIcon,
    actionHandler: resize.common,
    cursorStyleHandler: scaleSkewCursorStyleHandler,
    actionName: "resizing",
    sizeX: 20,
    sizeY: 32,
    offsetX: -10,
  }),
  right: new Control({
    x: 0.5,
    y: 0,
    render: drawRightIcon,
    actionHandler: resize.common,
    cursorStyleHandler: scaleSkewCursorStyleHandler,
    actionName: "resizing",
    sizeX: 20,
    sizeY: 32,
    offsetX: 10,
  }),
});
```

## Event Constants

### Timeline Events

```typescript
  TIMELINE_SEEK,
  TIMELINE_PREFIX,
  TIMELINE_BOUNDING_CHANGED,
} from "@designcombo/timeline";

// Timeline seek event
TIMELINE_SEEK;

// Timeline event prefix
TIMELINE_PREFIX;

// Timeline bounding changed event
TIMELINE_BOUNDING_CHANGED;
```

### Drag and Drop Events

```typescript
// Drag start event
DRAG_START;

// Drag end event
DRAG_END;

// Drag event prefix
DRAG_PREFIX;
```

## Utility Functions

### Time Conversion

```typescript
// Convert milliseconds to timeline units
function timeMsToUnits(timeMs: number, zoom: number = 1): number;

// Convert timeline units to milliseconds
function unitsToTimeMs(units: number, zoom: number = 1): number;
```

**Parameters:**

- `timeMs`: Time in milliseconds
- `zoom`: Zoom level (default: 1)

**Returns:**

- Timeline units or milliseconds

## Type Definitions

### ITimelineScaleState

```typescript
interface ITimelineScaleState {
  zoom: number;
  offset: number;
}
```

### ScrollData

```typescript
interface ScrollData {
  scrollTop: number;
  scrollLeft: number;
}
```

### TimelineObject

```typescript
interface TimelineObject {
  id: string;
  type: string;
  left: number;
  top: number;
  width: number;
  height: number;
  // ... other properties
}
```

### ResizableProps

```typescript
interface ResizableProps {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  rx?: number;
  ry?: number;
  // ... other properties
}
```

### TrimmableProps

```typescript
interface TrimmableProps extends ResizableProps {
  trim: ITrim;
  duration: number;
  playbackRate?: number;
  display: IDisplay;
}
```
