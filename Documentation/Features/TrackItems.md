Track items are the fundamental building blocks of the DesignCombo Video Editor SDK. They represent individual media elements that can be added to the timeline and manipulated.

## Item Types

The SDK supports various types of track items, each with specific properties and behaviors. Items can be categorized into two main groups:

### Trimable Elements

Video and audio items support trimming, allowing you to control which portion of the media is played:

- **Video Items**: Support `trim` and `display` properties
- **Audio Items**: Support `trim` and `display` properties

### Non-Trimable Elements

Other item types only support display timing:

- **Text Items**: Only `display` property
- **Image Items**: Only `display` property
- **Shape Items**: Only `display` property
- **Caption Items**: Only `display` property

### Text Items

Text items display text content with rich formatting options.

```typescript
// Add text item
dispatch("add:text", {
  payload: {
    name: "My Text",
    duration: 5000, // Duration of 5 seconds
    details: {
      text: "Hello World",
      fontSize: 48,
      fontFamily: "Arial",
      color: "#ffffff",
      x: 100,
      y: 100,
      width: 300,
      height: 100,
      textAlign: "center",
      fontWeight: "bold",
      fontStyle: "normal",
      textDecoration: "none",
      lineHeight: 1.2,
      letterSpacing: 0,
      backgroundColor: "transparent",
      borderColor: "transparent",
      borderWidth: 0,
      borderRadius: 0,
      shadow: {
        color: "rgba(0,0,0,0.5)",
        blur: 5,
        offsetX: 2,
        offsetY: 2,
      },
    },
    display: {
      from: 0, // Display from start
      to: 5000, // Display for 5 seconds
    },
  },
});
```

### Image Items

Image items display static images with transformation options.

```typescript
// Add image item
dispatch("add:image", {
  payload: {
    name: "My Image",
    duration: 8000, // Duration of 8 seconds
    details: {
      src: "https://example.com/image.jpg",
      x: 0,
      y: 0,
      width: 400,
      height: 300,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      opacity: 1,
      borderRadius: 0,
      borderColor: "transparent",
      borderWidth: 0,
      shadow: {
        color: "rgba(0,0,0,0.5)",
        blur: 5,
        offsetX: 2,
        offsetY: 2,
      },
    },
    display: {
      from: 2000, // Start displaying at 2 seconds
      to: 10000, // Stop displaying at 10 seconds
    },
  },
});
```

### Video Items

Video items display video content with playback controls and trimming capabilities.

```typescript
// Add video item
dispatch("add:video", {
  payload: {
    id: "UMrEjv1EJCYbo7dB",
    name: "My Video",
    type: "video",
    details: {
      src: "https://videos.pexels.com/video-files/857251/857251-sd_540_360_25fps.mp4",
      width: 540,
      height: 360,
      opacity: 100,
      volume: 100,
      borderRadius: 0,
      borderWidth: 0,
      borderColor: "#000000",
      boxShadow: {
        color: "#000000",
        x: 0,
        y: 0,
        blur: 0,
      },
      top: "780px",
      left: "270px",
      transform: "scale(2)",
      blur: 0,
      brightness: 100,
      flipX: false,
      flipY: false,
      rotate: "0deg",
      visibility: "visible",
    },
    metadata: {
      previewUrl:
        "https://images.pexels.com/videos/857251/pictures/preview-0.jpg",
    },
    trim: {
      from: 4651.276595744681, // Trim start in milliseconds
      to: 10236.3829787234, // Trim end in milliseconds
    },
    display: {
      from: 5794.893617021277, // Display start time in milliseconds
      to: 11380, // Display end time in milliseconds
    },
    duration: 13880, // Total duration in milliseconds
    playbackRate: 1,
    isMain: false,
  },
});
```

### Audio Items

Audio items provide audio content with volume, timing controls, and trimming capabilities.

```typescript
// Add audio item
dispatch("add:audio", {
  payload: {
    id: "audio-item-id",
    name: "Background Music",
    type: "audio",
    details: {
      src: "https://example.com/audio.mp3",
      volume: 0.8,
      muted: false,
      loop: false,
      playbackRate: 1,
      fadeIn: 0,
      fadeOut: 0,
    },
    trim: {
      from: 1000, // Trim start in milliseconds
      to: 9000, // Trim end in milliseconds
    },
    display: {
      from: 2000, // Display start time in milliseconds
      to: 10000, // Display end time in milliseconds
    },
    duration: 10000, // Total duration in milliseconds
    isMain: false,
  },
});
```

