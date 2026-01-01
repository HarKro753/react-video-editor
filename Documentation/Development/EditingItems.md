The `dispatch EDIT_OBJECT` pattern is the primary mechanism for modifying timeline objects in the scene.

### Key Benefits

- **Centralized State Management**: All object edits go through a single event system
- **Reactive Updates**: Changes automatically propagate to all connected components
- **Undo/Redo Support**: Built-in history management for object modifications
- **Type Safety**: Strong typing for payload structures
- **Performance**: Efficient updates without unnecessary re-renders

## Basic Pattern

### Import Required Dependencies

```typescript

```

### Basic Usage

```typescript
dispatch(EDIT_OBJECT, {
  payload: {
    [objectId]: {
      details: {
        // Properties to update
        propertyName: newValue,
      },
    },
  },
});
```

## Payload Structure

### Single Object Edit

```typescript
{
  payload: {
    [objectId]: {
      details: {
        // Update specific properties
        propertyName: newValue,
      },
    },
  },
}
```

### Multiple Objects Edit

```typescript
{
  payload: {
    [objectId1]: {
      details: {
        propertyName: newValue1,
      },
    },
    [objectId2]: {
      details: {
        propertyName: newValue2,
      },
    },
  },
}
```

### Direct Property Updates

```typescript
{
  payload: {
    [objectId]: {
      // Update properties directly (not in details)
      directProperty: newValue,
    },
  },
}
```

## Common Use Cases

### 1. Text Object Properties

```typescript
// Update font family
dispatch(EDIT_OBJECT, {
  payload: {
    [textItemId]: {
      details: {
        fontFamily: "Arial",
        fontUrl: "https://fonts.gstatic.com/s/arial/v1/...",
      },
    },
  },
});

// Update text content
dispatch(EDIT_OBJECT, {
  payload: {
    [textItemId]: {
      details: {
        text: "New text content",
      },
    },
  },
});

// Update styling
dispatch(EDIT_OBJECT, {
  payload: {
    [textItemId]: {
      details: {
        fontSize: 24,
        color: "#ff0000",
        opacity: 0.8,
        borderWidth: 2,
        borderColor: "#000000",
        boxShadow: {
          color: "rgba(0, 0, 0, 0.5)",
          x: 2,
          y: 2,
          blur: 4,
        },
      },
    },
  },
});
```

### 2. Media Object Properties

```typescript
// Update video properties
dispatch(EDIT_OBJECT, {
  payload: {
    [videoItemId]: {
      details: {
        playbackRate: 1.5,
        volume: 80,
        flipX: true,
        flipY: false,
        crop: {
          x: 100,
          y: 100,
          width: 800,
          height: 600,
        },
      },
    },
  },
});

// Update audio properties
dispatch(EDIT_OBJECT, {
  payload: {
    [audioItemId]: {
      details: {
        volume: 75,
      },
      playbackRate: 2.0, // Direct property
    },
  },
});

// Update image properties
dispatch(EDIT_OBJECT, {
  payload: {
    [imageItemId]: {
      details: {
        opacity: 0.9,
        flipX: false,
        flipY: true,
        crop: {
          x: 50,
          y: 50,
          width: 400,
          height: 300,
        },
      },
    },
  },
});
```

### 3. Position and Transform Properties

```typescript
// Update position
dispatch(EDIT_OBJECT, {
  payload: {
    [objectId]: {
      details: {
        left: "200px",
        top: "150px",
      },
    },
  },
});

// Update transform
dispatch(EDIT_OBJECT, {
  payload: {
    [objectId]: {
      details: {
        transform: "scale(1.5) rotate(45deg)",
        left: 200,
        top: 150,
      },
    },
  },
});

// Update dimensions
dispatch(EDIT_OBJECT, {
  payload: {
    [objectId]: {
      details: {
        width: 300,
        height: 200,
      },
    },
  },
});
```

### 4. Caption Properties

```typescript
// Update caption colors
dispatch(EDIT_OBJECT, {
  payload: {
    [captionItemId]: {
      details: {
        appearedColor: "#00ff00",
        activeColor: "#ff0000",
        activeFillColor: "#ffff00",
      },
    },
  },
});

// Update caption animation
dispatch(EDIT_OBJECT, {
  payload: {
    [captionItemId]: {
      details: {
        animation: "fade-in",
        animationDuration: 1000,
      },
    },
  },
});
```

