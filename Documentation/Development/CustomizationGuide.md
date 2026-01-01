Learn how to extend and customize the DesignCombo Video Editor SDK to fit your specific needs.

## Custom Item Types

### Creating Custom Items

```typescript
// Define custom item type
interface CustomItemDetails {
  customProperty: string;
  customValue: number;
  // ... other custom properties
}

// Register custom item type
timeline.registerItemType("custom", {
  // Default properties
  defaults: {
    name: "Custom Item",
    duration: 5000,
    details: {
      customProperty: "default",
      customValue: 0,
    },
  },

  // Validation function
  validate: (details: CustomItemDetails) => {
    if (!details.customProperty) {
      throw new Error("Custom property is required");
    }
    return true;
  },

  // Rendering function
  render: (item: ITrackItem, canvas: HTMLCanvasElement, time: number) => {
    const ctx = canvas.getContext("2d");
    const { customProperty, customValue } = item.details as CustomItemDetails;

    // Custom rendering logic
    ctx.fillStyle = `hsl(${customValue}, 50%, 50%)`;
    ctx.fillRect(item.x, item.y, item.width, item.height);

    ctx.fillStyle = "#ffffff";
    ctx.font = "16px Arial";
    ctx.fillText(customProperty, item.x + 10, item.y + 20);
  },

  // Properties panel configuration
  properties: [
    {
      name: "customProperty",
      type: "text",
      label: "Custom Property",
      defaultValue: "default",
    },
    {
      name: "customValue",
      type: "number",
      label: "Custom Value",
      min: 0,
      max: 360,
      defaultValue: 0,
    },
  ],
});

// Use custom item type
dispatch("add:custom", {
  payload: {
    name: "My Custom Item",
    details: {
      customProperty: "Hello World",
      customValue: 180,
    },
  },
});
```

### Custom Item Interactions

```typescript
// Register custom interaction handler
timeline.registerInteractionHandler("custom", {
  onMouseDown: (item: ITrackItem, event: MouseEvent) => {
    console.log("Custom item clicked:", item.id);
    // Custom interaction logic
  },

  onMouseMove: (item: ITrackItem, event: MouseEvent) => {
    // Custom mouse move logic
  },

  onMouseUp: (item: ITrackItem, event: MouseEvent) => {
    // Custom mouse up logic
  },

  onKeyDown: (item: ITrackItem, event: KeyboardEvent) => {
    // Custom keyboard interaction
  },
});
```

## Custom Animations

### Creating Custom Animation Types

```typescript
// Define custom animation
interface CustomAnimation extends IAnimation {
  customProperty: string;
  customEasing: (t: number) => number;
}

// Register custom animation type
timeline.registerAnimationType("custom", {
  // Animation function
  animate: (animation: CustomAnimation, progress: number) => {
    const { startValue, endValue, customEasing } = animation;
    const easedProgress = customEasing(progress);

    // Custom animation logic
    return startValue + (endValue - startValue) * easedProgress;
  },

  // Validation
  validate: (animation: CustomAnimation) => {
    if (!animation.customProperty) {
      throw new Error("Custom property is required");
    }
    return true;
  },

  // Default properties
  defaults: {
    duration: 1000,
    easing: "easeInOut",
    customProperty: "default",
  },
});

// Use custom animation
dispatch("add:animation", {
  payload: {
    itemId: "item-id",
    animation: {
      type: "custom",
      property: "customValue",
      startValue: 0,
      endValue: 100,
      customProperty: "special",
      customEasing: (t) => t * t * (3 - 2 * t),
    },
  },
});
```

### Custom Easing Functions

```typescript
// Register custom easing function
timeline.registerEasing("customBounce", (t: number) => {
  if (t < 1 / 2.75) {
    return 7.5625 * t * t;
  } else if (t < 2 / 2.75) {
    return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
  } else if (t < 2.5 / 2.75) {
    return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
  } else {
    return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
  }
});

// Use custom easing
dispatch("add:animation", {
  payload: {
    itemId: "item-id",
    animation: {
      type: "position",
      property: "y",
      startValue: 0,
      endValue: 200,
      easing: "customBounce",
    },
  },
});
```

## Custom Transitions

### Creating Custom Transitions

