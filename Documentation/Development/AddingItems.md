The designcombo editor provides multiple ways to add items to the scene:

1. **Direct Dispatch**: Using specific ADD actions like `ADD_TEXT`, `ADD_VIDEO`, etc.
2. **Generic ADD_ITEMS**: Using the more flexible `ADD_ITEMS` action for complex scenarios
3. **Drag and Drop**: Interactive addition through drag and drop operations
4. **Programmatic Addition**: Adding items through code with custom logic

## Basic Pattern

### Import Required Dependencies

```typescript
  ADD_TEXT,
  ADD_VIDEO,
  ADD_IMAGE,
  ADD_AUDIO,
  ADD_ITEMS,
  ADD_CAPTIONS,
  ADD_LINEAL_AUDIO_BARS,
  ADD_RADIAL_AUDIO_BARS,
  ADD_WAVE_AUDIO_BARS,
  ADD_HILL_AUDIO_BARS,
} from "@designcombo/state";
```

### Basic Usage

```typescript
// Add a simple text item
dispatch(ADD_TEXT, {
  payload: {
    id: generateId(),
    type: "text",
    display: { from: 0, to: 5000 },
    details: {
      text: "Hello World",
      fontSize: 24,
      color: "#ffffff",
    },
  },
  options: {},
});
```

## Item Types

### 1. Text Items

- **Type**: `"text"`
- **Base Class**: `Resizable`
- **Properties**: Text content, font, styling, positioning

### 2. Video Items

- **Type**: `"video"`
- **Base Class**: `Trimmable`
- **Properties**: Source URL, duration, aspect ratio, trim settings

### 3. Image Items

- **Type**: `"image"`
- **Base Class**: `Resizable`
- **Properties**: Source URL, dimensions, positioning

### 4. Audio Items

- **Type**: `"audio"`
- **Base Class**: `Trimmable`
- **Properties**: Source URL, duration, volume, trim settings

### 5. Caption Items

- **Type**: `"caption"`
- **Base Class**: `Resizable`
- **Properties**: Text, timing, colors, animations

### 6. Visualizer Items

- **Types**: `"linealAudioBars"`, `"radialAudioBars"`, `"waveAudioBars"`, `"hillAudioBars"`
- **Base Class**: `Resizable`
- **Properties**: Visual effects, colors, dimensions

### 7. Transition Items

- **Type**: `"transition"`
- **Base Class**: `Helper`
- **Properties**: Transition effects, timing, parameters

## Adding Methods

### 1. Direct ADD Actions

#### ADD_TEXT

```typescript
dispatch(ADD_TEXT, {
  payload: {
    id: generateId(),
    type: "text",
    display: { from: 0, to: 5000 },
    details: {
      text: "Sample Text",
      fontSize: 64,
      fontFamily: "Arial",
      color: "#ffffff",
      width: 400,
      height: 100,
    },
  },
  options: {},
});
```

#### ADD_VIDEO

```typescript
dispatch(ADD_VIDEO, {
  payload: {
    id: generateId(),
    type: "video",
    display: { from: 0, to: 10000 },
    details: {
      src: "https://example.com/video.mp4",
      duration: 10000,
      aspectRatio: 16 / 9,
    },
    metadata: {
      previewUrl: "https://example.com/thumbnail.jpg",
    },
  },
  options: {
    resourceId: "main",
    scaleMode: "fit",
  },
});
```

#### ADD_IMAGE

```typescript
dispatch(ADD_IMAGE, {
  payload: {
    id: generateId(),
    type: "image",
    display: { from: 0, to: 5000 },
    details: {
      src: "https://example.com/image.jpg",
    },
    metadata: {},
  },
  options: {},
});
```

#### ADD_AUDIO

```typescript
dispatch(ADD_AUDIO, {
  payload: {
    id: generateId(),
    type: "audio",
    display: { from: 0, to: 8000 },
    details: {
      src: "https://example.com/audio.mp3",
      duration: 8000,
      volume: 100,
    },
    metadata: {},
  },
  options: {},
});
```

### 2. Generic ADD_ITEMS

For more complex scenarios or when adding multiple items:

```typescript
dispatch(ADD_ITEMS, {
  payload: {
    trackItems: [
      {
        id: generateId(),
        type: "text",
        display: { from: 0, to: 5000 },
        details: {
          text: "First Text",
          fontSize: 48,
          color: "#ff0000",
        },
        metadata: {},
      },
      {
        id: generateId(),
        type: "image",
        display: { from: 2000, to: 7000 },
        details: {
          src: "https://example.com/image.jpg",
        },
        metadata: {},
      },
    ],
    tracks: [
      {
        id: generateId(),
        items: ["text-id-1", "image-id-2"],
        type: "main",
      },
    ],
  },
});
```

## Payload Structures

### Common Properties

All timeline items share these common properties:

```typescript
interface BaseTimelineItem {
  id: string; // Unique identifier
  type: string; // Item type
  display: {
    // Timeline positioning
    from: number; // Start time in milliseconds
    to: number; // End time in milliseconds
  };
  details: Record<string, any>; // Type-specific properties
  metadata?: Record<string, any>; // Additional data
}
```

### Text Item Details

```typescript
interface TextDetails {
  text: string; // Text content
  fontSize: number; // Font size in pixels
  fontFamily: string; // Font family name
  fontUrl?: string; // Custom font URL
  color: string; // Text color (hex)
  width: number; // Text width
  height: number; // Text height
  textAlign?: "left" | "center" | "right";
  wordWrap?: "break-word" | "normal";
  borderWidth?: number; // Border width
  borderColor?: string; // Border color
  boxShadow?: {
    // Shadow properties
    color: string;
    x: number;
    y: number;
    blur: number;
  };
  opacity?: number; // Transparency (0-1)
}
```

### Video Item Details

```typescript
interface VideoDetails {
  src: string; // Video source URL
  duration: number; // Duration in milliseconds
  aspectRatio: number; // Width/height ratio
  trim?: {
    // Trim settings
    start: number; // Start time
    end: number; // End time
  };
  volume?: number; // Volume (0-100)
  playbackRate?: number; // Playback speed
  flipX?: boolean; // Horizontal flip
  flipY?: boolean; // Vertical flip
  crop?: {
    // Crop settings
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
```

### Audio Item Details

```typescript
interface AudioDetails {
  src: string; // Audio source URL
  duration: number; // Duration in milliseconds
  volume: number; // Volume (0-100)
  playbackRate?: number; // Playback speed
  trim?: {
    // Trim settings
    start: number;
    end: number;
  };
  waveformData?: number[]; // Waveform visualization data
}
```

### Image Item Details

```typescript
interface ImageDetails {
  src: string; // Image source URL
  width?: number; // Image width
  height?: number; // Image height
  opacity?: number; // Transparency (0-1)
  flipX?: boolean; // Horizontal flip
  flipY?: boolean; // Vertical flip
  crop?: {
    // Crop settings
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
```