### Shape Items

Shape items display geometric shapes and illustrations.

```typescript
// Add rectangle
dispatch("add:rect", {
  payload: {
    name: "My Rectangle",
    duration: 6000, // Duration of 6 seconds
    details: {
      x: 100,
      y: 100,
      width: 200,
      height: 150,
      fill: "#ff0000",
      stroke: "#000000",
      strokeWidth: 2,
      borderRadius: 10,
      opacity: 1,
      rotation: 0,
    },
    display: {
      from: 1000, // Start displaying at 1 second
      to: 7000, // Stop displaying at 7 seconds
    },
  },
});

// Add circle
dispatch("add:circle", {
  payload: {
    name: "My Circle",
    duration: 4000, // Duration of 4 seconds
    details: {
      x: 200,
      y: 200,
      radius: 50,
      fill: "#00ff00",
      stroke: "#000000",
      strokeWidth: 2,
      opacity: 1,
    },
    display: {
      from: 3000, // Start displaying at 3 seconds
      to: 7000, // Stop displaying at 7 seconds
    },
  },
});
```

### Caption Items

Caption items display timed text with word-level timing.

```typescript
// Add caption item
dispatch("add:caption", {
  payload: {
    name: "My Caption",
    duration: 2000, // Duration of 2 seconds
    details: {
      text: "Hello World",
      fontSize: 24,
      fontFamily: "Arial",
      color: "#ffffff",
      backgroundColor: "rgba(0,0,0,0.8)",
      x: 50,
      y: 50,
      width: 300,
      height: 60,
      textAlign: "center",
      wordTiming: [
        { word: "Hello", start: 0, end: 500 },
        { word: "World", start: 500, end: 1000 },
      ],
    },
    display: {
      from: 5000, // Start displaying at 5 seconds
      to: 7000, // Stop displaying at 7 seconds
    },
  },
});
```

## Item Properties

### Display vs Trim Properties

For video and audio items (trimable elements), there are two important timing concepts:

#### Display Timing

The `display` property controls when an item appears in the timeline:

- `display.from`: When the item starts displaying (in milliseconds)
- `display.to`: When the item stops displaying (in milliseconds)

#### Trim Timing

The `trim` property controls which portion of the media is played:

- `trim.from`: Start point of the media content (in milliseconds)
- `trim.to`: End point of the media content (in milliseconds)

```typescript
// Example: Video that appears at 2 seconds, plays content from 1-9 seconds
const videoItem = {
  trim: {
    from: 1000, // Play content starting at 1 second
    to: 9000, // Play content until 9 seconds
  },
  display: {
    from: 2000, // Show in timeline starting at 2 seconds
    to: 8000, // Show in timeline until 8 seconds
  },
};
```

### Common Properties

All track items share these common properties:

```typescript
interface ITrackItemBase {
  id: string; // Unique identifier
  type: ITrackItemType; // Item type
  name: string; // Display name
  duration: number; // Total duration in milliseconds
  trackId?: string; // Parent track ID (optional)
  details: any; // Type-specific details
  metadata?: {
    // Optional metadata
    description?: string;
    tags?: string[];
    custom?: any;
  };
  animations?: IAnimation[]; // Animation data
  transitions?: ITransition[]; // Transition data
}

// For video and audio items (trimable elements)
interface ITrimableItem extends ITrackItemBase {
  trim: {
    from: number; // Trim start in milliseconds
    to: number; // Trim end in milliseconds
  };
  display: {
    from: number; // Display start time in milliseconds
    to: number; // Display end time in milliseconds
  };
  playbackRate: number; // Playback speed multiplier
  isMain: boolean; // Whether this is the main item
}
```

### Timing Properties

```typescript
// Set item display timing (when item appears in timeline)
dispatch("update:display", {
  payload: {
    id: "item-id",
    display: {
      from: 2000, // Display starts at 2 seconds
      to: 7000, // Display ends at 7 seconds
    },
  },
});

// Trim video/audio item (for trimable elements)
dispatch("update:trim", {
  payload: {
    id: "item-id",
    trim: {
      from: 1000, // Trim 1 second from start
      to: 9000, // Trim 1 second from end
    },
  },
});

// Update item duration
dispatch("update:duration", {
  payload: {
    id: "item-id",
    duration: 5000, // Set duration to 5 seconds
  },
});
```

### Position Properties

