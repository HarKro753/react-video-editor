The `DESIGN_RESIZE` action is a core functionality that allows users to dynamically resize the design canvas dimensions.

## Action Details

**Action Name:** `DESIGN_RESIZE`  
**Source:** `@designcombo/state`  
**Dispatch Method:** `dispatch(DESIGN_RESIZE, payload)`

## Payload Structure

```typescript
interface ResizeValue {
  width: number; // Canvas width in pixels
  height: number; // Canvas height in pixels
  name: string; // Aspect ratio identifier
}
```

## Usage

### Basic Implementation

```typescript
const handleResize = (options: ResizeValue) => {
  dispatch(DESIGN_RESIZE, {
    payload: {
      ...options,
    },
  });
};
```

### Example Usage

```typescript
// Resize to 16:9 landscape format
dispatch(DESIGN_RESIZE, {
  payload: {
    width: 1920,
    height: 1080,
    name: "16:9",
  },
});

// Resize to 9:16 portrait format
dispatch(DESIGN_RESIZE, {
  payload: {
    width: 1080,
    height: 1920,
    name: "9:16",
  },
});
```
