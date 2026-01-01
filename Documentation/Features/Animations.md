The DesignCombo Video Editor SDK provides a powerful animation system for creating dynamic and engaging video content.

## Animation Basics

Animations allow you to change element properties over time, creating smooth transitions and dynamic effects.

### Animation Structure

```typescript
interface IAnimation {
  property: string; // Property to animate
  from: number; // Starting value
  to: number; // Ending value
  durationInFrames: number; // Duration in frames
  ease: EasingFunction; // Easing function
  previewUrl?: string; // Preview image URL
  name?: string; // Animation name
  type?: "basic" | "special"; // Animation type
  details?: any; // Additional details
}
```

## Animation Types

### 1. Position Animations

Animate element position and movement.

```typescript
// Move element from left to right
dispatch(ADD_ANIMATION, {
  payload: {
    itemId: "text-item",
    animation: {
      property: "x",
      from: 0,
      to: 400,
      durationInFrames: 60,
      ease: "easeInOut",
    },
  },
});

// Move element in a path
dispatch(ADD_ANIMATION, {
  payload: {
    itemId: "image-item",
    animation: {
      property: "position",
      from: 0,
      to: 1,
      durationInFrames: 90,
      ease: "easeInOut",
    },
  },
});
```

### 2. Scale Animations

Animate element size and scaling.

```typescript
// Scale up element
dispatch(ADD_ANIMATION, {
  payload: {
    itemId: "text-item",
    animation: {
      property: "scaleX",
      from: 1,
      to: 2,
      durationInFrames: 45,
      ease: "easeOut",
    },
  },
});

// Scale both dimensions
dispatch(ADD_ANIMATION, {
  payload: {
    itemId: "image-item",
    animation: {
      property: "scale",
      from: 1,
      to: 1.5,
      durationInFrames: 60,
      ease: "easeInOut",
    },
  },
});
```

### 3. Rotation Animations

Animate element rotation.

```typescript
// Rotate element
dispatch(ADD_ANIMATION, {
  payload: {
    itemId: "shape-item",
    animation: {
      property: "rotation",
      from: 0,
      to: 360,
      durationInFrames: 90,
      ease: "linear",
    },
  },
});

// Rotate with bounce effect
dispatch(ADD_ANIMATION, {
  payload: {
    itemId: "text-item",
    animation: {
      property: "rotation",
      from: 0,
      to: 720,
      durationInFrames: 60,
      ease: "bounce",
    },
  },
});
```

### 4. Opacity Animations

Animate element transparency.

```typescript
// Fade in element
dispatch(ADD_ANIMATION, {
  payload: {
    itemId: "text-item",
    animation: {
      property: "opacity",
      from: 0,
      to: 1,
      durationInFrames: 30,
      ease: "easeIn",
    },
  },
});

// Fade out element
dispatch(ADD_ANIMATION, {
  payload: {
    itemId: "image-item",
    animation: {
      property: "opacity",
      from: 1,
      to: 0,
      durationInFrames: 30,
      ease: "easeOut",
    },
  },
});
```

### 5. Color Animations

Animate element colors.

```typescript
// Change text color
dispatch(ADD_ANIMATION, {
  payload: {
    itemId: "text-item",
    animation: {
      property: "color",
      from: 0,
      to: 1,
      durationInFrames: 60,
      ease: "easeInOut"
    }
  }
});

// Change background color
dispatch(ADD_ANIMATION, {
  payload: {
    itemId: "shape-item",
    animation: {
      property: "fill",
      from: 0,
      to: 1,
      durationInFrames: 90,
      ease: "easeInOut"
    }
  }
});
      easing: "easeInOut"
    }
  }
});
```

## Easing Functions

Easing functions control how animations accelerate and decelerate.

### Built-in Easing Functions

```typescript
// Linear - constant speed
easing: "linear";

// Ease In - slow start, fast end
easing: "easeIn";

// Ease Out - fast start, slow end
easing: "easeOut";

// Ease In Out - slow start and end, fast middle
easing: "easeInOut";

// Bounce - bouncy effect
easing: "bounce";

// Elastic - elastic effect
easing: "elastic";

// Back - overshoot effect
easing: "back";
```

### Custom Easing Functions

```typescript
// Custom cubic bezier
easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

// Custom function
easing: (t) => t * t * (3 - 2 * t);
```

## Animation Management

### Adding Animations

```typescript
// Add single animation
dispatch(ADD_ANIMATION, {
  payload: {
    itemId: "item-id",
    animation: {
      property: "x",
      from: 0,
      to: 400,
      durationInFrames: 60,
      ease: "easeInOut",
    },
  },
});

// Add multiple animations
dispatch(ADD_ANIMATIONS, {
  payload: {
    itemId: "item-id",
    animations: [
      {
        property: "x",
        from: 0,
        to: 400,
        durationInFrames: 60,
        ease: "easeInOut",
      },
      {
        property: "opacity",
        from: 0,
        to: 1,
        durationInFrames: 30,
        ease: "easeIn",
      },
    ],
  },
});
```

### Updating Animations