```typescript
// Update item position
dispatch("update:position", {
  payload: {
    id: "item-id",
    x: 150,
    y: 200,
  },
});

// Update item size
dispatch("update:size", {
  payload: {
    id: "item-id",
    width: 500,
    height: 400,
  },
});

// Update item transform
dispatch("update:transform", {
  payload: {
    id: "item-id",
    scaleX: 1.5,
    scaleY: 1.5,
    rotation: 45,
    opacity: 0.8,
  },
});
```

## Item Operations

### Working with Trimable Elements

Video and audio items support trimming, which allows you to control which portion of the media is played:

```typescript
// Create a video with trimming
const videoItem = {
  id: "video-1",
  name: "Trimmed Video",
  type: "video",
  details: {
    src: "https://example.com/video.mp4",
    width: 400,
    height: 300,
  },
  trim: {
    from: 2000, // Start playing from 2 seconds into the video
    to: 8000, // Stop playing at 8 seconds into the video
  },
  display: {
    from: 0, // Show in timeline from the beginning
    to: 6000, // Show in timeline for 6 seconds
  },
  duration: 10000, // Total video duration
  playbackRate: 1,
  isMain: false,
};

// Create an audio item with trimming
const audioItem = {
  id: "audio-1",
  name: "Background Music",
  type: "audio",
  details: {
    src: "https://example.com/music.mp3",
    volume: 0.8,
  },
  trim: {
    from: 5000, // Start playing from 5 seconds into the audio
    to: 15000, // Stop playing at 15 seconds into the audio
  },
  display: {
    from: 1000, // Start displaying at 1 second in timeline
    to: 11000, // Stop displaying at 11 seconds in timeline
  },
  duration: 20000, // Total audio duration
  playbackRate: 1,
  isMain: false,
};
```

### Adding Items

```typescript
// Add text item with display timing
dispatch("add:text", {
  payload: {
    name: "Timed Text",
    duration: 4000, // Duration of 4 seconds
    details: {
      text: "Appears at 3 seconds",
      fontSize: 48,
      color: "#ffffff",
    },
    display: {
      from: 3000, // Display starts at 3 seconds
      to: 7000, // Display ends at 7 seconds
    },
  },
});

// Add video item with trim and display timing
dispatch("add:video", {
  payload: {
    name: "My Video",
    duration: 10000, // Total duration
    details: {
      src: "https://example.com/video.mp4",
      width: 400,
      height: 300,
    },
    trim: {
      from: 1000, // Trim 1 second from start
      to: 9000, // Trim 1 second from end
    },
    display: {
      from: 2000, // Display starts at 2 seconds
      to: 8000, // Display ends at 8 seconds
    },
    playbackRate: 1,
    isMain: false,
  },
});

// Add item to specific track
dispatch("add:image", {
  payload: {
    name: "Track Image",
    trackId: "track-2", // Add to specific track
    duration: 10000,
    details: {
      src: "https://example.com/image.jpg",
      width: 400,
      height: 300,
    },
    display: {
      from: 0, // Display from start
      to: 10000, // Display until end
    },
  },
});

// Add trimmed video with specific display timing
dispatch("add:video", {
  payload: {
    name: "Promo Video",
    duration: 15000, // 15 second total duration
    details: {
      src: "https://example.com/promo.mp4",
      width: 500,
      height: 300,
    },
    trim: {
      from: 3000, // Start playing from 3 seconds into video
      to: 12000, // Stop playing at 12 seconds into video
    },
    display: {
      from: 5000, // Start showing at 5 seconds in timeline
      to: 14000, // Stop showing at 14 seconds in timeline
    },
    playbackRate: 1,
    isMain: false,
  },
});
```

### Updating Items

```typescript
// Update item details
dispatch("update:details", {
  payload: {
    id: "item-id",
    details: {
      text: "Updated text content",
      fontSize: 64,
      color: "#ff0000",
    },
  },
});

// Update item name
dispatch("update:name", {
  payload: {
    id: "item-id",
    name: "New Name",
  },
});

// Update item metadata
dispatch("update:metadata", {
  payload: {
    id: "item-id",
    metadata: {
      description: "Updated description",
      tags: ["updated", "tag"],
    },
  },
});
```

### Removing Items

```typescript
// Remove single item
dispatch("remove:item", {
  payload: {
    id: "item-id",
  },
});

// Remove multiple items
dispatch("remove:items", {
  payload: {
    ids: ["item-1", "item-2", "item-3"],
  },
});

// Remove items by type
dispatch("remove:by-type", {
  payload: {
    type: "text",
  },
});
```