```typescript
// Register custom transition
timeline.registerTransition("custom", {
  // Transition rendering function
  render: (
    fromItem: ITrackItem,
    toItem: ITrackItem,
    progress: number,
    canvas: HTMLCanvasElement
  ) => {
    const ctx = canvas.getContext("2d");

    // Custom transition logic
    const wave = Math.sin(progress * Math.PI * 4) * 20;

    // Render from item with fade out
    ctx.globalAlpha = 1 - progress;
    renderItem(fromItem, ctx);

    // Render to item with wave effect
    ctx.globalAlpha = progress;
    ctx.save();
    ctx.translate(wave, 0);
    renderItem(toItem, ctx);
    ctx.restore();
  },

  // Default properties
  defaults: {
    duration: 1500,
    easing: "easeInOut",
  },

  // Validation
  validate: (transition: ITransition) => {
    // Custom validation logic
    return true;
  },
});

// Use custom transition
dispatch("add:transition", {
  payload: {
    type: "custom",
    fromItemId: "item-1",
    toItemId: "item-2",
    duration: 2000,
  },
});
```

## Custom UI Components

### Creating Custom Controls

```typescript
// Custom control component
function CustomControl({ item, onUpdate }) {
  const [value, setValue] = useState(item.details.customValue);

  const handleChange = (newValue) => {
    setValue(newValue);
    onUpdate({
      ...item.details,
      customValue: newValue,
    });
  };

  return (
    <div className="custom-control">
      <label>Custom Value:</label>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => handleChange(parseInt(e.target.value))}
      />
      <span>{value}</span>
    </div>
  );
}

// Register custom control
timeline.registerControl("custom", CustomControl);
```

### Custom Timeline Controls

```typescript
// Custom timeline control
function CustomTimelineControl({ timeline }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    if (isPlaying) {
      timeline.pause();
    } else {
      timeline.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="custom-timeline-controls">
      <button onClick={handlePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
      <button onClick={() => timeline.stop()}>Stop</button>
    </div>
  );
}
```

## Custom Rendering

### Custom Canvas Renderer

```typescript
// Custom canvas renderer
class CustomRenderer {
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
  }

  // Custom rendering method
  renderItem(item: ITrackItem, time: number) {
    const { x, y, width, height } = item;

    // Custom rendering logic
    this.ctx.save();

    // Apply custom effects
    this.applyCustomEffects(item, time);

    // Render item
    this.renderItemContent(item);

    this.ctx.restore();
  }

  applyCustomEffects(item: ITrackItem, time: number) {
    // Custom visual effects
    const glow = Math.sin(time * 0.001) * 0.5 + 0.5;
    this.ctx.shadowColor = `rgba(255, 255, 255, ${glow})`;
    this.ctx.shadowBlur = 20;
  }

  renderItemContent(item: ITrackItem) {
    // Render item content based on type
    switch (item.type) {
      case "text":
        this.renderText(item);
        break;
      case "image":
        this.renderImage(item);
        break;
      case "custom":
        this.renderCustom(item);
        break;
    }
  }
}

// Use custom renderer
timeline.setCustomRenderer(new CustomRenderer(canvas));
```

### Custom Effects

```typescript
// Register custom effect
timeline.registerEffect("glow", {
  apply: (ctx: CanvasRenderingContext2D, item: ITrackItem, time: number) => {
    const glow = Math.sin(time * 0.001) * 0.5 + 0.5;
    ctx.shadowColor = `rgba(255, 255, 255, ${glow})`;
    ctx.shadowBlur = 20;
  },
});

// Apply custom effect to item
dispatch("add:effect", {
  payload: {
    itemId: "item-id",
    effect: "glow",
  },
});
```

## Custom Event Handlers

### Custom Event Processing

```typescript
// Register custom event handler
registerHandler("custom:event", (event) => {
  // Custom event processing logic
  console.log("Custom event received:", event);

  // Process custom event
  const { customData } = event.payload;

  // Update state based on custom event
  stateManager.updateState({
    customProperty: customData.value,
  });
});

// Dispatch custom event
dispatch("custom:event", {
  payload: {
    customData: {
      value: "custom value",
      timestamp: Date.now(),
    },
  },
});
```

### Custom Event Middleware