## Advanced Patterns

### 1. Batch Updates

```typescript
// Update multiple properties at once
dispatch(EDIT_OBJECT, {
  payload: {
    [objectId]: {
      details: {
        fontSize: 18,
        color: "#333333",
        opacity: 0.9,
        borderWidth: 1,
        borderColor: "#cccccc",
        boxShadow: {
          color: "rgba(0, 0, 0, 0.2)",
          x: 1,
          y: 1,
          blur: 3,
        },
      },
    },
  },
});
```

### 2. Multiple Object Updates

```typescript
// Update multiple objects with the same properties
const objectIds = ["obj1", "obj2", "obj3"];
const payload = objectIds.reduce((acc, id) => {
  return {
    ...acc,
    [id]: {
      details: {
        opacity: 0.8,
        color: "#ff0000",
      },
    },
  };
}, {});

dispatch(EDIT_OBJECT, { payload });
```

### 3. Conditional Updates

```typescript
// Update properties based on conditions
const updatePayload = {
  [objectId]: {
    details: {
      ...(shouldFlipX && { flipX: true }),
      ...(shouldFlipY && { flipY: true }),
      ...(newOpacity && { opacity: newOpacity }),
    },
  },
};

dispatch(EDIT_OBJECT, { payload: updatePayload });
```

### 4. Preset Application

```typescript
// Apply preset to multiple objects
export const applyPreset = (preset: any, objectIds: string[]) => {
  const payload = objectIds.reduce((acc, id) => {
    return {
      ...acc,
      [id]: {
        details: {
          ...preset,
        },
      },
    };
  }, {});

  dispatch(EDIT_OBJECT, { payload });
};
```

## Best Practices

### 1. Property Organization

```typescript
// Good: Group related properties
dispatch(EDIT_OBJECT, {
  payload: {
    [objectId]: {
      details: {
        // Text properties
        text: "New content",
        fontSize: 16,
        fontFamily: "Arial",

        // Styling properties
        color: "#333333",
        opacity: 0.9,

        // Layout properties
        width: 200,
        height: 100,
      },
    },
  },
});

// Avoid: Scattered properties
dispatch(EDIT_OBJECT, {
  payload: {
    [objectId]: {
      details: {
        text: "New content",
        fontSize: 16,
        color: "#333333",
        width: 200,
        fontFamily: "Arial",
        opacity: 0.9,
        height: 100,
      },
    },
  },
});
```

### 2. Error Handling

```typescript
try {
  dispatch(EDIT_OBJECT, {
    payload: {
      [objectId]: {
        details: {
          propertyName: newValue,
        },
      },
    },
  });
} catch (error) {
  console.error("Failed to update object:", error);
  // Handle error appropriately
}
```

### 3. Validation

```typescript
// Validate values before dispatching
const updateObject = (objectId: string, propertyName: string, value: any) => {
  // Validate the value
  if (propertyName === "opacity" && (value < 0 || value > 1)) {
    throw new Error("Opacity must be between 0 and 1");
  }

  if (propertyName === "fontSize" && value < 1) {
    throw new Error("Font size must be greater than 0");
  }

  // Dispatch if validation passes
  dispatch(EDIT_OBJECT, {
    payload: {
      [objectId]: {
        details: {
          [propertyName]: value,
        },
      },
    },
  });
};
```

### 4. Performance Optimization

```typescript
// Batch multiple updates
const batchUpdate = (
  updates: Array<{ id: string; property: string; value: any }>
) => {
  const payload = updates.reduce((acc, update) => {
    return {
      ...acc,
      [update.id]: {
        details: {
          [update.property]: update.value,
        },
      },
    };
  }, {});

  dispatch(EDIT_OBJECT, { payload });
};

// Use for multiple property updates
batchUpdate([
  { id: "obj1", property: "opacity", value: 0.8 },
  { id: "obj2", property: "color", value: "#ff0000" },
  { id: "obj3", property: "fontSize", value: 18 },
]);
```