### Duplicating Items

```typescript
// Duplicate item
dispatch("duplicate:item", {
  payload: {
    id: "item-id",
    name: "Copy of Item", // New name
  },
});

// Duplicate multiple items
dispatch("duplicate:items", {
  payload: {
    ids: ["item-1", "item-2"],
    namePrefix: "Copy of ",
  },
});
```

## Item Selection

### Selecting Items

```typescript
// Select single item
dispatch("select:item", {
  payload: {
    id: "item-id",
  },
});

// Select multiple items
dispatch("select:items", {
  payload: {
    ids: ["item-1", "item-2", "item-3"],
  },
});

// Select items by type
dispatch("select:by-type", {
  payload: {
    type: "text",
  },
});

// Select all items
dispatch("select:all");
```

### Selection Operations

```typescript
// Clear selection
dispatch("clear:selection");

// Invert selection
dispatch("invert:selection");

// Select next item
dispatch("select:next");

// Select previous item
dispatch("select:previous");

// Get selected items
const selectedItems = stateManager.getSelectedItems();
```

## Item Grouping

### Group Operations

```typescript
// Create group
dispatch("group:items", {
  payload: {
    ids: ["item-1", "item-2", "item-3"],
    name: "My Group",
  },
});

// Ungroup items
dispatch("ungroup:items", {
  payload: {
    groupId: "group-id",
  },
});

// Add item to group
dispatch("add:to-group", {
  payload: {
    itemId: "item-id",
    groupId: "group-id",
  },
});

// Remove item from group
dispatch("remove:from-group", {
  payload: {
    itemId: "item-id",
    groupId: "group-id",
  },
});
```

## Item Constraints

### Track Constraints

```typescript
// Set track acceptance rules
const trackConfig = {
  id: "track-1",
  type: "text",
  accepts: ["text", "caption"], // Only accept text items
  magnetic: true, // Snap to other tracks
  static: false, // Allow movement
};

// Validate item placement
const isValid = timeline.validateItemPlacement(item, track);
```

### Timing Constraints

```typescript
// Set minimum duration
const minDuration = 1000; // 1 second minimum

// Set maximum duration
const maxDuration = 30000; // 30 seconds maximum

// Validate display timing
const isValidDisplay = timeline.validateDisplayTiming(item, {
  minDuration,
  maxDuration,
});

// Validate trim timing (for video/audio items)
const isValidTrim = timeline.validateTrimTiming(item, {
  minDuration,
  maxDuration,
});

// Check if trim values are within media duration
const isValidTrimRange = timeline.validateTrimRange(item, {
  maxTrimFrom: item.duration,
  maxTrimTo: item.duration,
});
```

## Item Rendering

### Custom Rendering

```typescript
// Custom text renderer
timeline.setItemRenderer("text", (item, canvas, time) => {
  const ctx = canvas.getContext("2d");
  const { text, fontSize, color, x, y } = item.details;

  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
});

// Custom image renderer
timeline.setItemRenderer("image", (item, canvas, time) => {
  const { src, x, y, width, height } = item.details;
  const img = new Image();

  img.onload = () => {
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, x, y, width, height);
  };

  img.src = src;
});
```

### Rendering Hooks

```typescript
// Before render hook
timeline.onBeforeRender((item, canvas, time) => {
  // Pre-processing before rendering
  console.log("Rendering item:", item.name);
});

// After render hook
timeline.onAfterRender((item, canvas, time) => {
  // Post-processing after rendering
  console.log("Rendered item:", item.name);
});
```

## Item Performance

### Optimization Techniques

```typescript
// Enable item caching
timeline.enableItemCaching({
  enabled: true,
  maxCacheSize: 100,
  cacheTimeout: 5000,
});

// Lazy load items
timeline.enableLazyLoading({
  enabled: true,
  threshold: 100,
  batchSize: 10,
});

// Optimize rendering
timeline.setRenderOptimizations({
  useRequestAnimationFrame: true,
  debounceUpdates: true,
  updateInterval: 16, // 60fps
});
```

## Next Steps

- Learn about [Animations](./animations.mdx)
- Understand [Transitions](./transitions.mdx)
- Explore the [API Reference](./development/api-reference.mdx)
- Check out [Examples](./development/examples.mdx) for practical usage