```typescript
// Update animation
dispatch("update:animation", {
  payload: {
    itemId: "item-id",
    animationId: "animation-id",
    updates: {
      duration: 3000,
      easing: "bounce",
    },
  },
});

// Update animation timing
dispatch(EDIT_OBJECT, {
  payload: {
    id: "item-id",
    updates: {
      animations: [
        {
          property: "x",
          from: 0,
          to: 400,
          durationInFrames: 60,
          ease: "easeInOut",
        },
      ],
    },
  },
});
```

### Removing Animations

```typescript
// Remove single animation
dispatch("remove:animation", {
  payload: {
    itemId: "item-id",
    animationId: "animation-id",
  },
});

// Remove all animations from item
dispatch("remove:animations", {
  payload: {
    itemId: "item-id",
  },
});

// Remove animations by type
dispatch("remove:animations:by-type", {
  payload: {
    itemId: "item-id",
    type: "position",
  },
});
```

## Animation Presets

### Common Animation Presets

```typescript
// Fade in preset
const fadeInPreset = {
  type: "opacity",
  property: "opacity",
  startValue: 0,
  endValue: 1,
  duration: 1000,
  easing: "easeIn",
};

// Slide in from left preset
const slideInLeftPreset = {
  type: "position",
  property: "x",
  startValue: -400,
  endValue: 0,
  duration: 1500,
  easing: "easeOut",
};

// Scale up preset
const scaleUpPreset = {
  type: "scale",
  property: "scale",
  startValue: { x: 0, y: 0 },
  endValue: { x: 1, y: 1 },
  duration: 1000,
  easing: "easeOut",
};

// Apply preset
dispatch(ADD_ANIMATION_PRESET, {
  payload: {
    itemId: "item-id",
    preset: "fadeIn",
  },
});
```

### Custom Presets

```typescript
// Create custom preset
const customPreset = {
  name: "Bounce In",
  animations: [
    {
      property: "scale",
      from: 0,
      to: 1.2,
      durationInFrames: 18,
      ease: "easeOut",
    },
    {
      property: "scale",
      from: 1.2,
      to: 1,
      durationInFrames: 12,
      ease: "bounce",
    },
  ],
};

// Register custom preset
timeline.registerAnimationPreset("bounceIn", customPreset);

// Use custom preset
dispatch(ADD_ANIMATION_PRESET, {
  payload: {
    itemId: "item-id",
    preset: "bounceIn",
  },
});
```

## Animation Sequences

### Creating Sequences

```typescript
// Create animation sequence
const sequence = [
  {
    property: "x",
    from: 0,
    to: 200,
    durationInFrames: 30,
    ease: "easeOut",
  },
  {
    property: "rotation",
    from: 0,
    to: 360,
    durationInFrames: 30,
    ease: "linear",
  },
  {
    property: "scale",
    from: 1,
    to: 2,
    durationInFrames: 30,
    ease: "easeInOut",
  },
];

// Apply sequence
dispatch(ADD_ANIMATION_SEQUENCE, {
  payload: {
    itemId: "item-id",
    sequence: ["fadeIn", "slideInRight", "pulseAnimationLoop"],
  },
});
```

### Chaining Animations

```typescript
// Chain animations automatically
dispatch("add:animation:chain", {
  payload: {
    itemId: "item-id",
    animations: [
      {
        type: "position",
        property: "x",
        startValue: 0,
        endValue: 200,
        duration: 1000,
      },
      {
        type: "rotation",
        property: "rotation",
        startValue: 0,
        endValue: 360,
        duration: 1000,
      },
    ],
    chain: true, // Automatically chain animations
  },
});
```

## Animation Performance

### Optimization Techniques

```typescript
// Enable animation optimization
timeline.enableAnimationOptimization({
  useRequestAnimationFrame: true,
  throttleUpdates: true,
  updateInterval: 16, // 60fps
});

// Limit concurrent animations
timeline.setAnimationLimits({
  maxConcurrent: 10,
  maxPerItem: 5,
});

// Enable animation caching
timeline.enableAnimationCaching({
  enabled: true,
  cacheSize: 100,
});
```

### Performance Monitoring

```typescript
// Monitor animation performance
timeline.onAnimationFrame((frameTime) => {
  console.log("Animation frame time:", frameTime);

  if (frameTime > 16) {
    console.warn("Animation performance issue detected");
  }
});

// Get animation statistics
const stats = timeline.getAnimationStats();
console.log("Active animations:", stats.activeCount);
console.log("Average frame time:", stats.averageFrameTime);
```

## Animation Events

### Animation Lifecycle Events

```typescript
// Animation start
timeline.onAnimationStart((animation) => {
  console.log("Animation started:", animation.id);
});

// Animation update
timeline.onAnimationUpdate((animation, progress) => {
  console.log("Animation progress:", progress);
});

// Animation complete
timeline.onAnimationComplete((animation) => {
  console.log("Animation completed:", animation.id);
});

// Animation loop
timeline.onAnimationLoop((animation) => {
  console.log("Animation looped:", animation.id);
});
```

## Next Steps

- Learn about [Transitions](./transitions.mdx)
- Explore the [API Reference](./development/api-reference.mdx)
- Check out [Examples](./development/examples.mdx) for practical usage
- Understand [Customization](./development/customization.mdx) for advanced usage