```typescript
// Custom middleware
useMiddleware((event, next) => {
  // Pre-processing
  console.log("Processing event:", event.type);

  // Add custom metadata
  event.metadata = {
    ...event.metadata,
    processedAt: Date.now(),
    customFlag: true,
  };

  // Continue processing
  const result = next(event);

  // Post-processing
  console.log("Event processed:", event.type);

  return result;
});
```

## Custom Validation

### Custom Validation Rules

```typescript
// Register custom validator
timeline.registerValidator("custom", {
  validateItem: (item: ITrackItem) => {
    // Custom item validation
    if (item.details.customProperty === "invalid") {
      return {
        valid: false,
        errors: ["Custom property cannot be 'invalid'"],
      };
    }
    return { valid: true };
  },

  validateTimeline: (timeline: ITimeline) => {
    // Custom timeline validation
    const errors = [];

    if (timeline.duration > 60000) {
      errors.push("Timeline duration cannot exceed 60 seconds");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },
});

// Use custom validation
const validation = timeline.validate();
if (!validation.valid) {
  console.error("Validation errors:", validation.errors);
}
```

## Custom Export Formats

### Custom Export Handlers

```typescript
// Register custom export format
timeline.registerExportFormat("custom", {
  export: async (state: State, options: any) => {
    // Custom export logic
    const customData = {
      version: "1.0",
      timestamp: Date.now(),
      items: state.trackItemIds.map(id => state.trackItemsMap[id]),
      metadata: {
        customProperty: options.customProperty
      }
    };

    // Convert to custom format
    const blob = new Blob([JSON.stringify(customData)], {
      type: "application/json"
    });

    return blob;
  },

    // Custom import logic
    const customData = JSON.parse(data);

    // Convert to state format
    const state: State = {
      // ... convert custom data to state
    };

    return state;
  }
});

// Use custom export format
const exportedData = await timeline.export("custom", {
  customProperty: "custom value"
});
```

## Custom Plugins

### Creating Plugins

```typescript
// Custom plugin
class CustomPlugin {
  constructor(timeline: Timeline, options: any) {
    this.timeline = timeline;
    this.options = options;
    this.init();
  }

  init() {
    // Initialize plugin
    this.registerCustomFeatures();
    this.setupEventListeners();
  }

  registerCustomFeatures() {
    // Register custom features
    this.timeline.registerItemType("plugin-item", {
      // ... custom item type
    });

    this.timeline.registerAnimationType("plugin-animation", {
      // ... custom animation type
    });
  }

  setupEventListeners() {
    // Setup custom event listeners
    subscribe("plugin:event", (event) => {
      this.handlePluginEvent(event);
    });
  }

  handlePluginEvent(event: any) {
    // Handle plugin-specific events
    console.log("Plugin event:", event);
  }

  destroy() {
    // Cleanup plugin
    // Remove event listeners, etc.
  }
}

// Use custom plugin
const plugin = new CustomPlugin(timeline, {
  customOption: "value",
});
```

## Custom Themes

### Creating Custom Themes

```typescript
// Custom theme
const customTheme = {
  name: "Custom Theme",
  colors: {
    primary: "#007acc",
    secondary: "#ff6b6b",
    background: "#1a1a1a",
    surface: "#2a2a2a",
    text: "#ffffff",
    textSecondary: "#cccccc",
  },
  fonts: {
    primary: "Arial, sans-serif",
    secondary: "Georgia, serif",
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
  },
};

// Apply custom theme
timeline.setTheme(customTheme);
```

## Performance Customization

### Custom Performance Settings

```typescript
// Custom performance configuration
timeline.setPerformanceConfig({
  rendering: {
    useRequestAnimationFrame: true,
    throttleUpdates: true,
    updateInterval: 16, // 60fps
    enableCaching: true,
    cacheSize: 100,
  },
  animations: {
    maxConcurrent: 10,
    maxPerItem: 5,
    enableOptimization: true,
  },
  transitions: {
    useHardwareAcceleration: true,
    preloadTransitions: true,
    maxConcurrent: 5,
  },
});
```

## Next Steps

- Check out [Examples](./examples.mdx) for practical usage
- Explore the [API Reference](./api-reference.mdx) for detailed API documentation
