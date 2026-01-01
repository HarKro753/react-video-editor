This guide will help you get started with the DesignCombo Video Editor SDK.

## Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm package manager
- React 18+ (for React integration)

## Install Packages

```bash
# Using npm
npm install @designcombo/state @designcombo/timeline @designcombo/types

# Using yarn
yarn add @designcombo/state @designcombo/timeline @designcombo/types

# Using pnpm
pnpm add @designcombo/state @designcombo/timeline @designcombo/types
```

## Peer Dependencies

The SDK requires these peer dependencies:

```json
{
  "peerDependencies": {
    "@designcombo/events": "^1.0.2"
  }
}
```

## Basic Setup

```typescript
function VideoEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateManagerRef = useRef<StateManager>();
  const timelineRef = useRef<Timeline>();

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize state manager
    stateManagerRef.current = new StateManager({
      size: { width: 1920, height: 1080 },
      fps: 30,
    });

    // Initialize timeline
    timelineRef.current = new Timeline(canvasRef.current, {
      scale: { unit: 300, zoom: 1 / 300, segments: 5, index: 7 },
      duration: 10000,
      state: stateManagerRef.current,
      itemTypes: ["text", "video", "audio", "image"],
      acceptsMap: {
        main: ["video", "image"],
        text: ["text", "caption"],
        audio: ["audio"],
      },
    });

    // Cleanup
    return () => {
      timelineRef.current?.purge();
      stateManagerRef.current?.purge();
    };
  }, []);

  const addText = () => {
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
  };

  return (
    <div>
      <button onClick={addText}>Add Text</button>
      <canvas ref={canvasRef} width={1200} height={400} />
    </div>
  );
}

export default VideoEditor;
```

## React Integration

```typescript
// Custom hook for video editor
function useVideoEditor() {
  const stateManagerRef = useRef<StateManager>();
  const timelineRef = useRef<Timeline>();

  const initializeEditor = (canvas: HTMLCanvasElement) => {
    // Initialize state manager
    stateManagerRef.current = new StateManager(
      {
        size: { width: 1920, height: 1080 },
        fps: 30,
      },
      {
        cors: {
          audio: true,
          video: true,
          image: true,
        },
        acceptsMap: {
          main: ["video", "image"],
          text: ["text", "caption"],
          audio: ["audio"],
        },
      }
    );

    // Initialize timeline
    timelineRef.current = new Timeline(canvas, {
      scale: { unit: 300, zoom: 1 / 300, segments: 5, index: 7 },
      duration: 10000,
      state: stateManagerRef.current,
      itemTypes: ["text", "video", "audio", "image"],
      acceptsMap: {
        main: ["video", "image"],
        text: ["text", "caption"],
        audio: ["audio"],
      },
    });

    return {
      stateManager: stateManagerRef.current,
      timeline: timelineRef.current,
    };
  };

  const cleanup = () => {
    timelineRef.current?.purge();
    stateManagerRef.current?.purge();
  };

  return { initializeEditor, cleanup };
}

// Video Editor Component
function VideoEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { initializeEditor, cleanup } = useVideoEditor();

  useEffect(() => {
    if (!canvasRef.current) return;

    const { stateManager } = initializeEditor(canvasRef.current);

    // Subscribe to state changes
    const subscription = stateManager.subscribeToActiveIds(({ activeIds }) => {
      console.log("Active items:", activeIds);
    });

    return () => {
      subscription.unsubscribe();
      cleanup();
    };
  }, [initializeEditor, cleanup]);

  const addText = () => {
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
  };

  return (
    <div>
      <button onClick={addText}>Add Text</button>
      <canvas ref={canvasRef} width={1200} height={400} />
    </div>
  );
}

export default VideoEditor;
```

## Configuration Options

### State Manager Configuration

```typescript
const stateManager = new StateManager(
  {
    size: { width: 1920, height: 1080 },
    fps: 30,
  },
  {
    cors: {
      audio: true,
      video: true,
      image: true,
    },
    acceptsMap: {
      main: ["video", "image"],
      text: ["text", "caption"],
      audio: ["audio"],
    },
  }
);
```

### Timeline Configuration

```typescript
const timeline = new Timeline(canvas, {
  scale: { unit: 300, zoom: 1 / 300, segments: 5, index: 7 },
  duration: 10000,
  state: stateManager,
  itemTypes: ["text", "video", "audio", "image"],
  acceptsMap: {
    main: ["video", "image"],
    text: ["text", "caption"],
    audio: ["audio"],
  },
});
```

## Next Steps

- Read the [Quick Start Guide](./quick-start.mdx) for your first video editor
- Explore [Core Concepts](./core-concepts/architecture.mdx) to understand the architecture
- Check out [Examples](./development/examples.mdx) for more use cases
